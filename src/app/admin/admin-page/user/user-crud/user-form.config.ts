import type { AdminUser, AdminUserRole } from "@/services/api";

export type ConfirmAction = {
  description: string;
  label: string;
  title: string;
  tone: "default" | "danger";
  type: "activate" | "delete" | "restore" | "revoke" | "suspend";
};

export const userRoleOptions: AdminUserRole[] = ["student", "teacher", "admin"];

export const userConfirmActions = {
  activate: {
    description: "This will allow the user to sign in again.",
    label: "Activate user",
    title: "Activate this user?",
    tone: "default",
    type: "activate",
  },
  delete: {
    description: "This soft deletes the user account.",
    label: "Delete user",
    title: "Delete this user?",
    tone: "danger",
    type: "delete",
  },
  restore: {
    description: "This restores the deleted user account.",
    label: "Restore user",
    title: "Restore this user?",
    tone: "default",
    type: "restore",
  },
  revoke: {
    description: "This signs the user out from active sessions.",
    label: "Revoke sessions",
    title: "Revoke user sessions?",
    tone: "danger",
    type: "revoke",
  },
  suspend: {
    description: "This blocks the user from continuing to use the app.",
    label: "Suspend user",
    title: "Suspend this user?",
    tone: "danger",
    type: "suspend",
  },
} satisfies Record<ConfirmAction["type"], ConfirmAction>;

export function getAdminUserId(user: AdminUser) {
  return user.id ?? user._id ?? "";
}

export function readUserStatus(user: AdminUser) {
  if (user.deletedAt) return "deleted";
  return user.status ?? "active";
}
