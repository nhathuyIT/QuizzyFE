import {
  Loader2,
  Power,
  RotateCcw,
  ShieldAlert,
  Trash2,
  UserCog,
  UserX,
  type LucideIcon,
} from "lucide-react";
import type { AdminUser, AdminUserRole } from "@/services/api";
import {
  CrudConfirmBox,
  CrudInlineMessage,
  CrudLoading,
  CrudModal,
} from "../../../crud/components";
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
    <CrudModal
      eyebrow="User Detail"
      isCloseDisabled={isActionPending}
      onClose={onClose}
      subtitle={user?.email ?? "Fetching detail API..."}
      title={user?.name ?? "Loading user"}
    >
        {detailError ? (
          <CrudInlineMessage tone="error">
            {detailError instanceof Error
              ? detailError.message
              : "Unable to load user detail."}
          </CrudInlineMessage>
        ) : null}
        {actionError ? (
          <CrudInlineMessage tone="error">{actionError}</CrudInlineMessage>
        ) : null}
        {actionMessage ? (
          <CrudInlineMessage tone="success">{actionMessage}</CrudInlineMessage>
        ) : null}

        <div className="grid gap-5 pt-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-3">
            {isLoading && !user ? (
              <CrudLoading label="Loading users" minWidthClassName="" />
            ) : null}
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
              <CrudConfirmBox
                action={confirmAction}
                isPending={isActionPending}
                onCancel={onDismissConfirm}
                onConfirm={onConfirmAction}
                onReasonChange={onSuspendReasonChange}
                reason={suspendReason}
              />
            ) : null}
          </div>
        </div>
    </CrudModal>
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
