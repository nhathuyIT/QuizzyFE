# Admin CRUD Template

File này dùng để hướng dẫn cả team tạo CRUD admin theo cùng một kiểu. Khi làm module mới như `deck`, `card`, `audit-log`, `study-monitoring`, hãy đọc file này trước.

## 1. Có 2 phần cần nhớ

### Phần dùng chung

Không copy phần này cho từng module. Đây là bộ component CRUD xài chung:

```txt
src/app/admin/admin-page/crud/components/
  CrudPanel.tsx
  CrudTable.tsx
  CrudModal.tsx
  CrudFormModal.tsx
  CrudConfirmBox.tsx
  CrudStates.tsx
  crud.types.ts
  index.ts
```

Dùng để dựng layout, table, modal, form modal, confirm box, loading/error/empty state.

Import ví dụ:

```tsx
import {
  CrudConfirmBox,
  CrudFormModal,
  CrudInlineMessage,
  CrudModal,
  CrudPanel,
  CrudTable,
  type CrudColumn,
} from "../../crud/components";
```

Nếu file nằm sâu hơn thì đổi lại relative path cho đúng, ví dụ `../../../crud/components`.

### Phần template để copy

Đây là starter CRUD để copy khi làm module mới:

```txt
src/app/admin/admin-page/crud/template/
  columns/template.columns.tsx
  components/TemplateTable.tsx
  index.tsx
  template-form.config.ts
```

Copy folder này rồi đổi tên theo module thật.

Ví dụ tạo CRUD cho `deck`:

```txt
src/app/admin/admin-page/deck/deck-crud/
  columns/deck.columns.tsx
  components/DeckTable.tsx
  index.tsx
  deck-form.config.ts
```

## 2. Cách tạo CRUD mới

1. Copy folder `crud/template`.
2. Đặt folder mới vào đúng khu vực module, ví dụ `deck/deck-crud`.
3. Đổi tên file:
   - `template.columns.tsx` thành `deck.columns.tsx`
   - `TemplateTable.tsx` thành `DeckTable.tsx`
   - `template-form.config.ts` thành `deck-form.config.ts`
4. Trong `index.tsx`, đổi tên component chính, type dữ liệu, state, API.
5. Trong `deck-form.config.ts`, khai báo form fields, giá trị mặc định, validate, payload gửi API.
6. Trong `deck.columns.tsx`, khai báo các cột table và nút action.
7. Import component CRUD mới vào `AdminPageContent.tsx` và gắn vào menu admin.

## 3. Mỗi file làm gì?

### `index.tsx`

Đây là file điều phối chính của một CRUD module.

Nó thường xử lý:

- Gọi API list/detail/create/update/delete.
- Giữ state search, loading, error, selected item.
- Mở modal view/create/edit/delete/suspend/restore.
- Truyền data xuống table.
- Truyền form config xuống modal.

Rule: API của trang nào thì chỉ gọi khi đang ở trang đó.

### `module-form.config.ts`

File này để gom logic form, không để rải trong component.

Nó thường chứa:

- Type form value.
- Initial form value.
- Danh sách field.
- Hàm map item sang form.
- Hàm map form sang payload API.
- Text confirm nếu có action nguy hiểm.

Ví dụ action cần nhập lý do:

```tsx
<CrudConfirmBox
  title="Suspend user"
  description="User will not be able to access the system."
  confirmLabel="Suspend"
  reasonLabel="Reason"
  reasonPlaceholder="Enter suspend reason"
  requireReason
  onConfirm={(reason) => handleSuspendUser(user.id, reason)}
/>
```

### `columns/module.columns.tsx`

File này khai báo cột cho table.

Nó thường chứa:

- Header của từng cột.
- Cách render dữ liệu.
- Cột action như View, Edit, Delete, Suspend, Restore.

Ví dụ:

```tsx
export const deckColumns = ({ onView, onEdit }: DeckColumnActions): CrudColumn<Deck>[] => [
  {
    key: "name",
    header: "Deck",
    render: (deck) => deck.name,
  },
  {
    key: "actions",
    header: "",
    render: (deck) => (
      <div>
        <button onClick={() => onView(deck)}>View</button>
        <button onClick={() => onEdit(deck)}>Edit</button>
      </div>
    ),
  },
];
```

### `components/ModuleTable.tsx`

File này là lớp bọc riêng cho table của module.

Nó thường xử lý:

- Search input.
- Empty text riêng của module.
- Truyền columns vào `CrudTable`.

## 4. Component dùng chung nên dùng khi nào?

### `CrudPanel`

Dùng làm khung chính cho từng màn CRUD.

Ví dụ:

```tsx
<CrudPanel
  title="Users"
  description="Manage user accounts and status."
  actions={<button>Create user</button>}
>
  <UserTable users={users} />
</CrudPanel>
```

### `CrudTable`

Dùng để render table chung.

```tsx
<CrudTable
  columns={columns}
  data={users}
  getRowKey={(user) => user.id}
  emptyText="No users found."
/>
```

### `CrudModal`

Dùng cho detail popup hoặc modal custom.

```tsx
<CrudModal open={open} title="User detail" onClose={onClose}>
  <UserDetail user={user} />
</CrudModal>
```

### `CrudFormModal`

Dùng cho create/edit form.

```tsx
<CrudFormModal
  open={open}
  title="Edit deck"
  fields={deckFields}
  values={formValues}
  onChange={setFormValues}
  onSubmit={handleSubmit}
  onClose={onClose}
/>
```

### `CrudConfirmBox`

Dùng cho action cần xác nhận như delete, suspend, restore, revoke session.

```tsx
<CrudConfirmBox
  title="Delete deck"
  description="This action cannot be undone."
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

## 5. Ví dụ thật đang có

User CRUD hiện đang là ví dụ để mọi người nhìn theo:

```txt
src/app/admin/admin-page/user/user-crud/
  columns/user.columns.tsx
  components/UserDetailModal.tsx
  components/UserTable.tsx
  index.tsx
  user-form.config.ts
```

User CRUD đang dùng shared template cho:

- Table layout.
- Columns config.
- Detail popup.
- Confirm action.
- Suspend reason.
- Form config.
- State loading/error/empty.

## 6. Quy ước khi làm module mới

- Không viết table riêng từ đầu nếu `CrudTable` dùng được.
- Không viết modal riêng từ đầu nếu `CrudModal` hoặc `CrudFormModal` dùng được.
- Không hard-code form logic trong `index.tsx`; đưa vào `module-form.config.ts`.
- Không gọi API của tab khác khi user chưa mở tab đó.
- Action nguy hiểm phải có confirm box.
- Action cần lý do thì dùng `requireReason`.
- Tên file nên theo module, ví dụ `deck.columns.tsx`, `DeckTable.tsx`.

## 7. Checklist trước khi gửi code

- Module có đúng cấu trúc folder chưa?
- Có dùng `crud/components` thay vì copy component chung chưa?
- API chỉ gọi khi mở đúng trang chưa?
- Loading, error, empty state có đủ chưa?
- Detail có mở bằng popup chưa?
- Delete/suspend/restore có confirm chưa?
- Form config đã tách khỏi UI chưa?
- Chạy `npx tsc --noEmit` không lỗi chưa?
