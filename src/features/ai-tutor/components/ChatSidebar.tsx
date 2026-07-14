"use client";

import { FormEvent, useState } from "react";
import {
  Archive,
  Check,
  Loader2,
  MessageSquareText,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ChatConversation } from "@/services/api/chatbot.api";

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeConversationId?: string;
  error?: string;
  isLoading?: boolean;
  onSelect: (conversationId: string) => void;
  onNewChat: () => void;
  onArchive: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onRename: (conversationId: string, title: string) => void;
  renamingConversationId?: string;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  error,
  isLoading = false,
  onSelect,
  onNewChat,
  onArchive,
  onDelete,
  onRename,
  renamingConversationId,
}: ChatSidebarProps) {
  const [editingConversationId, setEditingConversationId] = useState<string>();
  const [editingTitle, setEditingTitle] = useState("");

  function beginRename(conversation: ChatConversation) {
    setEditingConversationId(conversation._id);
    setEditingTitle(conversation.title || "AI Assistant");
  }

  function submitRename(
    event: FormEvent<HTMLFormElement>,
    conversationId: string,
  ) {
    event.preventDefault();
    const title = editingTitle.trim();
    if (!title) return;
    onRename(conversationId, title);
    setEditingConversationId(undefined);
  }

  return (
    <aside className="flex min-h-[420px] flex-col rounded-[28px] border border-black/5 bg-white shadow-[0_12px_36px_rgba(27,28,25,0.05)] lg:h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between gap-3 border-b border-black/5 p-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
            Conversations
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-normal">AI Tutor</h2>
        </div>
        <button
          aria-label="Start new chat"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1c19] text-white transition hover:-translate-y-0.5 hover:bg-[#30312e]"
          onClick={onNewChat}
          type="button"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center gap-2 rounded-2xl bg-[#f6f3ee] px-4 py-3 text-sm font-bold text-[#777474]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading chats
          </div>
        ) : error ? (
          <div className="rounded-[22px] bg-[#fff0f0] p-4 text-sm font-bold text-[#a33a3a]">
            {error}
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => {
            const isActive = conversation._id === activeConversationId;
            const isEditing = editingConversationId === conversation._id;
            const isRenaming = renamingConversationId === conversation._id;

            return (
              <div
                className={cn(
                  "group rounded-[22px] border p-3 transition",
                  isActive
                    ? "border-[#cabeff] bg-[#f2eefe]"
                    : "border-transparent hover:bg-[#f6f3ee]",
                )}
                key={conversation._id}
              >
                <button
                  className="flex w-full items-start gap-3 text-left"
                  onClick={() => onSelect(conversation._id)}
                  type="button"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                      isActive
                        ? "bg-[#614db7] text-white"
                        : "bg-[#e6deff] text-[#614db7]",
                    )}
                  >
                    <MessageSquareText className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold tracking-normal text-[#1b1c19]">
                      {conversation.title || "AI Assistant"}
                    </span>
                    <span className="mt-1 block truncate text-xs font-semibold text-[#8a8784]">
                      {getConversationLabel(conversation)}
                    </span>
                  </span>
                </button>

                {isActive && (
                  <div className="mt-3 space-y-2 pl-[52px]">
                    {isEditing && (
                      <form
                        className="flex items-center gap-2"
                        onSubmit={(event) =>
                          submitRename(event, conversation._id)
                        }
                      >
                        <input
                          aria-label="Conversation title"
                          autoFocus
                          className="h-9 min-w-0 flex-1 rounded-full border border-[#cabeff] bg-white px-3 text-xs font-bold text-[#1b1c19] outline-none focus:ring-4 focus:ring-[#9b87f5]/10"
                          maxLength={80}
                          onChange={(event) =>
                            setEditingTitle(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              setEditingConversationId(undefined);
                            }
                          }}
                          value={editingTitle}
                        />
                        <button
                          aria-label="Save title"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#614db7] text-white disabled:opacity-50"
                          disabled={!editingTitle.trim() || isRenaming}
                          type="submit"
                        >
                          {isRenaming ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          aria-label="Cancel rename"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#777474] hover:text-[#1b1c19]"
                          onClick={() => setEditingConversationId(undefined)}
                          type="button"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#777474] hover:text-[#614db7]"
                        onClick={() => beginRename(conversation)}
                        type="button"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Rename
                      </button>
                      <button
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#777474] hover:text-[#614db7]"
                        onClick={() => onArchive(conversation._id)}
                        type="button"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </button>
                      <button
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#a33a3a] hover:bg-[#fff0f0]"
                        onClick={() => onDelete(conversation._id)}
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#cabeff] bg-[#f8f5ff] p-5 text-center">
            <MessageSquareText className="mx-auto h-7 w-7 text-[#614db7]" />
            <p className="mt-3 text-sm font-bold text-[#1b1c19]">
              No conversations yet
            </p>
            <p className="mt-1 text-xs leading-5 text-[#777474]">
              Start a new chat and ask about your notes.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function getConversationLabel(conversation: ChatConversation) {
  if (conversation.type === "deck_chat") {
    return `Deck chat - ${conversation.messageCount} messages`;
  }

  if (conversation.type === "academic_document_chat") {
    return `Document chat - ${conversation.messageCount} messages`;
  }

  return `${conversation.messageCount} messages`;
}
