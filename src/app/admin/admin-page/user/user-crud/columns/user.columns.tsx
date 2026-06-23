import { Eye } from "lucide-react";
import type { AdminUser } from "@/services/api";
import type { CrudColumn } from "../../../crud/components";
import { readUserStatus } from "../user-form.config";

type UserColumnContext = {
  onOpenUser: (user: AdminUser) => void;
};

export const userTableColumns: CrudColumn<AdminUser, UserColumnContext>[] = [
  {
    header: "Name",
    key: "name",
    render: (user) => <span className="truncate font-extrabold">{user.name}</span>,
  },
  {
    header: "Email",
    key: "email",
    render: (user) => (
      <span className="truncate text-[#5f5e5e]">{user.email}</span>
    ),
  },
  {
    header: "Role",
    key: "role",
    render: (user) => <RoleBadge role={user.role} />,
  },
  {
    header: "Status",
    key: "status",
    render: (user) => <StatusBadge status={readUserStatus(user)} />,
  },
  {
    header: "Detail",
    key: "detail",
    render: (user, { onOpenUser }) => (
      <button
        className="inline-flex h-9 w-fit items-center gap-2 rounded-full bg-[#e6deff] px-3 text-xs font-extrabold text-[#311485] transition hover:bg-[#d8ccff] disabled:opacity-50"
        disabled={!user.id && !user._id}
        onClick={() => onOpenUser(user)}
        type="button"
      >
        <Eye aria-hidden="true" className="h-3.5 w-3.5" />
        View
      </button>
    ),
  },
];

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="w-fit rounded-full bg-[#e6deff] px-3 py-1 text-xs font-extrabold capitalize text-[#311485]">
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isSuspended = status === "suspended";
  const isDeleted = status === "deleted";

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold capitalize ${
        isDeleted
          ? "bg-[#eeeeee] text-[#5f5e5e]"
          : isSuspended
            ? "bg-[#fff0f0] text-[#a33a3a]"
            : "bg-[#d7f2e3] text-[#276345]"
      }`}
    >
      {status}
    </span>
  );
}
