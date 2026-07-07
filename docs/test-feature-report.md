# QA Business & Feature Test Report - Quizzy FE

Ngay test: 07/07/2026  
Moi truong: `http://localhost:3000`  
Backend dang cau hinh: `https://quizzybe-production.up.railway.app/`  
Tai khoan test: `student@gizmo.local`  
Trang/feature da test: Sidebar features, auth flow, deck flow, study flow, AI Tutor, Study Groups

## 1. Scope

Bao cao nay tong hop ket qua test cac tinh nang chinh tren giao dien Quizzy FE, dac biet cac muc trong sidebar:

- Home
- My decks
- Create cards
- Study history
- AI Tutor
- Study groups

Dong thoi doi chieu voi luong nghiep vu trong `docs/FE-flow.md`, `docs/postman-api-test-flow.md`, `docs/study-api-test-flow.md`, va `docs/chatbot-fe-integration.md`.

## 2. Executive Summary

He thong da co nhieu flow chinh hoat dong o muc co ban: login, home dashboard, study history, create card form, tracked study session API wiring, va AI Tutor UI. Tuy nhien co mot so loi nghiem trong anh huong den nghiep vu:

1. Public deck bi bat login, trai voi yeu cau user chua login van xem duoc deck public/link.
2. My decks UI hien `0 matching decks` trong khi API `/decks/my` tra ve 2 deck.
3. Learn/Test study UI co nguy co hien feedback dung/sai sai khi backend item khong tra `correctAnswer`.
4. AI Tutor chua duoc xac nhan full end-to-end vi viec gui message/generate deck se tao data/call AI.
5. Study groups hien chi la placeholder, khong phai tinh nang that.

## 3. Summary Table

| ID | Feature / Requirement | Expected Result | Actual Result | Status | Severity |
|---|---|---|---|---|---|
| AUTH-01 | Login | User login thanh cong va vao workspace | Login thanh cong, redirect `/home` | Pass | Low |
| AUTH-02 | Login validation | Form rong/invalid phai co validation | Form rong co error; invalid email dung native browser validation | Pass | Low |
| DECK-01 | Public deck access | User chua login xem duoc public/link deck | Public deck redirect `/login` | Fail | High |
| DECK-02 | Deck detail data | Hien title, card list, progress, due cards | API OK; UI bi chan voi guest | Partial | High |
| HOME-01 | Home dashboard | Hien user, continue studying, recent decks, goal | Hien dung du lieu co ban | Pass | Low |
| LIB-01 | My decks | Chi hien deck cua current user | UI hien `0 matching decks`, API co 2 deck | Fail | High |
| LIB-02 | Starred decks | Hien deck current user da star | API tra empty list dung voi user test | Pass | Low |
| LIB-03 | Search/filter decks | Search/filter trong My Decks | Source co search/filter; UI My decks dang loi data | Partial | Medium |
| CARD-01 | Create card manual | Tao card trong context deck | Form co, dropdown deck load duoc | Partial | Medium |
| CARD-02 | Bulk create cards | Tao nhieu card bang bulk endpoint | UI co bulk paste va validation source | Partial | Medium |
| CARD-03 | Upload cards | Upload source/file | UI bao API upload chua exposed | Partial | Low |
| STUDY-01 | Study history | Hien backend study sessions | Hien danh sach Continue/Completed dung API | Pass | Low |
| STUDY-02 | Study modes | Support flashcard/learn/test/match | Tracked session co 4 mode | Pass | Low |
| STUDY-03 | Learn/Test feedback | Feedback dung/sai phai theo backend/correct answer | FE co the tu cham sai neu thieu `correctAnswer` | Fail | High |
| STUDY-04 | Flashcard rating | Support rating `again/hard/good/easy` | UI chi co `again/good` | Partial | Medium |
| STUDY-05 | Progress/history sync | Review sync truoc khi finish session | Co review queue va flush truoc finish | Pass | Low |
| AI-01 | AI Tutor conversation list | Load conversations cua user | API OK, UI hien No conversations | Pass | Low |
| AI-02 | AI Tutor send message | Gui message va hien response AI | Chua test de tranh tao data/call AI | Not Tested | Medium |
| AI-03 | Generate deck from text/PDF | Tao job generate flashcards | UI co form va validation source; chua submit that | Partial | Medium |
| GROUP-01 | Study groups | Neu la feature that thi can group APIs | Hien placeholder, button disabled, co copy backend chua support | Pass as placeholder | Low |
| NAV-01 | Sidebar navigation | Cac link sidebar vao dung route | Tat ca route sidebar mo duoc | Pass | Low |
| RESPONSIVE-01 | Mobile login | Khong horizontal overflow | 375px khong bi ngang, nhung form nam duoi hero | Pass | Low |

## 4. Detailed Findings

### BUG-01: Public deck bi bat login

**Requirement:** User chua login van xem duoc deck public/link.  
**Expected Result:** Mo URL deck public thi hien deck detail.  
**Actual Result:** Mo `http://localhost:3000/decks/6a366a03bacc6f54d7a6f407` khi chua login bi redirect sang `/login`.  
**Status:** Fail  
**Severity:** High

**Evidence:**

- API `GET /v1/decks/6a366a03bacc6f54d7a6f407` tra ve deck `visibility: "public"`.
- FE route nam trong dashboard shell co `AuthGuard`, nen guest bi chan truoc khi xem deck.

**Steps to reproduce:**

1. Clear `accessToken` trong browser.
2. Mo `http://localhost:3000/decks/6a366a03bacc6f54d7a6f407`.
3. Observe: bi redirect sang `/login`.

**Suggested fix:**

- Khong boc public deck detail bang global `AuthGuard`.
- Cho phep load deck public/link khong token.
- Chi gate cac action can login: star, tracked study, progress, edit, add cards.

### BUG-02: My decks hien 0 deck trong khi API co data

**Requirement:** My Decks chi hien deck do current user tao.  
**Expected Result:** User `student@gizmo.local` thay 2 deck cua minh.  
**Actual Result:** UI `/my-library` hien `0 matching decks`.  
**Status:** Fail  
**Severity:** High

**Evidence:**

API read-only:

```http
GET /v1/decks/my?take=100
```

Tra ve 2 deck:

- `English Vocabulary - Updated`
- `Tu vung IELTS Cong Nghe Thong Tin`

Trong khi UI `/my-library` hien:

```text
Decks you created
0 matching decks
```

**Steps to reproduce:**

1. Login bang `student@gizmo.local`.
2. Vao `/my-library`.
3. Observe: UI hien 0 deck.
4. Goi API `/v1/decks/my?take=100` cung token.
5. Observe: API co 2 deck.

**Suggested fix:**

- Kiem tra React Query cache/key cua `["decks", activeTab, deckParams]`.
- Kiem tra state `visibility`, `keyword`, `page` co bi set sai khong.
- Kiem tra response mapping `decksQuery.data?.data`.
- Kiem tra co request nao bi 401/empty va overwrite cache khong.

### BUG-03: Learn/Test co the hien feedback dung/sai sai

**Requirement:** Khi user hoc mode `learn`/`test`, FE phai gui review len backend va hien ket qua dung/sai chinh xac.  
**Expected Result:** Correct answer va `isCorrect` phai dua tren backend hoac correct answer that.  
**Actual Result:** Trong `src/app/(dashboard)/study/[sessionId]/page.tsx`, neu item khong co `correctAnswer`, FE fallback:

```ts
const correctAnswer = currentItem.correctAnswer ?? submittedAnswer;
```

hoac:

```ts
const correctAnswer = item.correctAnswer ?? answer;
```

Dieu nay co the lam UI hien user tra loi dung ngay ca khi sai.  
**Status:** Fail  
**Severity:** High

**Steps to reproduce:**

1. Tao tracked session mode `learn` hoac `test`.
2. Lay item khong co `correctAnswer`.
3. Nhap/chon dap an sai.
4. Observe: UI co the build optimistic feedback la correct.

**Suggested fix:**

- Backend nen tra `correctAnswer` trong item neu FE can feedback tuc thi.
- Hoac FE khong tu cham optimistic khi thieu `correctAnswer`.
- Tot nhat: goi `POST /v1/study/reviews` ngay khi user submit va hien `isCorrect/correctAnswer` tu backend response.

### BUG-04: Flashcard tracked session chi co 2 rating

**Requirement:** Flashcard review support `again | hard | good | easy`.  
**Expected Result:** UI cho user chon 4 muc rating.  
**Actual Result:** UI chi co:

- `Don't know` -> `again`
- `Know` -> `good`

**Status:** Partial  
**Severity:** Medium

**Suggested fix:**

- Them 4 nut rating: Again, Hard, Good, Easy.
- Map dung rating backend de SRS chinh xac hon.

### BUG-05: Upload tab trong Create cards co the gay hieu nham

**Requirement:** Button/tab hien tren UI nen co chuc nang that hoac noi ro chua support.  
**Expected Result:** Neu upload chua support thi tab bi disabled hoac label ro.  
**Actual Result:** Tab `Upload` clickable, vao trong moi thay message `Upload API is not exposed`.  
**Status:** Partial  
**Severity:** Low

**Suggested fix:**

- Disable tab Upload.
- Doi label thanh `Upload (coming soon)`.
- Hoac an tab neu backend chua expose endpoint.

### BUG-06: AI Tutor chua xac nhan full end-to-end

**Requirement:** AI Tutor co the chat, tao conversation, generate flashcards tu text/PDF.  
**Expected Result:** User gui message nhan AI response; generate deck tao job va redirect deck.  
**Actual Result:** UI va API conversations load OK, nhung chua test submit message/generate de tranh tao data/call AI.  
**Status:** Partial / Not fully tested  
**Severity:** Medium

**Suggested next test:**

Dung moi truong test rieng hoac account test disposable, thuc hien:

1. Start new chat.
2. Send message ngan.
3. Verify optimistic bubble, loading, assistant response.
4. Rename conversation.
5. Archive conversation.
6. Delete conversation.
7. Generate deck from text.
8. Poll job done va verify redirect `/decks/:id`.

### NOTE-01: Study groups la placeholder

**Requirement:** Neu yeu cau la Study Groups hoan chinh thi can APIs class/group/member/invite.  
**Actual Result:** Trang hien preview only:

- `New group` disabled.
- Cards `Coming soon` disabled.
- Message: backend support not available yet.

**Status:** Pass neu chi can placeholder; Fail neu requirement yeu cau tinh nang that.

**Suggested fix neu can feature that:**

- Them API groups/classes.
- CRUD group.
- Join/leave group.
- Invite member.
- Shared decks.
- Group study session.

## 5. Feature-by-Feature Notes

### Home

**Status:** Pass

Observed:

- Hien user `Nguyen`.
- Hien continue studying.
- Hien recent decks.
- Hien daily streak, goal, XP.
- Cac link qua deck va create cards co route dung.

Risk:

- Home dung `decksAPI.getAll()` nen co the hien ca deck khong thuoc user tuy backend dang tra ca private cua user va public deck. Can xac dinh day la "Explore/Recent" hay "My recent".

### My decks

**Status:** Fail

Observed:

- UI hien 0 deck.
- API co 2 deck.

Can fix uu tien vi day la module quan ly deck chinh.

### Create cards

**Status:** Partial

Observed:

- Manual form co front/back/hint/explanation/examples.
- Bulk paste co format `front :: back`.
- Deck dropdown load duoc decks.
- Upload tab chi la placeholder.

Not executed:

- Khong bam save de tranh tao data that.

### Study history

**Status:** Pass

Observed:

- Load sessions tu backend.
- Hien completed/continue status.
- Link session dung `/study/:sessionId` hoac `/study/:sessionId/result`.

Concern:

- Co nhieu session `0/0 correct`, co the do session tao nhung chua hoc. Chap nhan duoc, nhung UX nen hien "Not started" thay vi `0/0 correct`.

### AI Tutor

**Status:** Partial

Observed:

- Conversations API tra OK.
- UI hien empty state.
- Chat input, suggestions, generate deck form co render.
- Validation source co gioi han message 2000 chars, raw text 5-50000 chars, PDF <=10MB, card count 5-30.

Not executed:

- Send message.
- Generate deck.
- Rename/archive/delete conversation.

### Study groups

**Status:** Pass as placeholder

Observed:

- Trang ghi ro backend support chua co.
- Cac action disabled.
- Khong gia lap action that.

## 6. Recommendations for Dev Team

Priority High:

1. Fix public deck guest access.
2. Fix My decks UI khong hien data.
3. Fix Learn/Test feedback logic, khong fallback correctAnswer ve user answer.

Priority Medium:

1. Them 4 rating cho flashcard tracked session.
2. Lam ro local practice vs tracked study session.
3. Them client-side owner guard cho edit deck route.
4. Test AI Tutor end-to-end tren test data rieng.

Priority Low:

1. Disable/rename Upload tab neu chua support.
2. Doi copy Study history cho session `0/0 correct`.
3. Neu Study groups chi la placeholder, giu disabled state nhu hien tai.

## 7. Final QA Conclusion

Chua nen xem ban hien tai la pass hoan toan cho nghiep vu. Cac flow co ban da co nen tang tot, nhung co 3 blocker can xu ly truoc khi demo/release:

- Public deck access bi sai nghiep vu.
- My decks khong hien deck mac du API co data.
- Learn/Test co nguy co feedback sai ket qua hoc.

Sau khi fix 3 diem tren, nen chay lai full regression cho sidebar, deck detail, create card, study session, va AI Tutor.
