# Admin Auth Notes

## Correct Business Flow

- `/admin` is the admin authentication entry point.
- Visiting `/admin` should show the admin login screen directly.
- Do not use `/admin/login` as the main admin auth route unless explicitly requested later.
- After a successful admin login, keep the user on `/admin` and render the admin page content in the same route.
- `/admin` now behaves as an auth gate:
  - No token or invalid admin session: show admin login.
  - Valid admin session: show admin page content.

## UI Direction

- The admin auth screen must feel like an admin console.
- Do not design it like the learner-facing login, learning page, landing page, or marketing page.
- Avoid learner-focused copy such as study decks, learning goals, quizzes, practice, or student motivation.
- Use restrained admin language such as:
  - `Admin Portal`
  - `Secure access`
  - `Operator sign in`
  - `Admin access required`

## Implemented Route

- The admin auth UI now belongs at `src/app/admin/page.tsx`.
- `/admin` is the route that renders the admin login screen.
- The admin login gate is implemented in `src/app/admin/login/AdminAuthPage.tsx`.
- The logged-in admin page content is rendered by `src/app/admin/admin-page/AdminPageContent.tsx`.
- Admin page UI shell lives in `src/app/admin/admin-page/AdminPageContent.tsx`.
  - `AdminSidebar` is kept inside `AdminPageContent.tsx`.
  - `AdminPageHeader` is kept inside `AdminPageContent.tsx`.
- Sidebar `Users` switches to `src/app/admin/admin-page/user/user-crud/index.tsx`.
- Users module follows the CRUD template shape inside `src/app/admin/admin-page/user/user-crud`:
  - `index.tsx` owns queries, mutations, and selected-user state.
  - `columns/user.columns.tsx` defines table columns and row cell renderers.
  - `components/UserTable.tsx` renders the users table from the column config.
  - `components/UserDetailModal.tsx` renders the detail popup and action controls.
  - `user-form.config.ts` holds role options, confirm action config, and local user helpers.
- Suspend user action requires an admin-entered reason in the confirmation box before calling `adminAPI.suspendUser(userId, reason)`.
- Dashboard monitoring components live under `src/app/admin/admin-page/dashboard/components`.
  - `MonitoringPanel.tsx` handles the Summary/Activity toggle and API queries.
  - `SummaryPanel.tsx` renders `adminAPI.getDashboardSummary()` data with total bars and progress rings.
  - `ActivityPanel.tsx` renders `adminAPI.getActivityAnalytics("day")` data with readable daily cards, a selected-day line chart that appears only after choosing a period, and a detail table. Do not add bar charts in Activity cards while the selected-day line chart is present.
  - `PanelState.tsx` contains loading/error/empty states.
  - `formatters.ts` contains local display formatters.
- `src/app/admin/page.tsx` imports the login gate, so `/admin` controls whether to show login or admin page content.
- `/admin/login` is only a compatibility redirect back to `/admin`; it is not the main admin auth route.
- Keep user auth routes such as `/login` unchanged.

## Auth Behavior

- Use the existing `authAPI.login` from `@/services/api` for now.
- Validate that `response.data.accessToken` exists.
- Validate that `response.data.user.role === "admin"`.
- If the user is not an admin, do not save the token.
- If the user is an admin, save `accessToken`, dispatch `quizzy:auth-changed`, and render `AdminPageContent`.
- On page reload, if an `accessToken` exists, call `authAPI.getMe()` and validate `user.role === "admin"` before showing admin page content.
- If stored session validation fails or the stored user is not admin, remove `accessToken`, dispatch `quizzy:auth-changed`, and return to the login screen.
- The auth gate keeps a loading screen visible until the first localStorage token check finishes. This prevents `/admin` from briefly flashing the login form on refresh before redirecting back into the admin page.

## Admin Page Behavior

- Admin page content is the first post-login screen for admins.
- It is intentionally lightweight until backend admin modules are defined.
- Current admin page shows:
  - Left sidebar navigation.
  - Admin Portal brand area.
  - Signed-in admin email and sign out action at the bottom of the sidebar.
  - Greeting content in the main panel.
  - A monitoring panel with two toggle buttons: `Summary` and `Activity`.
- Admin sidebar state is stored in the URL query:
  - `/admin` opens the dashboard/home section.
  - `/admin?section=users` opens the users section.
  - Refreshing a section must keep that section active instead of returning to the dashboard.
- Only the active admin section should mount and call its APIs. For example, refreshing `/admin?section=users` must call user APIs only, not dashboard summary/activity APIs.
- The admin page currently connects these two admin monitoring APIs from `@/services/api`:
  - `adminAPI.getDashboardSummary()` -> `GET /v1/admin/dashboard/summary`.
  - `adminAPI.getActivityAnalytics("day")` -> `GET /v1/admin/analytics/activity?interval=day`.
- The admin page also connects admin user APIs:
  - `adminAPI.getUsers({ page: 1, take: 20 })` -> `GET /v1/admin/users?page=1&take=20`.
  - `adminAPI.getUser(userId)` -> `GET /v1/admin/users/:userId`.
  - `adminAPI.updateUserRole(userId, { role })` -> `PATCH /v1/admin/users/:userId/role`.
  - `adminAPI.suspendUser(userId, reason)` -> `PATCH /v1/admin/users/:userId/status` with `status: "suspended"`.
  - `adminAPI.activateUser(userId)` -> `PATCH /v1/admin/users/:userId/status` with `status: "active"`.
  - `adminAPI.revokeUserSessions(userId)` -> `POST /v1/admin/users/:userId/revoke-sessions`.
  - `adminAPI.deleteUser(userId)` -> `DELETE /v1/admin/users/:userId`.
  - `adminAPI.restoreUser(userId)` -> `POST /v1/admin/users/:userId/restore`.
- User detail now opens in a popup modal from the Users table.
- Destructive user actions must stay behind an in-modal confirmation step.
- Only one monitoring view is shown at a time. The two buttons switch the visible panel on the same `/admin` page.
- Placeholder module navigation must not pretend to perform real actions until their APIs/routes are implemented.
- Keep the admin page in the same user-theme color system:
  - `#fbf9f4` page background.
  - White cards.
  - Purple accents such as `#614db7`, `#9b87f5`, and `#e6deff`.
- The admin page layout follows the referenced sidebar-style page mockup while keeping Quizzy/admin wording.
- Do not use the green mockup palette for Quizzy admin; keep active states and primary actions in the existing user theme purple palette.
- Keep the admin page content wider than the mockup draft:
  - Sidebar around `248px` on desktop.
  - Main content max width around `1180px`.
  - Center action card around `640px`.
