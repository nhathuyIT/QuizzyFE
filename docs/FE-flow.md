Tạo deck -> vào deck detail -> tạo card trong deck đó -> bỏ trang All Cards -> vào My Decks để quản lý deck -> trong My Decks có tab Starred Decks
Nhưng nên nói rõ với FE: Starred Decks là những deck user hiện tại đã đánh dấu sao, không phải deck của tất cả mọi người.
Gửi FE có thể viết như này:
Auth Flow
Register/Login
Lưu accessToken
Các API cần login thì gửi Authorization: Bearer <token>
Sau login có thể gọi GET /v1/auth/me để lấy thông tin user hiện tại
Home / Explore Deck Flow
User vào trang khám phá deck
FE gọi GET /v1/decks
Có thể search bằng keyword
User chưa login vẫn xem được deck public/link
User đã login thì mỗi deck trả thêm trạng thái star của chính user đó
Click deck thì vào deck detail
My Decks Flow
User login
Vào trang My Decks
FE gọi GET /v1/decks/my
Chỉ hiển thị deck do user hiện tại tạo
Có thể search/filter trong danh sách deck của mình
Click deck thì vào deck detail
Trong deck detail mới hiển thị danh sách card của deck đó
Starred Decks Flow
User login
Trong My Decks có tab/menu Starred
FE gọi GET /v1/decks/starred
Chỉ hiển thị deck mà user hiện tại đã star
Deck starred có thể là deck của mình hoặc deck public/link của người khác
Không hiển thị deck mà người khác star nếu user hiện tại chưa star
Create Deck + Create Card Flow
User login
Vào My Decks
Bấm Create Deck
FE gọi POST /v1/decks
Sau khi tạo deck xong, điều hướng vào deck detail
Trong deck detail bấm Add Card
FE gọi POST /v1/cards
Nếu tạo nhiều card một lần thì gọi POST /v1/cards/bulk
Sau khi tạo card xong, reload danh sách card của deck
Deck Detail Flow
FE gọi GET /v1/decks/:id
Hiển thị thông tin deck
FE gọi GET /v1/decks/:deckId/cards để lấy card trong deck
Nếu user là chủ deck thì cho phép thêm/sửa nội dung deck/card
Nếu không phải chủ deck thì chỉ xem/study/star nếu deck accessible
Star / Unstar Flow
User login
Ở card deck item hoặc deck detail có nút star
Nếu chưa star, gọi PUT /v1/decks/:id/star
Nếu đã star, gọi DELETE /v1/decks/:id/star
Sau khi gọi xong, cập nhật UI star = true/false
Star chỉ áp dụng cho user hiện tại
Search Deck Flow
FE gọi GET /v1/decks?keyword=...
Search này là search deck chung, không phải search card
Nếu cần search trong My Decks thì gọi GET /v1/decks/my?keyword=...
Nếu cần search trong Starred Decks thì gọi GET /v1/decks/starred?keyword=...
Study Flow
User login
Vào deck detail
Bấm Study
FE gọi POST /v1/study/sessions
FE gọi GET /v1/study/sessions/:sessionId/items
User review từng card
Mỗi lần review gọi POST /v1/study/reviews
Kết thúc học gọi PATCH /v1/study/sessions/:sessionId/finish
Progress / Due Cards Flow
User login
Vào deck detail hoặc study dashboard
FE gọi GET /v1/card-progress/decks/:deckId/summary
Nếu cần lấy card tới hạn ôn tập thì gọi GET /v1/card-progress/decks/:deckId/due
Sau khi user review card, progress được cập nhật qua study/review hoặc PUT /v1/card-progress
Nói ngắn cho FE: không cần trang All Cards riêng. Card nên luôn nằm trong context của một deck: My Decks -> Deck Detail -> Cards.

Có. Hiện tại backend trong src/modules/study đã support 4 mode:
flashcard | learn | test | match
FE có thể tạo study session bằng:
POST /v1/study/sessions
với mode là một trong 4 giá trị trên.
Cách BE xử lý hiện tại:
flashcard: trả item dạng flashcard, có front, back, hint, explanation, imageUrl. Khi review cần gửi rating: again | hard | good | easy.
learn: trả item dạng viết câu trả lời, dùng các card due nếu có, nếu chưa có due thì lấy toàn bộ card trong deck. Khi review cần gửi userAnswer.
test: trả item dạng mix written và multiple_choice. Khi review cần gửi userAnswer.
match: trả danh sách tile front/back đã shuffle để FE ghép cặp. Backend hiện vẫn review bằng userAnswer so với card.back.
Flow cho FE:
User chọn mode: Flashcards, Learn, Test, hoặc Match
FE gọi POST /v1/study/sessions
Sau khi có sessionId, FE gọi GET /v1/study/sessions/:sessionId/items
FE render UI theo type item backend trả về
Khi user trả lời/review, FE gọi POST /v1/study/reviews
Khi kết thúc, FE gọi PATCH /v1/study/sessions/:sessionId/finish
Lưu ý nhỏ: có folder src/modules/study-session cũng có code tương tự, nhưng AppModule đang import StudyModule, nên FE nên dùng route chính là:
