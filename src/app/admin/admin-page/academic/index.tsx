"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAPI,
  type AdminAcademicDepartment,
  type AdminAcademicEntityStatus,
  type AdminAcademicSubject,
  type AdminCreateAcademicDepartmentInput,
  type AdminCreateAcademicSubjectInput,
  type AdminUpdateAcademicDepartmentInput,
  type AdminUpdateAcademicSubjectInput,
} from "@/services/api";
import {
  type AcademicConfirmAction,
  type DepartmentCode,
  getAcademicConfirmDescription,
  getAcademicEntityId,
} from "./academic.config";
import { AcademicHeader } from "./components/AcademicHeader";
import {
  AcademicConfirmDialog,
  AcademicInlineError,
  AcademicLoading,
} from "./components/AdminAcademicUi";
import {
  DepartmentCard,
  MissingDepartmentCard,
} from "./components/DepartmentCard";
import { DepartmentFormModal } from "./components/DepartmentFormModal";
import { SubjectFormModal } from "./components/SubjectFormModal";
import { SubjectsSection } from "./components/SubjectsSection";

export function AcademicPanel() {
  const queryClient = useQueryClient();
  const [departmentCode, setDepartmentCode] = useState<DepartmentCode>("AI");
  const [semester, setSemester] = useState(1);
  const [status, setStatus] = useState<AdminAcademicEntityStatus>("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [departmentFormOpen, setDepartmentFormOpen] = useState(false);
  const [subjectFormOpen, setSubjectFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] =
    useState<AdminAcademicSubject | null>(null);
  const [confirmAction, setConfirmAction] =
    useState<AcademicConfirmAction | null>(null);

  const departmentsQuery = useQuery({
    queryKey: ["admin", "academic", "departments"],
    queryFn: () =>
      adminAPI.getAcademicDepartments({ page: 1, take: 100, status: "all" }),
  });

  const departments = departmentsQuery.data?.data ?? [];
  const department = departments.find(
    (item) => item.code.trim().toUpperCase() === departmentCode,
  );
  const departmentId = getAcademicEntityId(department);

  const subjectsQuery = useQuery({
    queryKey: [
      "admin",
      "academic",
      "subjects",
      departmentId,
      semester,
      status,
      keyword,
      page,
    ],
    queryFn: () =>
      adminAPI.getAcademicSubjects({
        departmentId,
        keyword: keyword || undefined,
        page,
        semester,
        status,
        take: 20,
      }),
    enabled: Boolean(departmentId),
  });

  const invalidateAcademic = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "academic"] });

  const createDepartmentMutation = useMutation({
    mutationFn: (data: AdminCreateAcademicDepartmentInput) =>
      adminAPI.createAcademicDepartment(data),
    onSuccess: async () => {
      await invalidateAcademic();
      setDepartmentFormOpen(false);
    },
  });
  const updateDepartmentMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AdminUpdateAcademicDepartmentInput;
    }) => adminAPI.updateAcademicDepartment(id, data),
    onSuccess: async () => {
      await invalidateAcademic();
      setDepartmentFormOpen(false);
    },
  });
  const deactivateDepartmentMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deactivateAcademicDepartment(id),
    onSuccess: async () => {
      await invalidateAcademic();
      setConfirmAction(null);
    },
  });
  const restoreDepartmentMutation = useMutation({
    mutationFn: (id: string) => adminAPI.restoreAcademicDepartment(id),
    onSuccess: async () => {
      await invalidateAcademic();
      setConfirmAction(null);
    },
  });
  const createSubjectMutation = useMutation({
    mutationFn: (data: AdminCreateAcademicSubjectInput) =>
      adminAPI.createAcademicSubject(data),
    onSuccess: async () => {
      await invalidateAcademic();
      setSubjectFormOpen(false);
    },
  });
  const updateSubjectMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AdminUpdateAcademicSubjectInput;
    }) => adminAPI.updateAcademicSubject(id, data),
    onSuccess: async () => {
      await invalidateAcademic();
      setSubjectFormOpen(false);
      setEditingSubject(null);
    },
  });
  const deactivateSubjectMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deactivateAcademicSubject(id),
    onSuccess: async () => {
      await invalidateAcademic();
      setConfirmAction(null);
    },
  });
  const restoreSubjectMutation = useMutation({
    mutationFn: (id: string) => adminAPI.restoreAcademicSubject(id),
    onSuccess: async () => {
      await invalidateAcademic();
      setConfirmAction(null);
    },
  });

  const mutationError =
    createDepartmentMutation.error ??
    updateDepartmentMutation.error ??
    deactivateDepartmentMutation.error ??
    restoreDepartmentMutation.error ??
    createSubjectMutation.error ??
    updateSubjectMutation.error ??
    deactivateSubjectMutation.error ??
    restoreSubjectMutation.error;

  function changeDepartment(code: DepartmentCode) {
    setDepartmentCode(code);
    setSemester(1);
    setPage(1);
    setKeyword("");
  }

  async function submitDepartment(
    data:
      | AdminCreateAcademicDepartmentInput
      | AdminUpdateAcademicDepartmentInput,
  ) {
    if (department && departmentId) {
      await updateDepartmentMutation.mutateAsync({ id: departmentId, data });
      return;
    }

    await createDepartmentMutation.mutateAsync({
      code: departmentCode,
      description: data.description,
      isActive: true,
      name: data.name ?? departmentCode,
    });
  }

  async function submitSubject(data: AdminCreateAcademicSubjectInput) {
    const subjectId = getAcademicEntityId(editingSubject);
    if (editingSubject && subjectId) {
      await updateSubjectMutation.mutateAsync({
        id: subjectId,
        data: {
          code: data.code,
          isActive: editingSubject.isActive,
          name: data.name,
          semester: data.semester,
        },
      });
      return;
    }

    await createSubjectMutation.mutateAsync(data);
  }

  async function confirmCurrentAction() {
    try {
      if (!confirmAction) return;
      if ("department" in confirmAction) {
        const id = getAcademicEntityId(confirmAction.department);
        if (!id) return;
        if (confirmAction.kind === "deactivate-department") {
          await deactivateDepartmentMutation.mutateAsync(id);
        } else {
          await restoreDepartmentMutation.mutateAsync(id);
        }
        return;
      }

      const id = getAcademicEntityId(confirmAction.subject);
      if (!id) return;
      if (confirmAction.kind === "deactivate-subject") {
        await deactivateSubjectMutation.mutateAsync(id);
      } else {
        await restoreSubjectMutation.mutateAsync(id);
      }
    } catch {
      // React Query exposes the request error in the panel.
    }
  }

  function openSubjectForm(subject: AdminAcademicSubject | null) {
    setEditingSubject(subject);
    setSubjectFormOpen(true);
  }

  function requestDepartmentStatusChange(
    selectedDepartment: AdminAcademicDepartment,
  ) {
    setConfirmAction({
      department: selectedDepartment,
      kind: selectedDepartment.isActive
        ? "deactivate-department"
        : "restore-department",
    });
  }

  function requestSubjectStatusChange(subject: AdminAcademicSubject) {
    setConfirmAction({
      kind: subject.isActive ? "deactivate-subject" : "restore-subject",
      subject,
    });
  }

  const actionPending =
    deactivateDepartmentMutation.isPending ||
    restoreDepartmentMutation.isPending ||
    deactivateSubjectMutation.isPending ||
    restoreSubjectMutation.isPending;

  return (
    <section className="mt-8 space-y-6">
      <AcademicHeader
        departmentCode={departmentCode}
        onDepartmentChange={changeDepartment}
      />

      {departmentsQuery.isPending ? (
        <AcademicLoading label="Loading departments..." />
      ) : departmentsQuery.isError ? (
        <AcademicInlineError error={departmentsQuery.error} />
      ) : !department ? (
        <MissingDepartmentCard
          code={departmentCode}
          onCreate={() => setDepartmentFormOpen(true)}
        />
      ) : (
        <>
          <DepartmentCard
            department={department}
            onEdit={() => setDepartmentFormOpen(true)}
            onStatusChange={() => requestDepartmentStatusChange(department)}
          />
          <SubjectsSection
            department={department}
            error={subjectsQuery.error}
            isFetching={subjectsQuery.isFetching}
            isPending={subjectsQuery.isPending}
            key={departmentCode}
            meta={subjectsQuery.data?.meta}
            onAdd={() => openSubjectForm(null)}
            onEdit={openSubjectForm}
            onPageChange={setPage}
            onSearch={(nextKeyword) => {
              setKeyword(nextKeyword);
              setPage(1);
            }}
            onSemesterChange={(nextSemester) => {
              setSemester(nextSemester);
              setPage(1);
            }}
            onStatusChange={(nextStatus) => {
              setStatus(nextStatus);
              setPage(1);
            }}
            onSubjectStatusChange={requestSubjectStatusChange}
            page={page}
            semester={semester}
            status={status}
            subjects={subjectsQuery.data?.data ?? []}
          />
        </>
      )}

      {mutationError && !departmentFormOpen && !subjectFormOpen ? (
        <AcademicInlineError error={mutationError} />
      ) : null}

      {departmentFormOpen ? (
        <DepartmentFormModal
          code={departmentCode}
          department={department}
          error={
            createDepartmentMutation.error ?? updateDepartmentMutation.error
          }
          isPending={
            createDepartmentMutation.isPending ||
            updateDepartmentMutation.isPending
          }
          onClose={() => setDepartmentFormOpen(false)}
          onSubmit={submitDepartment}
        />
      ) : null}

      {subjectFormOpen && departmentId ? (
        <SubjectFormModal
          departmentId={departmentId}
          error={createSubjectMutation.error ?? updateSubjectMutation.error}
          initialSemester={semester}
          isPending={
            createSubjectMutation.isPending || updateSubjectMutation.isPending
          }
          onClose={() => {
            setSubjectFormOpen(false);
            setEditingSubject(null);
          }}
          onSubmit={submitSubject}
          subject={editingSubject}
        />
      ) : null}

      {confirmAction ? (
        <AcademicConfirmDialog
          confirmLabel={
            confirmAction.kind.startsWith("restore")
              ? "Restore"
              : "Deactivate"
          }
          description={getAcademicConfirmDescription(confirmAction)}
          isPending={actionPending}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => void confirmCurrentAction()}
          tone={
            confirmAction.kind.startsWith("restore") ? "primary" : "danger"
          }
          title={
            confirmAction.kind.startsWith("restore")
              ? "Restore item?"
              : "Deactivate item?"
          }
        />
      ) : null}
    </section>
  );
}
