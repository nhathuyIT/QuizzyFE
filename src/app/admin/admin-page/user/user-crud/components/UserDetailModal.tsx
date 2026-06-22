import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Power,
  RotateCcw,
  ShieldAlert,
  Trash2,
  UserCog,
  UserX,
  X,
  type LucideIcon,
} from "lucide-react";
import type { AdminUser, AdminUserRole } from "@/services/api";
import { formatDate, formatNumber } from "../../../dashboard/components/formatters";
import {
  getAdminUserId,
  readUserStatus,
  type ConfirmAction,
  userRoleOptions,
} from "../user-form.config";

export function UserDetailModal({
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
  onSuspendReasonChange,
  onSuspend,
  onUpdateRole,
  roleDraft,
  suspendReason,
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
  onSuspendReasonChange: (reason: string) => void;
  onSuspend: () => void;
  onUpdateRole: () => void;
  roleDraft: AdminUserRole;
  suspendReason: string;
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
            {isLoading && !user ? <UsersLoading /> : null}
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
                  {userRoleOptions.map((role) => (
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
                onSuspendReasonChange={onSuspendReasonChange}
                suspendReason={suspendReason}
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
  onSuspendReasonChange,
  suspendReason,
}: {
  action: ConfirmAction;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onSuspendReasonChange: (reason: string) => void;
  suspendReason: string;
}) {
  const buttonClassName =
    action.tone === "danger"
      ? "bg-[#a33a3a] text-white hover:bg-[#842d2d]"
      : "bg-[#614db7] text-white hover:bg-[#4f3aa0]";
  const requiresReason = action.type === "suspend";
  const confirmDisabled = isPending || (requiresReason && !suspendReason.trim());

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
      {requiresReason ? (
        <div className="mt-4">
          <label
            className="text-xs font-bold uppercase tracking-normal text-[#a33a3a]"
            htmlFor="suspend-reason"
          >
            Suspend reason
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-[#ffdad6] bg-white px-4 py-3 text-sm font-semibold text-[#1b1c19] outline-none transition placeholder:text-[#9d8f8f] focus:border-[#a33a3a] focus:ring-4 focus:ring-[#a33a3a]/10 disabled:opacity-60"
            disabled={isPending}
            id="suspend-reason"
            onChange={(event) => onSuspendReasonChange(event.target.value)}
            placeholder="Enter the reason for suspending this user"
            value={suspendReason}
          />
        </div>
      ) : null}
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
          disabled={confirmDisabled}
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

function UsersLoading() {
  return (
    <div className="flex min-h-[180px] items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      Loading users
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
