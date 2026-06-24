# Chatbot FE Integration Guide

Guide này dành cho FE khi tích hợp AI Chatbot API trong Quizzy.

## 1. Base Config

Backend local:

```txt
http://localhost:3001
```

Frontend nên để env:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Tất cả chatbot endpoints cần JWT:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Backend response luôn được bọc bởi interceptor:

```json
{
  "success": true,
  "data": {}
}
```

Với API có phân trang:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "itemCount": 0,
    "pageCount": 0,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

## 2. Chat Flow

### Step 1: Create Conversation

```http
POST /v1/chatbot/conversations
```

Body chat thường:

```json
{
  "title": "AI Assistant"
}
```

Body chat theo deck:

```json
{
  "title": "Ask about this deck",
  "deckId": "<deckId>"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "conversationId",
    "title": "AI Assistant",
    "deckId": null,
    "type": "general",
    "messageCount": 0,
    "lastMessageAt": "2026-06-24T..."
  }
}
```

FE cần lưu `data._id` để gửi message.

### Step 2: Send Message

```http
POST /v1/chatbot/conversations/:conversationId/messages
```

Body:

```json
{
  "content": "Giải thích spaced repetition là gì?"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "userMessage": {
      "_id": "userMessageId",
      "role": "user",
      "content": "Giải thích spaced repetition là gì?"
    },
    "assistantMessage": {
      "_id": "assistantMessageId",
      "role": "assistant",
      "content": "Spaced repetition là..."
    }
  }
}
```

UI gợi ý:

- Khi user gửi message, append optimistic user bubble.
- Disable input hoặc show loading bubble trong lúc chờ response.
- Khi response về, replace optimistic bubble nếu cần và append assistant bubble.
- Nếu API lỗi 503/500 từ Gemini, show message: `AI đang bận, vui lòng thử lại sau`.

### Step 3: Load Conversation Messages

```http
GET /v1/chatbot/conversations/:conversationId/messages?page=1&limit=50
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "messageId",
      "role": "user",
      "content": "..."
    },
    {
      "_id": "messageId",
      "role": "assistant",
      "content": "..."
    }
  ],
  "meta": {}
}
```

## 3. Conversation List

```http
GET /v1/chatbot/conversations?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "conversationId",
      "title": "AI Assistant",
      "type": "general",
      "isArchived": false,
      "messageCount": 4,
      "lastMessageAt": "2026-06-24T..."
    }
  ],
  "meta": {}
}
```

Update title/archive:

```http
PATCH /v1/chatbot/conversations/:conversationId
```

```json
{
  "title": "New title",
  "isArchived": false
}
```

Delete conversation:

```http
DELETE /v1/chatbot/conversations/:conversationId
```

## 4. Generate Flashcards From Text

```http
POST /v1/chatbot/generate/text
```

Body:

```json
{
  "title": "OOP Basics",
  "rawText": "Object-oriented programming is based on objects, classes, encapsulation, inheritance, and polymorphism...",
  "cardCount": 5,
  "difficulty": "medium",
  "language": "vi",
  "conversationId": "optionalConversationId"
}
```

Rules:

- `rawText` tối đa 50000 ký tự.
- `cardCount` từ 5 đến 30.
- `difficulty`: `easy`, `medium`, hoặc `hard`.
- `conversationId` optional. Nếu có, bot sẽ gửi message thông báo trạng thái vào conversation đó.

Response:

```json
{
  "success": true,
  "data": {
    "jobId": "aiJobId",
    "sourceId": "aiSourceId",
    "bullJobId": "bullJobId",
    "status": "queued"
  }
}
```

Sau đó FE poll job status.

## 5. Generate Flashcards From PDF

```http
POST /v1/chatbot/generate/pdf
```

Content type:

```http
multipart/form-data
```

Fields:

```txt
file: PDF file
title: Document title
cardCount: 5
difficulty: medium
language: vi
conversationId: optionalConversationId
```

Giới hạn file:

```txt
10MB
```

Response giống generate text:

```json
{
  "success": true,
  "data": {
    "jobId": "aiJobId",
    "sourceId": "aiSourceId",
    "bullJobId": "bullJobId",
    "status": "queued"
  }
}
```

## 6. Poll Generate Job

```http
GET /v1/chatbot/generate/jobs/:jobId
```

Response queued/running:

```json
{
  "success": true,
  "data": {
    "_id": "jobId",
    "sourceId": "sourceId",
    "status": "running",
    "options": {
      "cardCount": 5,
      "difficulty": "medium",
      "language": "vi"
    }
  }
}
```

Response done:

```json
{
  "success": true,
  "data": {
    "_id": "jobId",
    "sourceId": "sourceId",
    "targetDeckId": "newDeckId",
    "status": "done",
    "usage": {
      "inputTokens": 1234,
      "outputTokens": 567
    }
  }
}
```

Response failed:

```json
{
  "success": true,
  "data": {
    "_id": "jobId",
    "status": "failed",
    "errorMessage": "AI returned invalid flashcard data"
  }
}
```

FE polling gợi ý:

- Poll mỗi 2 giây khi status là `queued` hoặc `running`.
- Stop polling khi status là `done` hoặc `failed`.
- Khi `done`, redirect user tới deck detail bằng `targetDeckId`.
- Khi `failed`, show error và cho user retry.

## 7. Minimal Fetch Client

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function apiFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload as { success: boolean; data: T; meta?: unknown };
}
```

Create conversation:

```ts
async function createConversation(token: string, deckId?: string) {
  return apiFetch<{ _id: string }>("/v1/chatbot/conversations", token, {
    method: "POST",
    body: JSON.stringify({
      title: "AI Assistant",
      deckId,
    }),
  });
}
```

Send message:

```ts
async function sendChatMessage(
  token: string,
  conversationId: string,
  content: string,
) {
  return apiFetch<{
    userMessage: { _id: string; role: "user"; content: string };
    assistantMessage: { _id: string; role: "assistant"; content: string };
  }>(`/v1/chatbot/conversations/${conversationId}/messages`, token, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
```

Generate from text:

```ts
async function generateFlashcardsFromText(token: string, rawText: string) {
  return apiFetch<{ jobId: string; status: string }>(
    "/v1/chatbot/generate/text",
    token,
    {
      method: "POST",
      body: JSON.stringify({
        title: "Generated Deck",
        rawText,
        cardCount: 10,
        difficulty: "medium",
        language: "vi",
      }),
    },
  );
}
```

Poll job:

```ts
async function getGenerateJob(token: string, jobId: string) {
  return apiFetch<{
    _id: string;
    status: "queued" | "running" | "done" | "failed";
    targetDeckId?: string;
    errorMessage?: string;
  }>(`/v1/chatbot/generate/jobs/${jobId}`, token);
}
```

## 8. UI States

Chat box states:

- `idle`: có thể nhập message.
- `sending`: đang chờ assistant response.
- `error`: Gemini/API lỗi, hiện retry.

Generate states:

- `idle`: chưa generate.
- `queued`: đã tạo job.
- `running`: worker đang gọi AI.
- `done`: đã tạo deck/cards, redirect tới deck.
- `failed`: cho user retry.

## 9. Common Errors

Missing JWT:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

Gemini busy:

```json
{
  "message": "AI service is busy. Please try again later",
  "statusCode": 503
}
```

Invalid request:

```json
{
  "message": ["cardCount must not be less than 5"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 10. Notes For FE

- Không gửi `GEMINI_API_KEY` lên frontend.
- FE chỉ gọi backend bằng JWT của user.
- Với chat theo deck, chỉ truyền `deckId` khi tạo conversation.
- Với generate PDF, không set `Content-Type` thủ công khi dùng `FormData`; browser tự set boundary.
- Nếu FE cần streaming real-time, backend hiện chưa có SSE. Hiện tại message API là request/response thường.
