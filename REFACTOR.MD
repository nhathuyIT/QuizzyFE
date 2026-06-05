Refactor API Layer theo chuẩn FranchisePlus
Chuyển đổi API layer từ file monolith src/services/api.ts (dùng raw fetch) sang kiến trúc modular src/api/ theo đúng cấu trúc trong ảnh và chuẩn API_GUIDELINES.md (dùng Axios + interceptors).

User Review Required
IMPORTANT

Cần cài thêm 2 dependencies mới:

axios — HTTP client thay thế raw fetch
lodash + @types/lodash — cho hàm camelCase/snakeCase convert tự động qua interceptors
Đây là yêu cầu bắt buộc từ API_GUIDELINES.md.

WARNING

Env variable thay đổi: API_GUIDELINES.md dùng import.meta.env.VITE_API_URL (Vite). Nhưng dự án này là Next.js nên tôi sẽ đổi thành process.env.NEXT_PUBLIC_API_URL. Bạn cần đảm bảo biến này được set trong .env.local.

IMPORTANT

Xóa code cũ: Sau khi migrate xong, file src/services/api.ts và folder src/services/api/ (client.ts, endpoints.ts) sẽ bị xóa. Tất cả import sẽ chuyển sang @/api/....

Open Questions
IMPORTANT

Backend trả snake_case hay camelCase? — API_GUIDELINES.md có cơ chế auto-convert snake_case ↔ camelCase qua interceptors. Nếu backend Quizzy NestJS đã trả camelCase sẵn thì không cần bật convert. Bạn muốn bật hay tắt tính năng này?
Token lưu ở đâu? — Code hiện tại lưu accessToken trong localStorage. API_GUIDELINES.md dùng withCredentials: true (HttpOnly Cookie). Bạn muốn giữ localStorage hay chuyển sang Cookie?
Proposed Changes
Cấu trúc folder mới

src/
├── api/                          ← NEW (thay thế src/services/)
│   ├── auth/                     ← Auth module
│   │   └── auth.api.ts           ← register, login, getMe
│   ├── deck/                     ← Deck module
│   │   └── deck.api.ts           ← create, search, getById, getDeckCards, update
│   ├── card/                     ← Card module
│   │   └── card.api.ts           ← getAll, getById, getByDeck, create, bulkCreate, update, delete
│   ├── axios.config.ts           ← Axios instance + interceptors (core)
│   ├── http.type.ts              ← HttpError, ApiSuccessResponse, ApiPaginatedResponse (core)
│   └── httpClient.api.ts         ← HTTP wrapper: get, post, put, patch, delete (core)
1. Dependencies
[NEW] Cài dependencies
bash

npm install axios lodash
npm install -D @types/lodash
2. Core HTTP Layer — src/api/
[NEW] 
http.type.ts
Copy y nguyên từ API_GUIDELINES.md §2.1:

HttpRequestConfig<TData, TParams>
ApiSuccessResponse<T>
ApiPaginatedResponse<T> (điều chỉnh meta cho phù hợp backend Quizzy)
HttpError class
[NEW] 
axios.config.ts
Copy từ API_GUIDELINES.md §2.2, điều chỉnh:

import.meta.env.VITE_API_URL → process.env.NEXT_PUBLIC_API_URL
Interceptors: request (camelCase→snake_case), response (snake_case→camelCase)
Token refresh tự động khi 401 + ACCESS_TOKEN_EXPIRED
withCredentials hoặc Bearer token tùy câu trả lời Open Question #2
[NEW] 
httpClient.api.ts
Copy từ API_GUIDELINES.md §2.3:

httpClient.get<T>() — cleanParams + return res.data.data
httpClient.post<T, D>()
httpClient.postRaw<T, D>() — bypass interceptor
httpClient.put<T, D>()
httpClient.delete<T>()
3. API Services — Mỗi entity 1 folder
[NEW] 
auth/auth.api.ts
Theo pattern §3.1 của API_GUIDELINES.md:

Interface ApiUser (raw từ BE)
Interface LoginRequest, RegisterRequest
Mapper mapApiUser(raw) → User
Functions:
login(data: LoginRequest) → POST /v1/auth/login
register(data: RegisterRequest) → POST /v1/auth/register
getMe() → GET /v1/auth/me
[NEW] 
deck/deck.api.ts
Interface ApiDeck (raw từ BE)
Interfaces: CreateDeckRequest, UpdateDeckRequest, DeckSearchParams
Mapper mapApiDeck(raw) → Deck
Functions:
createDeck(data) → POST /v1/decks
searchDecks(params) → GET /v1/decks
getDeckById(id) → GET /v1/decks/:id
getDeckCards(deckId, params) → GET /v1/decks/:deckId/cards
updateDeck(id, data) → PATCH /v1/decks/:id
[NEW] 
card/card.api.ts
Interface ApiCard (raw từ BE)
Interfaces: CreateCardRequest, CreateBulkCardsRequest, UpdateCardRequest
Mapper mapApiCard(raw) → Card
Functions:
getAllCards() → GET /v1/cards
getCardById(id) → GET /v1/cards/:id
getCardsByDeck(deckId) → GET /v1/cards/deck/:deckId
createCard(data) → POST /v1/cards
createBulkCards(data) → POST /v1/cards/bulk
updateCard(id, data) → PATCH /v1/cards/:id
deleteCard(id) → DELETE /v1/cards/:id
4. Config Updates
[MODIFY] 
tsconfig.json
Thêm path alias:

json

"@/api/*": ["./src/api/*"]
5. Migrate Consumers (5 files)
File	Hiện tại	Sau migrate
AuthPage.tsx
import { authAPI } from '@/services/api'	import * as authApi from '@/api/auth/auth.api'
flashcards/page.tsx
import { cardsAPI } from '@/services/api'	import * as cardApi from '@/api/card/card.api'
my-library/page.tsx
import { decksAPI } from '@/services/api'	import * as deckApi from '@/api/deck/deck.api'
SettingsPanel.tsx
import { decksAPI } from '@/services/api'	import * as deckApi from '@/api/deck/deck.api'
CreateDeckModal.tsx
import { decksAPI } from '@/services/api'	import * as deckApi from '@/api/deck/deck.api'
6. Cleanup
[DELETE] 
src/services/api.ts
File monolith cũ — không còn cần thiết.

[DELETE] src/services/api/ folder
Gồm client.ts, endpoints.ts, index.ts — thay thế bởi src/api/.

[MODIFY] 
src/services/index.ts
Xóa export * from "./api" (không còn export API từ services nữa).

Verification Plan
Automated Tests
bash

npx tsc --noEmit          # TypeScript compile check
npm run build             # Next.js production build
Manual Verification
Kiểm tra trang /login — login/register hoạt động
Kiểm tra trang /my-library — load danh sách decks
Kiểm tra trang /flashcards — tạo card mới