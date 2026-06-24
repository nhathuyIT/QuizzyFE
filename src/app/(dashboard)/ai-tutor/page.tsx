"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  Loader2,
  MessageSquareText,
  Sparkles,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { ChatInput } from "@/features/ai-tutor/components/ChatInput";
import { ChatMessage } from "@/features/ai-tutor/components/ChatMessage";
import { ChatSidebar } from "@/features/ai-tutor/components/ChatSidebar";
import {
  chatbotAPI,
  type ApiResponse,
  type ChatMessage as ChatMessageRecord,
  type CreateConversationInput,
  type FlashcardDifficulty,
  type GenerateJobStatus,
} from "@/services/api";
import { cn } from "@/lib/utils/cn";

type LocalMessage = Pick<ChatMessageRecord, "_id" | "role" | "content"> & {
  isPending?: boolean;
  isError?: boolean;
};

const difficultyOptions: Array<{
  value: FlashcardDifficulty;
  label: string;
}> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const statusLabels: Record<GenerateJobStatus, string> = {
  queued: "Queued",
  running: "Generating",
  done: "Deck ready",
  failed: "Failed",
};

const GENERATED_CARD_COUNT = 5;
const MIN_RAW_TEXT_LENGTH = 5;
const MAX_CHAT_MESSAGE_LENGTH = 2000;
const MAX_RAW_TEXT_LENGTH = 50000;
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export default function AITutorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const handledDeckContextRef = useRef<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const deckContextId = searchParams.get("deckId")?.trim() || undefined;
  const deckContextTitle = searchParams.get("deckTitle")?.trim() || undefined;
  const initialPrompt = searchParams
    .get("prompt")
    ?.trim()
    .slice(0, MAX_CHAT_MESSAGE_LENGTH);
  const deckConversationTitle = deckContextTitle
    ? `Ask about ${deckContextTitle}`
    : "Ask about this deck";
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [draft, setDraft] = useState(initialPrompt ?? "");
  const [chatError, setChatError] = useState("");
  const [pendingMessages, setPendingMessages] = useState<LocalMessage[]>([]);
  const [lastFailedPrompt, setLastFailedPrompt] = useState("");
  const [generateMode, setGenerateMode] = useState<"text" | "pdf">("text");
  const [generateTitle, setGenerateTitle] = useState("Generated study deck");
  const [rawText, setRawText] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [cardCount, setCardCount] = useState<number | undefined>(10);
  const [difficulty, setDifficulty] = useState<FlashcardDifficulty>("medium");
  const [language, setLanguage] = useState("vi");
  const [activeJobId, setActiveJobId] = useState<string>();
  const [formError, setFormError] = useState("");

  const conversationsQuery = useQuery({
    queryKey: ["chatbot", "conversations"],
    queryFn: () => chatbotAPI.getConversations({ page: 1, limit: 20 }),
    retry: false,
  });

  const conversations = useMemo(
    () => conversationsQuery.data?.data ?? [],
    [conversationsQuery.data?.data],
  );
  const deckConversation = useMemo(
    () =>
      deckContextId
        ? conversations.find(
            (conversation) => conversation.deckId === deckContextId,
          )
        : undefined,
    [conversations, deckContextId],
  );
  const storedActiveConversation = conversations.find(
    (conversation) => conversation._id === activeConversationId,
  );
  const activeConversationMatchesContext =
    !deckContextId || storedActiveConversation?.deckId === deckContextId;
  const selectedConversationId =
    (activeConversationMatchesContext ? activeConversationId : undefined) ??
    deckConversation?._id ??
    (deckContextId ? undefined : conversations[0]?._id);
  const activeConversation = conversations.find(
    (conversation) => conversation._id === selectedConversationId,
  );
  const sidebarConversations = useMemo(
    () =>
      deckContextId
        ? conversations.filter(
            (conversation) => conversation.deckId === deckContextId,
          )
        : conversations,
    [conversations, deckContextId],
  );

  const messagesQuery = useQuery({
    queryKey: ["chatbot", "messages", selectedConversationId],
    queryFn: () =>
      chatbotAPI.getMessages(selectedConversationId!, { page: 1, limit: 50 }),
    enabled: Boolean(selectedConversationId),
    retry: false,
  });

  const jobQuery = useQuery({
    queryKey: ["chatbot", "generate-job", activeJobId],
    queryFn: () => chatbotAPI.getGenerateJob(activeJobId!),
    enabled: Boolean(activeJobId),
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status === "queued" || status === "running" ? 2000 : false;
    },
  });

  const visibleMessages = useMemo(
    () => [...(messagesQuery.data?.data ?? []), ...pendingMessages],
    [messagesQuery.data?.data, pendingMessages],
  );
  const currentJob = jobQuery.data?.data;

  useEffect(() => {
    if (currentJob?.status === "done" && currentJob.targetDeckId) {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      router.push(`/decks/${currentJob.targetDeckId}`);
    }
  }, [currentJob, queryClient, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  function getNewConversationInput(
    title = "AI Assistant",
  ): CreateConversationInput {
    return deckContextId
      ? {
          title: deckConversationTitle,
          deckId: deckContextId,
        }
      : { title };
  }

  const createConversationMutation = useMutation({
    mutationFn: (data?: CreateConversationInput) =>
      chatbotAPI.createConversation(data ?? getNewConversationInput()),
    onSuccess: (response) => {
      setActiveConversationId(response.data._id);
      setPendingMessages([]);
      queryClient.invalidateQueries({ queryKey: ["chatbot", "conversations"] });
    },
  });

  function getFriendlyChatError(error: Error) {
    const status =
      "status" in error && typeof error.status === "number"
        ? error.status
        : undefined;

    if (
      status === 500 ||
      status === 503 ||
      error.message.includes("busy") ||
      error.message.includes("RATE_LIMIT")
    ) {
      return "AI đang bận, vui lòng thử lại sau.";
    }

    return error.message || "AI could not answer right now.";
  }

  useEffect(() => {
    if (!deckContextId) {
      handledDeckContextRef.current = undefined;
      return;
    }

    if (conversationsQuery.isLoading || conversationsQuery.isError) return;

    const activeMatchesDeck = conversations.some(
      (conversation) =>
        conversation._id === activeConversationId &&
        conversation.deckId === deckContextId,
    );

    if (activeMatchesDeck) {
      handledDeckContextRef.current = deckContextId;
      return;
    }

    if (handledDeckContextRef.current === deckContextId) return;

    handledDeckContextRef.current = deckContextId;
    if (deckConversation) return;

    createConversationMutation.mutate({
      title: deckConversationTitle,
      deckId: deckContextId,
    });
  }, [
    activeConversationId,
    conversations,
    conversationsQuery.isError,
    conversationsQuery.isLoading,
    createConversationMutation,
    deckContextId,
    deckConversation,
    deckConversationTitle,
  ]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      let conversationId = activeConversationId;
      conversationId ??= selectedConversationId;
      if (!conversationId) {
        const conversationResponse = await chatbotAPI.createConversation(
          getNewConversationInput(content.slice(0, 60) || "AI Assistant"),
        );
        conversationId = conversationResponse.data._id;
        setActiveConversationId(conversationId);
      }

      const messageResponse = await chatbotAPI.sendMessage(
        conversationId,
        content,
      );

      return { conversationId, response: messageResponse };
    },
    onMutate: (content) => {
      const now = Date.now();
      setLastFailedPrompt("");
      setPendingMessages([
        {
          _id: `local-user-${now}`,
          role: "user",
          content,
        },
        {
          _id: `local-assistant-${now}`,
          role: "assistant",
          content: "",
          isPending: true,
        },
      ]);
      setDraft("");
    },
    onSuccess: ({ conversationId, response }) => {
      setPendingMessages([]);
      queryClient.setQueryData<ApiResponse<ChatMessageRecord[]>>(
        ["chatbot", "messages", conversationId],
        (current) => {
          const responseMessages = [
            response.data.userMessage,
            response.data.assistantMessage,
          ];

          if (!current) {
            return {
              success: true,
              data: responseMessages,
            };
          }

          const existingIds = new Set(
            current.data.map((message) => message._id),
          );

          return {
            ...current,
            data: [
              ...current.data,
              ...responseMessages.filter(
                (message) => !existingIds.has(message._id),
              ),
            ],
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["chatbot", "conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["chatbot", "messages", conversationId],
      });
    },
    onError: (error: Error, content) => {
      setLastFailedPrompt(content);
      setPendingMessages([
        {
          _id: `failed-user-${Date.now()}`,
          role: "user",
          content,
        },
        {
          _id: `failed-assistant-${Date.now()}`,
          role: "assistant",
          content: getFriendlyChatError(error),
          isError: true,
        },
      ]);
    },
  });

  const archiveConversationMutation = useMutation({
    mutationFn: (conversationId: string) =>
      chatbotAPI.updateConversation(conversationId, { isArchived: true }),
    onSuccess: (_, conversationId) => {
      if (conversationId === selectedConversationId) {
        setActiveConversationId(undefined);
      }
      queryClient.invalidateQueries({ queryKey: ["chatbot", "conversations"] });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: string) =>
      chatbotAPI.deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      if (conversationId === selectedConversationId) {
        setActiveConversationId(undefined);
        setPendingMessages([]);
      }
      queryClient.invalidateQueries({ queryKey: ["chatbot", "conversations"] });
    },
  });

  const renameConversationMutation = useMutation({
    mutationFn: ({
      conversationId,
      title,
    }: {
      conversationId: string;
      title: string;
    }) => chatbotAPI.updateConversation(conversationId, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbot", "conversations"] });
    },
  });

  const generateMutation = useMutation({
    mutationFn: () => {
      const conversationId = selectedConversationId;
      if (generateMode === "pdf") {
        if (!pdfFile) throw new Error("Choose a PDF first.");
        return chatbotAPI.generateFromPdf({
          file: pdfFile,
          title: generateTitle.trim(),
          cardCount,
          difficulty,
          language: language.trim(),
          conversationId,
        });
      }

      return chatbotAPI.generateFromText({
        title: generateTitle.trim(),
        rawText: rawText.trim(),
        cardCount,
        difficulty,
        language: language.trim(),
        conversationId,
      });
    },
    onMutate: () => {
      setActiveJobId(undefined);
    },
    onSuccess: (response) => {
      setFormError("");
      setActiveJobId(response.data.jobId);
      if (selectedConversationId) {
        queryClient.invalidateQueries({
          queryKey: ["chatbot", "messages", selectedConversationId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["chatbot", "conversations"] });
    },
    onError: (error: Error) => {
      setFormError(error.message || "Could not start generation.");
    },
  });

  function handleSend() {
    const content = draft.trim();
    if (!content || sendMessageMutation.isPending) return;
    if (content.length > MAX_CHAT_MESSAGE_LENGTH) {
      setChatError(
        `Message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer.`,
      );
      return;
    }
    setChatError("");
    sendMessageMutation.mutate(content);
  }

  function retryLastMessage() {
    if (!lastFailedPrompt || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(lastFailedPrompt);
  }

  function handlePdfFileChange(file: File | null) {
    setPdfFile(file);
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFormError("Choose a PDF file.");
      return;
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      setFormError("PDF must be 10MB or smaller.");
      return;
    }

    setFormError("");
  }

  function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const trimmedRawText = rawText.trim();
    const trimmedLanguage = language.trim();

    if (!generateTitle.trim()) {
      setFormError("Deck title is required.");
      return;
    }

    if (!trimmedLanguage) {
      setFormError("Language is required.");
      return;
    }

    if (cardCount === undefined || !Number.isInteger(cardCount) || cardCount < 5 || cardCount > 30) {
      setFormError("Card count must be between 5 and 30.");
      return;
    }

    if (
      generateMode === "text" &&
      trimmedRawText.length < MIN_RAW_TEXT_LENGTH
    ) {
      setFormError(
        `Paste at least ${MIN_RAW_TEXT_LENGTH} characters of notes.`,
      );
      return;
    }

    if (
      generateMode === "text" &&
      trimmedRawText.length > MAX_RAW_TEXT_LENGTH
    ) {
      setFormError("Notes must be 50,000 characters or fewer.");
      return;
    }

    if (generateMode === "pdf") {
      if (!pdfFile) {
        setFormError("Choose a PDF first.");
        return;
      }

      if (pdfFile.size > MAX_PDF_SIZE_BYTES) {
        setFormError("PDF must be 10MB or smaller.");
        return;
      }

      const isPdf =
        pdfFile.type === "application/pdf" ||
        pdfFile.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        setFormError("Choose a PDF file.");
        return;
      }
    }

    generateMutation.mutate();
  }

  const isGenerating =
    generateMutation.isPending ||
    currentJob?.status === "queued" ||
    currentJob?.status === "running";

  const displayFormError = formError || (cardCount === undefined ? "Card count is required." : "");

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
              AI Tutor
            </h1>
          </div>
          <button
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1b1c19] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#30312e]"
            disabled={createConversationMutation.isPending}
            onClick={() => createConversationMutation.mutate(undefined)}
            type="button"
          >
            {createConversationMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquareText className="h-4 w-4" />
            )}
            {deckContextId ? "New deck chat" : "New chat"}
          </button>
        </header>

        <div className="grid flex-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)_330px]">
          <ChatSidebar
            activeConversationId={selectedConversationId}
            conversations={sidebarConversations}
            error={
              conversationsQuery.isError
                ? conversationsQuery.error.message
                : undefined
            }
            isLoading={
              conversationsQuery.isLoading ||
              (Boolean(deckContextId) &&
                createConversationMutation.isPending &&
                sidebarConversations.length === 0)
            }
            onArchive={(conversationId) =>
              archiveConversationMutation.mutate(conversationId)
            }
            onDelete={(conversationId) =>
              deleteConversationMutation.mutate(conversationId)
            }
            onNewChat={() => createConversationMutation.mutate(undefined)}
            onRename={(conversationId, title) =>
              renameConversationMutation.mutate({ conversationId, title })
            }
            onSelect={(conversationId) => {
              setActiveConversationId(conversationId);
              setPendingMessages([]);
              setLastFailedPrompt("");
            }}
            renamingConversationId={
              renameConversationMutation.isPending
                ? renameConversationMutation.variables?.conversationId
                : undefined
            }
          />

          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_16px_44px_rgba(27,28,25,0.06)] lg:h-[calc(100vh-140px)]">
            <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
                  <BrainCircuit className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold tracking-normal">
                    {activeConversation?.title || "Quizzy study assistant"}
                  </h2>
                  <p className="text-xs font-semibold text-[#9a9692]">
                    {activeConversation?.type === "deck_chat"
                      ? `Deck chat - ${activeConversation.messageCount} messages`
                      : `${activeConversation?.messageCount ?? 0} messages`}
                  </p>
                </div>
              </div>
              <span className="hidden rounded-full bg-[#f2eefe] px-3 py-1.5 text-xs font-bold text-[#614db7] sm:inline-flex">
                Request/response
              </span>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto bg-[#fbf9f4] p-5 custom-scrollbar sm:p-6">
              {messagesQuery.isLoading && pendingMessages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm font-bold text-[#777474]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading messages
                </div>
              ) : messagesQuery.isError ? (
                <div className="rounded-[22px] bg-[#fff0f0] px-5 py-4 text-sm font-bold text-[#a33a3a]">
                  {messagesQuery.error.message}
                </div>
              ) : visibleMessages.length > 0 ? (
                <>
                  {visibleMessages.map((message) => (
                    <ChatMessage
                      content={message.content}
                      isError={isLocalMessage(message) && message.isError}
                      isPending={isLocalMessage(message) && message.isPending}
                      key={message._id}
                      onRetry={retryLastMessage}
                      role={message.role}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <EmptyChatState />
              )}
            </div>

            <ChatInput
              disabled={messagesQuery.isLoading}
              error={chatError}
              isSending={sendMessageMutation.isPending}
              maxLength={MAX_CHAT_MESSAGE_LENGTH}
              onChange={(value) => {
                setDraft(value);
                if (chatError) setChatError("");
              }}
              onSubmit={handleSend}
              value={draft}
            />
          </section>

          <FlashcardGenerator
            cardCount={cardCount}
            difficulty={difficulty}
            file={pdfFile}
            formError={displayFormError}
            generateMode={generateMode}
            isGenerating={isGenerating}
            job={currentJob}
            language={language}
            onCardCountChange={setCardCount}
            onDifficultyChange={setDifficulty}
            onFileChange={handlePdfFileChange}
            onGenerate={handleGenerate}
            onLanguageChange={setLanguage}
            onModeChange={setGenerateMode}
            onRawTextChange={setRawText}
            onTitleChange={setGenerateTitle}
            rawText={rawText}
            title={generateTitle}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyChatState() {
  return (
    <div className="flex h-full min-h-[360px] items-center justify-center">
      <div className="max-w-[420px] text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#e6deff] text-[#614db7]">
          <BrainCircuit className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-normal">
          Ask about anything you are studying
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#777474]">
          Paste a question, notes, or a concept you want Quizzy to unpack.
        </p>
      </div>
    </div>
  );
}

function isLocalMessage(
  message: ChatMessageRecord | LocalMessage,
): message is LocalMessage {
  return "isPending" in message || "isError" in message;
}

interface FlashcardGeneratorProps {
  generateMode: "text" | "pdf";
  title: string;
  rawText: string;
  file: File | null;
  cardCount: number | undefined;
  difficulty: FlashcardDifficulty;
  language: string;
  isGenerating: boolean;
  formError: string;
  job?: {
    status: GenerateJobStatus;
    targetDeckId?: string;
    errorMessage?: string;
  };
  onModeChange: (mode: "text" | "pdf") => void;
  onTitleChange: (value: string) => void;
  onRawTextChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onCardCountChange: (value: number | undefined) => void;
  onDifficultyChange: (value: FlashcardDifficulty) => void;
  onLanguageChange: (value: string) => void;
  onGenerate: (event: FormEvent<HTMLFormElement>) => void;
}

function FlashcardGenerator({
  generateMode,
  title,
  rawText,
  file,
  cardCount,
  difficulty,
  language,
  isGenerating,
  formError,
  job,
  onModeChange,
  onTitleChange,
  onRawTextChange,
  onFileChange,
  onCardCountChange,
  onDifficultyChange,
  onLanguageChange,
  onGenerate,
}: FlashcardGeneratorProps) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[28px] bg-[#311485] p-5 text-white shadow-[0_16px_40px_rgba(49,20,133,0.18)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f5d547]">
          <Wand2 className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-normal">
          Generate flashcards
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/65">
          {job ? `Status: ${statusLabels[job.status]}` : "Text or PDF to deck"}
        </p>
        {job?.status === "done" && job.targetDeckId && (
          <Link
            className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#f5d547]"
            href={`/decks/${job.targetDeckId}`}
          >
            Open deck <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        {job?.status === "failed" && (
          <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-[#ffd9d9]">
            {job.errorMessage || "Generation failed."}
          </p>
        )}
      </section>

      <form
        className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)]"
        onSubmit={onGenerate}
      >
        <div className="flex rounded-full bg-[#f6f3ee] p-1">
          {(["text", "pdf"] as const).map((mode) => (
            <button
              className={cn(
                "flex-1 rounded-full px-3 py-2 text-xs font-bold capitalize transition",
                generateMode === mode
                  ? "bg-[#1b1c19] text-white"
                  : "text-[#777474] hover:text-[#1b1c19]",
              )}
              disabled={isGenerating}
              key={mode}
              onClick={() => onModeChange(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm font-bold text-[#1b1c19]">
          Deck title
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 text-sm font-medium outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10"
            disabled={isGenerating}
            onChange={(event) => onTitleChange(event.target.value)}
            value={title}
          />
        </label>

        {generateMode === "text" ? (
          <label className="mt-4 block text-sm font-bold text-[#1b1c19]">
            Notes
            <textarea
              className="mt-2 h-40 w-full resize-none rounded-2xl border border-black/10 bg-[#fbf9f4] p-4 text-sm font-medium leading-6 outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10 custom-scrollbar"
              disabled={isGenerating}
              onChange={(event) => onRawTextChange(event.target.value)}
              placeholder="Paste your notes here..."
              value={rawText}
            />
          </label>
        ) : (
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#cabeff] bg-[#f8f5ff] px-4 py-8 text-center text-[#614db7]">
            <UploadCloud className="h-8 w-8" />
            <span className="mt-3 text-sm font-bold">
              {file?.name || "Choose PDF"}
            </span>
            <span className="mt-1 text-xs font-semibold text-[#8a8784]">
              Up to 10MB
            </span>
            <input
              accept="application/pdf"
              className="hidden"
              disabled={isGenerating}
              onChange={(event) =>
                onFileChange(event.target.files?.[0] ?? null)
              }
              type="file"
            />
          </label>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block text-sm font-bold text-[#1b1c19]">
            Cards (5-30)
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 text-sm font-medium outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10"
              disabled={isGenerating}
              max={30}
              min={5}
              onChange={(event) => {
                const val = event.target.value;
                if (val === "") {
                  onCardCountChange(undefined);
                } else {
                  const num = parseInt(val, 10);
                  onCardCountChange(isNaN(num) ? undefined : num);
                }
              }}
              type="number"
              value={cardCount ?? ""}
            />
          </label>
          <label className="block text-sm font-bold text-[#1b1c19]">
            Language
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 text-sm font-medium outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10"
              disabled={isGenerating}
              onChange={(event) => onLanguageChange(event.target.value)}
              value={language}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {difficultyOptions.map((option) => (
            <button
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition",
                difficulty === option.value
                  ? "bg-[#e6deff] text-[#311485]"
                  : "bg-[#f6f3ee] text-[#777474] hover:text-[#1b1c19]",
              )}
              disabled={isGenerating}
              key={option.value}
              onClick={() => onDifficultyChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        {formError && (
          <div className="mt-4 rounded-2xl bg-[#fff0f0] px-4 py-3 text-sm font-bold text-[#a33a3a]">
            {formError}
          </div>
        )}

        {job?.status && job.status !== "failed" && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f6f3ee] px-4 py-3 text-sm font-bold text-[#5f5e5e]">
            {job.status === "done" ? (
              <CheckCircle2 className="h-5 w-5 text-[#276345]" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-[#614db7]" />
            )}
            {statusLabels[job.status]}
          </div>
        )}

        <button
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#614db7] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#614db7]/20 transition hover:-translate-y-0.5 hover:bg-[#49339d] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isGenerating || cardCount === undefined}
          type="submit"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : generateMode === "pdf" ? (
            <FileText className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? "Generating..." : "Generate deck"}
        </button>
      </form>
    </aside>
  );
}
