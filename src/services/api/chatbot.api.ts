import { apiClient, type ApiResponse, type QueryParams } from "./client";

export type ChatRole = "user" | "assistant";
export type ConversationType = "general" | "deck_chat";
export type FlashcardDifficulty = "easy" | "medium" | "hard";
export type GenerateJobStatus = "queued" | "running" | "done" | "failed";

export interface ChatConversation {
  _id: string;
  userId: string;
  title: string;
  deckId?: string;
  type: ConversationType;
  isArchived: boolean;
  messageCount: number;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  userId?: string;
  role: ChatRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConversationInput {
  title?: string;
  deckId?: string;
}

export interface UpdateConversationInput {
  title?: string;
  isArchived?: boolean;
}

export interface SendMessageResult {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

export interface GenerateFromTextInput {
  title: string;
  rawText: string;
  cardCount?: number;
  difficulty?: FlashcardDifficulty;
  language?: string;
  conversationId?: string;
}

export interface GenerateFromPdfInput {
  file: File;
  title: string;
  cardCount?: number;
  difficulty?: FlashcardDifficulty;
  language?: string;
  conversationId?: string;
}

export interface GenerateQueuedJob {
  jobId: string;
  sourceId: string;
  bullJobId?: string;
  status: GenerateJobStatus;
}

export interface GenerateJob {
  _id: string;
  sourceId: string;
  targetDeckId?: string;
  status: GenerateJobStatus;
  options?: {
    cardCount: number;
    difficulty: FlashcardDifficulty;
    language: string;
  };
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  errorMessage?: string;
  finishedAt?: string;
}

export interface ChatbotListParams extends QueryParams {
  page?: number;
  limit?: number;
  includeArchived?: boolean;
}

export const chatbotAPI = {
  createConversation: (data: CreateConversationInput = {}) =>
    apiClient.post<ApiResponse<ChatConversation>>(
      "/chatbot/conversations",
      data,
    ),
  getConversations: (params: ChatbotListParams = {}) =>
    apiClient.get<ApiResponse<ChatConversation[]>>(
      "/chatbot/conversations",
      params,
    ),
  getConversation: (id: string, params: ChatbotListParams = {}) =>
    apiClient.get<
      ApiResponse<{
        conversation: ChatConversation;
        messages: {
          data: ChatMessage[];
          meta?: unknown;
        };
      }>
    >(`/chatbot/conversations/${id}`, params),
  updateConversation: (id: string, data: UpdateConversationInput) =>
    apiClient.patch<ApiResponse<ChatConversation>>(
      `/chatbot/conversations/${id}`,
      data,
    ),
  deleteConversation: (id: string) =>
    apiClient.delete<ApiResponse<{ deleted: boolean }>>(
      `/chatbot/conversations/${id}`,
    ),
  getMessages: (conversationId: string, params: ChatbotListParams = {}) =>
    apiClient.get<ApiResponse<ChatMessage[]>>(
      `/chatbot/conversations/${conversationId}/messages`,
      params,
    ),
  sendMessage: (conversationId: string, content: string) =>
    apiClient.post<ApiResponse<SendMessageResult>>(
      `/chatbot/conversations/${conversationId}/messages`,
      { content },
    ),
  generateFromText: (data: GenerateFromTextInput) =>
    apiClient.post<ApiResponse<GenerateQueuedJob>>(
      "/chatbot/generate/text",
      data,
    ),
  generateFromPdf: ({
    file,
    title,
    cardCount,
    difficulty,
    language,
    conversationId,
  }: GenerateFromPdfInput) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (cardCount) formData.append("cardCount", String(cardCount));
    if (difficulty) formData.append("difficulty", difficulty);
    if (language) formData.append("language", language);
    if (conversationId) formData.append("conversationId", conversationId);

    return apiClient.post<ApiResponse<GenerateQueuedJob>>(
      "/chatbot/generate/pdf",
      formData,
    );
  },
  getGenerateJob: (jobId: string) =>
    apiClient.get<ApiResponse<GenerateJob>>(`/chatbot/generate/jobs/${jobId}`),
};
