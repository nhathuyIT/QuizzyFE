"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAPI,
  type AdminUser,
  type AdminUserRole,
} from "@/services/api";
import { CrudPanel } from "../../crud/components";
import { UserTable } from "./components/UserTable";
import { UserDetailModal } from "./components/UserDetailModal";
import {
  getAdminUserId,
  type ConfirmAction,
  userConfirmActions,
} from "./user-form.config";

export function UsersPanel() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<AdminUserRole>("student");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
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
    mutationFn: ({ reason, userId }: { reason: string; userId: string }) =>
      adminAPI.suspendUser(userId, reason),
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
    setSuspendReason("");
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

    if (confirmAction.type === "suspend") {
      const reason = suspendReason.trim();

      if (!reason) {
        setActionError("Please enter a suspend reason.");
        return;
      }

      suspendMutation.mutate({ reason, userId: selectedUserId });
    }
    if (confirmAction.type === "activate") activateMutation.mutate(selectedUserId);
    if (confirmAction.type === "revoke") revokeSessionsMutation.mutate(selectedUserId);
    if (confirmAction.type === "delete") deleteMutation.mutate(selectedUserId);
    if (confirmAction.type === "restore") restoreMutation.mutate(selectedUserId);
  }

  return (
    <CrudPanel
      description="List, inspect, and manage admin user actions."
      isRefreshing={usersQuery.isFetching}
      onRefresh={() => usersQuery.refetch()}
      title="Users"
    >
      <UserTable
        error={usersQuery.error}
        isError={usersQuery.isError}
        isLoading={usersQuery.isPending}
        onOpenUser={handleOpenUser}
        selectedUserId={selectedUserId}
        users={users}
      />

      {selectedUserId ? (
        <UserDetailModal
          actionError={actionError}
          actionMessage={actionMessage}
          confirmAction={confirmAction}
          detailError={userDetailQuery.error}
          isActionPending={isActionPending}
          isLoading={userDetailQuery.isFetching}
          onActivate={() => setConfirmAction(userConfirmActions.activate)}
          onClose={handleCloseUser}
          onConfirmAction={handleConfirmedAction}
          onDelete={() => setConfirmAction(userConfirmActions.delete)}
          onDismissConfirm={() => {
            setConfirmAction(null);
            setSuspendReason("");
          }}
          onRestore={() => setConfirmAction(userConfirmActions.restore)}
          onRevokeSessions={() => setConfirmAction(userConfirmActions.revoke)}
          onRoleChange={setRoleDraft}
          onSuspend={() => {
            setSuspendReason("");
            setConfirmAction(userConfirmActions.suspend);
          }}
          onUpdateRole={handleRoleUpdate}
          roleDraft={roleDraft}
          suspendReason={suspendReason}
          onSuspendReasonChange={setSuspendReason}
          user={selectedUserDetail}
        />
      ) : null}
    </CrudPanel>
  );
}
