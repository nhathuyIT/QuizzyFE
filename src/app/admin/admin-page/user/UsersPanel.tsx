"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Loader2,
  Power,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Trash2,
  UserCog,
  UserX,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  adminAPI,
  type AdminUser,
  type AdminUserRole,
} from "@/services/api";
import { formatDate, formatNumber } from "../dashboard/formatters";

type ConfirmAction = {
  description: string;
  label: string;
  title: string;
  tone: "default" | "danger";
  type: "activate" | "delete" | "restore" | "revoke" | "suspend";
};

const roleOptions: AdminUserRole[] = ["student", "teacher", "admin"];
const getAdminUserId = (user: AdminUser) => user.id ?? user._id ?? "";

export function UsersPanel() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<AdminUserRole>("student");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const usersQuery = useQuery({
    queryKey: ["admin", "users", { page: 1, take: 20 }],
    queryFn: () => adminAPI.getUsers({ page: 1, take: 20 }),
    retry: false,
  });
  const users = useMemo(() => usersQuery.data?.data ?? [], [usersQuery.data]);
  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return users.find((user) => getAdminUserId(user) === selectedUserId) ?? null;
  }, [selectedUserId, users]);
  const userDetailQuery = useQuery({
    queryKey: ["admin", "users", selectedUserId],
    queryFn: () => adminAPI.getUser(selectedUserId ?? ""),
    enabled: Boolean(selectedUserId),
    retry: false,
  });
  const selectedUserDetail = userDetailQuery.data?.data ?? selectedUser;

  const invalidateUserQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const updateRoleMutation = useMutation({
    mutationFn: ({ role, userId }: { role: AdminUserRole; userId: string }) =>
      adminAPI.updateUserRole(userId, { role }),
    onError: showActionError,
    onSuccess: async (response) => {
      setActionMessage("User role updated.");
      setRoleDraft(response.data.role);
      await invalidateUserQueries();
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (userId: string) =>
      adminAPI.suspendUser(userId, "Admin portal action"),
    onError: showActionError,
    onSuccess: async () => {
      setActionMessage("User suspended.");
      setConfirmAction(null);
      await invalidateUserQueries();
    },
  });

  const activateMutation = useMutation({
    mutationFn: (userId: string) => adminAPI.activateUser(userId),
    onError: showActionError,
    onSuccess: async () => {
      setActionMessage("User activated.");
      setConfirmAction(null);
      await invalidateUserQueries();
    },
  });

  const revokeSessionsMutation = useMutation({
    mutationFn: (userId: string) => adminAPI.revokeUserSessions(userId),
    onError: showActionError,
    onSuccess: async () => {
      setActionMessage("User sessions revoked.");
      setConfirmAction(null);
      await invalidateUserQueries();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminAPI.deleteUser(userId),
    onError: showActionError,
    onSuccess: async () => {
      setActionMessage("User deleted.");
      setConfirmAction(null);
      await invalidateUserQueries();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (userId: string) => adminAPI.restoreUser(userId),
    onError: showActionError,
    onSuccess: async () => {
      setActionMessage("User restored.");
      setConfirmAction(null);
      await invalidateUserQueries();
    },
  });

  const isActionPending =
    updateRoleMutation.isPending ||
    suspendMutation.isPending ||
    activateMutation.isPending ||
    revokeSessionsMutation.isPending ||
    deleteMutation.isPending ||
    restoreMutation.isPending;

  function showActionError(error: unknown) {
    setActionMessage("");
    setActionError(error instanceof Error ? error.message : "Admin action failed.");
  }

  function clearActionState() {
    setActionError("");
    setActionMessage("");
    setConfirmAction(null);
  }

  function handleOpenUser(user: AdminUser) {
    const userId = getAdminUserId(user);

    if (!userId) return;
    setSelectedUserId(userId);
    setRoleDraft(user.role);
    clearActionState();
  }

  function handleCloseUser() {
    setSelectedUserId(null);
    setRoleDraft("student");
    clearActionState();
  }

  function handleRoleUpdate() {
    if (!selectedUserId) return;
    clearActionState();
    updateRoleMutation.mutate({ role: roleDraft, userId: selectedUserId });
  }

  function handleConfirmedAction() {
    if (!selectedUserId || !confirmAction) return;
    setActionError("");
    setActionMessage("");

    if (confirmAction.type === "suspend") suspendMutation.mutate(selectedUserId);
    if (confirmAction.type === "activate") activateMutation.mutate(selectedUserId);
    if (confirmAction.type === "revoke") revokeSessionsMutation.mutate(selectedUserId);
    if (confirmAction.type === "delete") deleteMutation.mutate(selectedUserId);
    if (confirmAction.type === "restore") restoreMutation.mutate(selectedUserId);
  }

  return (
    <section className="mt-10 rounded-[32px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(49,20,133,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-black/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#1b1c19]">
            Users
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            List, inspect, and manage admin user actions.
          </p>
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f6f3ee] px-5 text-sm font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19] disabled:opacity-60"
          disabled={usersQuery.isFetching}
          onClick={() => usersQuery.refetch()}
          type="button"
        >
          {usersQuery.isFetching ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      <div className="pt-6">
        <div className="overflow-hidden rounded-[26px] border border-black/5">
          <div className="grid min-w-[780px] grid-cols-[1.2fr_1.5fr_110px_120px_110px] bg-[#f6f2ff] px-4 py-3 text-xs font-extrabold uppercase tracking-normal text-[#614db7]">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Detail</span>
          </div>

          <div className="overflow-x-auto">
            {usersQuery.isPending ? <UsersLoading /> : null}
            {usersQuery.isError ? <UsersError error={usersQuery.error} /> : null}
            {!usersQuery.isPending && !usersQuery.isError && !users.length ? (
              <UsersEmpty />
            ) : null}

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
                  <span className="truncate font-extrabold">{user.name}</span>
                  <span className="truncate text-[#5f5e5e]">{user.email}</span>
                  <RoleBadge role={user.role} />
                  <StatusBadge status={readUserStatus(user)} />
                  <button
                    className="inline-flex h-9 w-fit items-center gap-2 rounded-full bg-[#e6deff] px-3 text-xs font-extrabold text-[#311485] transition hover:bg-[#d8ccff] disabled:opacity-50"
                    disabled={!userId}
                    onClick={() => handleOpenUser(user)}
                    type="button"
                  >
                    <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedUserId ? (
        <UserDetailModal
          actionError={actionError}
          actionMessage={actionMessage}
          confirmAction={confirmAction}
          detailError={userDetailQuery.error}
          isActionPending={isActionPending}
          isLoading={userDetailQuery.isFetching}
          onActivate={() =>
            setConfirmAction({
              description: "This will allow the user to sign in again.",
              label: "Activate user",
              title: "Activate this user?",
              tone: "default",
              type: "activate",
            })
          }
          onClose={handleCloseUser}
          onConfirmAction={handleConfirmedAction}
          onDelete={() =>
            setConfirmAction({
              description: "This soft deletes the user account.",
              label: "Delete user",
              title: "Delete this user?",
              tone: "danger",
              type: "delete",
            })
          }
          onDismissConfirm={() => setConfirmAction(null)}
          onRestore={() =>
            setConfirmAction({
              description: "This restores the deleted user account.",
              label: "Restore user",
              title: "Restore this user?",
              tone: "default",
              type: "restore",
            })
          }
          onRevokeSessions={() =>
            setConfirmAction({
              description: "This signs the user out from active sessions.",
              label: "Revoke sessions",
              title: "Revoke user sessions?",
              tone: "danger",
              type: "revoke",
            })
          }
          onRoleChange={setRoleDraft}
          onSuspend={() =>
            setConfirmAction({
              description: "This blocks the user from continuing to use the app.",
              label: "Suspend user",
              title: "Suspend this user?",
              tone: "danger",
              type: "suspend",
            })
          }
          onUpdateRole={handleRoleUpdate}
          roleDraft={roleDraft}
          user={selectedUserDetail}
        />
      ) : null}
    </section>
  );
}

function UserDetailModal({
  actionError,
  actionMessage,
  confirmAction,
  detailError,
  isActionPending,
  isLoading,
  onActivate,
  onClose,
  onConfirmAction,
  onDelete,
  onDismissConfirm,
  onRestore,
  onRevokeSessions,
  onRoleChange,
  onSuspend,
  onUpdateRole,
  roleDraft,
  user,
}: {
  actionError: string;
  actionMessage: string;
  confirmAction: ConfirmAction | null;
  detailError: unknown;
  isActionPending: boolean;
  isLoading: boolean;
  onActivate: () => void;
  onClose: () => void;
  onConfirmAction: () => void;
  onDelete: () => void;
  onDismissConfirm: () => void;
  onRestore: () => void;
  onRevokeSessions: () => void;
  onRoleChange: (role: AdminUserRole) => void;
  onSuspend: () => void;
  onUpdateRole: () => void;
  roleDraft: AdminUserRole;
  user: AdminUser | null;
}) {
  const status = user ? readUserStatus(user) : "active";
  const isDeleted = status === "deleted" || Boolean(user?.deletedAt);
  const isSuspended = status === "suspended";

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-[32px] border border-black/5 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
              User Detail
            </p>
            <h3 className="mt-2 [font-family:var(--font-outfit)] text-3xl font-extrabold text-[#1b1c19]">
              {user?.name ?? "Loading user"}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#5f5e5e]">
              {user?.email ?? "Fetching detail API..."}
            </p>
          </div>
          <button
            aria-label="Close user detail"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:text-[#1b1c19]"
            disabled={isActionPending}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {detailError ? (
          <InlineMessage tone="error">
            {detailError instanceof Error
              ? detailError.message
              : "Unable to load user detail."}
          </InlineMessage>
        ) : null}
        {actionError ? <InlineMessage tone="error">{actionError}</InlineMessage> : null}
        {actionMessage ? (
          <InlineMessage tone="success">{actionMessage}</InlineMessage>
        ) : null}

        <div className="grid gap-5 pt-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            {isLoading && !user ? <UsersLoading compact /> : null}
            {user ? (
              <>
                <DetailRow label="ID" value={getAdminUserId(user) || "N/A"} />
                <DetailRow label="Role" value={user.role} />
                <DetailRow label="Status" value={status} />
                <DetailRow
                  label="Points"
                  value={formatNumber(user.totalPoints ?? 0)}
                />
                <DetailRow
                  label="Created"
                  value={user.createdAt ? formatDate(user.createdAt) : "N/A"}
                />
                <DetailRow
                  label="Updated"
                  value={user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
                />
              </>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#cabeff] bg-[#f6f2ff] p-4">
              <label
                className="text-xs font-bold uppercase tracking-normal text-[#614db7]"
                htmlFor="admin-user-role"
              >
                Update role
              </label>
              <div className="mt-3 flex gap-2">
                <select
                  className="h-11 min-w-0 flex-1 rounded-2xl border border-black/5 bg-white px-3 text-sm font-bold text-[#1b1c19] outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20"
                  disabled={isActionPending || !user}
                  id="admin-user-role"
                  onChange={(event) =>
                    onRoleChange(event.target.value as AdminUserRole)
                  }
                  value={roleDraft}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#614db7] px-4 text-sm font-extrabold text-white transition hover:bg-[#4f3aa0] disabled:opacity-50"
                  disabled={isActionPending || !user || user.role === roleDraft}
                  onClick={onUpdateRole}
                  type="button"
                >
                  {isActionPending ? (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCog aria-hidden="true" className="h-4 w-4" />
                  )}
                  Save
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <ActionButton
                disabled={isActionPending || !user || isSuspended || isDeleted}
                icon={UserX}
                label="Suspend user"
                onClick={onSuspend}
                tone="danger"
              />
              <ActionButton
                disabled={isActionPending || !user || (!isSuspended && !isDeleted)}
                icon={Power}
                label="Activate user"
                onClick={onActivate}
              />
              <ActionButton
                disabled={isActionPending || !user || isDeleted}
                icon={ShieldAlert}
                label="Revoke sessions"
                onClick={onRevokeSessions}
                tone="danger"
              />
              <ActionButton
                disabled={isActionPending || !user || isDeleted}
                icon={Trash2}
                label="Delete user"
                onClick={onDelete}
                tone="danger"
              />
              <ActionButton
                disabled={isActionPending || !user || !isDeleted}
                icon={RotateCcw}
                label="Restore user"
                onClick={onRestore}
              />
            </div>

            {confirmAction ? (
              <ConfirmBox
                action={confirmAction}
                isPending={isActionPending}
                onCancel={onDismissConfirm}
                onConfirm={onConfirmAction}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  disabled,
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: {
  disabled: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  const toneClassName =
    tone === "danger"
      ? "bg-[#fff0f0] text-[#a33a3a] hover:bg-[#ffdad6]"
      : "bg-[#f6f3ee] text-[#5f5e5e] hover:text-[#1b1c19]";

  return (
    <button
      className={`inline-flex h-11 items-center gap-3 rounded-2xl px-4 text-sm font-extrabold transition disabled:pointer-events-none disabled:opacity-45 ${toneClassName}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

function ConfirmBox({
  action,
  isPending,
  onCancel,
  onConfirm,
}: {
  action: ConfirmAction;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const buttonClassName =
    action.tone === "danger"
      ? "bg-[#a33a3a] text-white hover:bg-[#842d2d]"
      : "bg-[#614db7] text-white hover:bg-[#4f3aa0]";

  return (
    <div className="rounded-[24px] border border-black/5 bg-[#fbf9f4] p-4">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0f0] text-[#a33a3a]">
          <AlertTriangle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-[#1b1c19]">{action.title}</p>
          <p className="mt-1 text-sm leading-6 text-[#5f5e5e]">
            {action.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="h-10 flex-1 rounded-2xl bg-white text-sm font-extrabold text-[#5f5e5e] transition hover:text-[#1b1c19] disabled:opacity-50"
          disabled={isPending}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold transition disabled:opacity-50 ${buttonClassName}`}
          disabled={isPending}
          onClick={onConfirm}
          type="button"
        >
          {isPending ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : null}
          {action.label}
        </button>
      </div>
    </div>
  );
}

function InlineMessage({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "error" | "success";
}) {
  const toneClassName =
    tone === "error"
      ? "bg-[#fff0f0] text-[#a33a3a]"
      : "bg-[#f6f2ff] text-[#614db7]";

  return (
    <p
      aria-live="polite"
      className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold ${toneClassName}`}
    >
      {tone === "success" ? (
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
      ) : (
        <AlertTriangle aria-hidden="true" className="h-4 w-4" />
      )}
      {children}
    </p>
  );
}

function UsersLoading({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-sm font-bold text-[#614db7] ${
        compact ? "min-h-[180px]" : "min-h-[220px] min-w-[780px]"
      }`}
    >
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fbf9f4] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-extrabold text-[#1b1c19]">
        {value}
      </p>
    </div>
  );
}

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

function readUserStatus(user: AdminUser) {
  if (user.deletedAt) return "deleted";
  return user.status ?? "active";
}
