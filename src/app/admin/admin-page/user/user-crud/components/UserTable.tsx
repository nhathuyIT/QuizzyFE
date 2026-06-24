import { Loader2 } from "lucide-react";
import type { AdminUser } from "@/services/api";
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
    <div className="overflow-hidden rounded-[26px] border border-black/5">
      <div className="grid min-w-[780px] grid-cols-[1.2fr_1.5fr_110px_120px_110px] bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]">
        {userTableColumns.map((column) => (
          <span key={column.key}>{column.header}</span>
        ))}
      </div>

      <div className="overflow-x-auto">
        {isLoading ? <UsersLoading /> : null}
        {isError ? <UsersError error={error} /> : null}
        {!isLoading && !isError && !users.length ? <UsersEmpty /> : null}

        {users.map((user) => {
          const userId = getAdminUserId(user);
          const active = selectedUserId === userId;

          return (
            <div
              className={`grid min-w-[780px] grid-cols-[1.2fr_1.5fr_110px_120px_110px] items-center border-t border-black/5 px-4 py-4 text-sm font-semibold text-[#1b1c19] ${
                active ? "bg-[#fbf9f4]" : "bg-white"
              }`}
              key={userId || user.email}
            >
              {userTableColumns.map((column) => (
                <div key={column.key}>
                  {column.render(user, { onOpenUser, selectedUserId })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersLoading() {
  return (
    <div className="flex min-h-[220px] min-w-[780px] items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading users
    </div>
  );
}

function UsersError({ error }: { error: unknown }) {
  return (
    <div className="min-w-[780px] bg-[#fff0f0] p-5 text-sm font-bold text-[#a33a3a]">
      {error instanceof Error ? error.message : "Unable to load users."}
    </div>
  );
}

function UsersEmpty() {
  return (
    <div className="min-w-[780px] p-8 text-center text-sm font-bold text-[#614db7]">
      No users found.
    </div>
  );
}
