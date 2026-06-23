import type { AdminUser } from "@/services/api";
import { CrudTable } from "../../../crud/components";
import { userTableColumns } from "../columns/user.columns";
import { getAdminUserId } from "../user-form.config";

export function UserTable({
  error,
  isError,
  isLoading,
  onOpenUser,
  selectedUserId,
  users,
}: {
  error: unknown;
  isError: boolean;
  isLoading: boolean;
  onOpenUser: (user: AdminUser) => void;
  selectedUserId: string | null;
  users: AdminUser[];
}) {
  return (
    <CrudTable
      columns={userTableColumns}
      context={{ onOpenUser }}
      emptyMessage="No users found."
      error={error}
      errorMessage="Unable to load users."
      getRowId={(user) => getAdminUserId(user) || user.email}
      isError={isError}
      isLoading={isLoading}
      loadingMessage="Loading users"
      rows={users}
      selectedRowId={selectedUserId}
    />
  );
}
