# Admin Login / Logout Template

File này ghi lại cách làm login/logout cho admin để các module sau không làm lệch flow.

## 1. Route admin

Admin hiện dùng các route chính:

```txt
src/app/admin/page.tsx
src/app/admin/login/page.tsx
src/app/admin/login/AdminLoginContent.tsx
src/app/admin/login/AdminLoginForm.tsx
src/app/admin/admin-page/AdminPageContent.tsx
```

Ý nghĩa:

- `/admin`: trang admin chính. Nếu chưa login thì hiện login hoặc redirect theo logic hiện tại.
- `/admin/login`: trang login admin.
- `AdminLoginContent.tsx`: layout/màn login.
- `AdminLoginForm.tsx`: form login, validate, gọi API.
- `AdminPageContent.tsx`: layout admin sau khi login.

## 2. Login flow

Flow login admin:

1. User nhập email/password.
2. Validate không được trống.
3. Gọi API login admin.
4. Nếu login fail thì hiện error.
5. Nếu login success thì lưu token.
6. Dispatch event `quizzy:auth-changed`.
7. Chuyển sang `/admin`.

Trong quá trình debug có thể dùng console log để biết API login admin thành công chưa.

## 3. Logout flow

Flow logout admin:

1. User bấm logout.
2. Xóa token/local auth data.
3. Dispatch event `quizzy:auth-changed`.
4. Chuyển về trang login admin.

Logout nên nằm trong admin layout/sidebar để trang nào cũng dùng chung được.

## 4. Rule quan trọng

- Admin login không dùng register.
- Admin login không dùng social login.
- Admin page không dùng chung UI marketing với learning page.
- Login user và login admin tách biệt.
- Không sửa user auth flow nếu chỉ đang làm admin auth.
- Sau refresh, nếu token còn hợp lệ thì không được nhảy về home sai trang.

## 5. Khi làm thêm admin page mới

Nếu thêm page như `users`, `deck`, `study-monitoring`, `audit-log`:

1. Thêm menu item trong `AdminPageContent.tsx`.
2. Dùng state hoặc query để nhớ tab hiện tại.
3. Chỉ gọi API của tab đang mở.
4. Không gọi API login lại khi chỉ chuyển tab.
5. Logout vẫn dùng flow chung ở trên.

## 6. Checklist

- Login admin gọi đúng API chưa?
- Login fail có hiện error chưa?
- Login success có lưu token chưa?
- Refresh còn ở đúng admin tab chưa?
- Logout có xóa token chưa?
- User login cũ có bị ảnh hưởng không?
