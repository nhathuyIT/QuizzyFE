# Admin Dashboard Template

File này hướng dẫn cách làm các màn dashboard trong admin. Dashboard khác CRUD: dashboard chủ yếu hiển thị số liệu, chart, trạng thái hệ thống, không tập trung vào create/update/delete.

## 1. Khi nào dùng dashboard template?

Dùng cho các trang như:

- Dashboard summary.
- Activity analytics.
- Study monitoring.
- Audit overview.
- Deck/content statistics.

Nếu màn hình có table CRUD, form, popup detail, delete, suspend, restore thì đọc `docs/admin-crud-template.md`.

## 2. Folder dashboard hiện tại

```txt
src/app/admin/admin-page/dashboard/
  components/
    ActivityPanel.tsx
    MonitoringPanel.tsx
    SummaryPanel.tsx
    PanelState.tsx
    formatters.ts
```

Ý nghĩa:

- `SummaryPanel.tsx`: gọi API dashboard summary và hiển thị tổng quan.
- `ActivityPanel.tsx`: gọi API activity analytics và hiển thị line chart.
- `MonitoringPanel.tsx`: gom summary và activity vào cùng khu dashboard.
- `PanelState.tsx`: component dùng chung cho loading, error, empty.
- `formatters.ts`: format số, phần trăm, thời gian, label.

## 3. Cách thêm dashboard section mới

1. Tạo file panel mới trong `dashboard/components`.
2. Gọi API trong panel đó.
3. Chỉ gọi API khi panel đang được mở.
4. Dùng `PanelState` cho loading/error/empty.
5. Import panel vào `MonitoringPanel.tsx` hoặc `AdminPageContent.tsx`.
6. Nếu cần menu riêng thì thêm key mới trong `AdminPageContent.tsx`.

Ví dụ:

```tsx
export function StudyMonitoringPanel({ active }: { active: boolean }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!active) return;

    void loadStudyMonitoring();
  }, [active]);

  return <section>{/* chart or stats */}</section>;
}
```

## 4. Rule gọi API

- Đang ở `dashboard` thì gọi summary/activity.
- Đang ở `users` thì gọi user API.
- Đang ở `deck` thì gọi deck API.
- Không gọi hết tất cả API admin cùng lúc khi vừa vào trang.

Rule này giúp refresh trang không bị gọi dư API và UI không bị nhảy lung tung.

## 5. Chart rule

- Summary nên dùng card số liệu ngắn gọn.
- Activity nên dùng line chart nếu dữ liệu theo ngày/tháng.
- Chỉ hiện chart detail sau khi user chọn ngày/khoảng thời gian nếu dữ liệu nhiều.
- Không dùng nhiều chart cùng loại cho cùng một dữ liệu.
- Label phải rõ: users, sessions, reviews, accuracy.

## 6. Checklist

- API chỉ gọi khi panel active chưa?
- Loading/error/empty có rõ chưa?
- Chart có label dễ hiểu chưa?
- Refresh vẫn ở đúng trang hiện tại chưa?
- Không trộn CRUD logic vào dashboard panel chưa?
