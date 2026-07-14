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
import { AcademicDocumentsSection } from "./components/AcademicDocumentsSection";
import { SubjectFormModal } from "./components/SubjectFormModal";
import { SubjectsSection } from "./components/SubjectsSection";

export function AcademicPanel() {
  const queryClient = useQueryClient();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [semester, setSemester] = useState(1);
  const [status, setStatus] = useState<AdminAcademicEntityStatus>("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [departmentFormOpen, setDepartmentFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<AdminAcademicDepartment | null>(null);
  const [subjectFormOpen, setSubjectFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] =
    useState<AdminAcademicSubject | null>(null);
  const [browsingSubject, setBrowsingSubject] =
    useState<AdminAcademicSubject | null>(null);
  const [confirmAction, setConfirmAction] =
    useState<AcademicConfirmAction | null>(null);

  const departmentsQuery = useQuery({
    queryKey: ["admin", "academic", "departments"],
    queryFn: () =>
      adminAPI.getAcademicDepartments({ page: 1, take: 100, status: "all" }),
  });

  const departments = departmentsQuery.data?.data ?? [];
  const effectiveDepartmentId = departments.some(
    (item) => getAcademicEntityId(item) === selectedDepartmentId,
  )
    ? selectedDepartmentId
    : getAcademicEntityId(departments[0]);
  const department = departments.find(
    (item) => getAcademicEntityId(item) === effectiveDepartmentId,
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
      setEditingDepartment(null);
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
      setEditingDepartment(null);
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
      setBrowsingSubject(null);
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

  function changeDepartment(id: string) {
    setSelectedDepartmentId(id);
    setSemester(1);
    setPage(1);
    setKeyword("");
    setBrowsingSubject(null);
  }

  async function submitDepartment(
    data:
      | AdminCreateAcademicDepartmentInput
      | AdminUpdateAcademicDepartmentInput,
  ) {
    const editingDepartmentId = getAcademicEntityId(editingDepartment);
    if (editingDepartment && editingDepartmentId) {
      await updateDepartmentMutation.mutateAsync({
        id: editingDepartmentId,
        data,
      });
      return;
    }

    const response = await createDepartmentMutation.mutateAsync({
      code: data.code ?? "",
      description: data.description,
      isActive: true,
      name: data.name ?? "",
    });
    setSelectedDepartmentId(getAcademicEntityId(response.data));
  }

  async function submitSubject(data: AdminCreateAcademicSubjectInput) {
    const subjectId = getAcademicEntityId(editingSubject);
    if (editingSubject && subjectId) {
      const currentDepartmentId = editingSubject.departmentId;
      await updateSubjectMutation.mutateAsync({
        id: subjectId,
        data: {
          code: data.code,
          ...(data.departmentId !== currentDepartmentId
            ? { departmentId: data.departmentId }
            : {}),
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

  function browseSubjectDocuments(subject: AdminAcademicSubject) {
    if (!getAcademicEntityId(subject)) return;
    setBrowsingSubject(subject);
    window.requestAnimationFrame(() => {
      window.document
        .getElementById("academic-documents")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        departments={departments}
        onCreate={() => {
          setEditingDepartment(null);
          setDepartmentFormOpen(true);
        }}
        onDepartmentChange={changeDepartment}
        selectedDepartmentId={departmentId}
      />

      {departmentsQuery.isPending ? (
        <AcademicLoading label="Loading departments..." />
      ) : departmentsQuery.isError ? (
        <AcademicInlineError error={departmentsQuery.error} />
      ) : !department ? (
        <MissingDepartmentCard
          onCreate={() => {
            setEditingDepartment(null);
            setDepartmentFormOpen(true);
          }}
        />
      ) : (
        <>
          <DepartmentCard
            department={department}
            onEdit={() => {
              setEditingDepartment(department);
              setDepartmentFormOpen(true);
            }}
            onStatusChange={() => requestDepartmentStatusChange(department)}
          />
          <SubjectsSection
            department={department}
            error={subjectsQuery.error}
            isFetching={subjectsQuery.isFetching}
            isPending={subjectsQuery.isPending}
            key={departmentId}
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
              setBrowsingSubject(null);
            }}
            onStatusChange={(nextStatus) => {
              setStatus(nextStatus);
              setPage(1);
            }}
            onSubjectStatusChange={requestSubjectStatusChange}
            onViewDocuments={browseSubjectDocuments}
            page={page}
            semester={semester}
            status={status}
            subjects={subjectsQuery.data?.data ?? []}
          />
          <AcademicDocumentsSection
            department={department}
            key={`${departmentId}:${getAcademicEntityId(browsingSubject) || "all"}`}
            onClearSubject={() => setBrowsingSubject(null)}
            subject={browsingSubject}
          />
        </>
      )}

      {mutationError && !departmentFormOpen && !subjectFormOpen ? (
        <AcademicInlineError error={mutationError} />
      ) : null}

      {departmentFormOpen ? (
        <DepartmentFormModal
          department={editingDepartment}
          error={
            createDepartmentMutation.error ?? updateDepartmentMutation.error
          }
          isPending={
            createDepartmentMutation.isPending ||
            updateDepartmentMutation.isPending
          }
          onClose={() => {
            setDepartmentFormOpen(false);
            setEditingDepartment(null);
          }}
          onSubmit={submitDepartment}
        />
      ) : null}

      {subjectFormOpen && departmentId ? (
        <SubjectFormModal
          departments={departments}
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
