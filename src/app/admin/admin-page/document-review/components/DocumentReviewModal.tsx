"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAPI,
  type AdminAcademicDepartment,
  type AdminReviewAcademicDocumentInput,
  type AdminUpdateAcademicDocumentInput,
} from "@/services/api";
import {
  AcademicConfirmDialog,
  AcademicInlineError,
  AcademicLoading,
  AcademicModal,
} from "../../academic/components/AdminAcademicUi";
import {
  documentActionDescriptions,
  documentActionLabels,
  getDocumentDepartmentId,
  getDocumentEntityId,
  getDocumentRelationId,
  getDocumentSubjectLabel,
  resolveDocumentSubject,
  type DocumentReviewAction,
} from "../document-review.config";
import { DocumentMetadataForm } from "./DocumentMetadataForm";
import { DocumentReviewActions } from "./DocumentReviewActions";
import { DocumentReviewAside } from "./DocumentReviewAside";

export function DocumentReviewModal({
  departments,
  documentId,
  onClose,
}: {
  departments: AdminAcademicDepartment[];
  documentId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [action, setAction] = useState<DocumentReviewAction | null>(null);
  const [saved, setSaved] = useState(false);

  const documentQuery = useQuery({
    queryKey: ["admin", "academic", "documents", "detail", documentId],
    queryFn: () => adminAPI.getAcademicDocument(documentId),
  });
  const document = documentQuery.data?.data;
  const populatedSubject = document
    ? resolveDocumentSubject(document, [])
    : undefined;
  const effectiveDepartmentId =
    departmentId ?? getDocumentDepartmentId(document);
  const effectiveSubjectId =
    subjectId ??
    getDocumentRelationId(document?.subject ?? document?.subjectId);

  const subjectsQuery = useQuery({
    queryKey: [
      "admin",
      "academic",
      "subjects",
      "document-edit",
      effectiveDepartmentId,
    ],
    queryFn: () =>
      adminAPI.getAcademicSubjects({
        departmentId: effectiveDepartmentId,
        status: "all",
        take: 100,
      }),
    enabled: Boolean(effectiveDepartmentId),
  });

  const subjects = useMemo(
    () => {
      const queriedSubjects = subjectsQuery.data?.data ?? [];
      const populatedSubjectId = getDocumentEntityId(populatedSubject);
      if (
        effectiveDepartmentId !== getDocumentDepartmentId(document) ||
        !populatedSubject ||
        !populatedSubjectId ||
        queriedSubjects.some(
          (subject) => getDocumentEntityId(subject) === populatedSubjectId,
        )
      ) {
        return queriedSubjects;
      }
      return [populatedSubject, ...queriedSubjects];
    },
    [document, effectiveDepartmentId, populatedSubject, subjectsQuery.data?.data],
  );
  const departmentOptions = useMemo(() => {
    const populatedDepartmentId = getDocumentEntityId(document?.department);
    if (
      !document?.department ||
      !populatedDepartmentId ||
      departments.some(
        (department) =>
          getDocumentEntityId(department) === populatedDepartmentId,
      )
    ) {
      return departments;
    }
    return [document.department, ...departments];
  }, [departments, document]);
  const currentSubject = useMemo(
    () =>
      subjects.find(
        (subject) => getDocumentEntityId(subject) === effectiveSubjectId,
      ) ?? populatedSubject,
    [effectiveSubjectId, populatedSubject, subjects],
  );

  const invalidateDocuments = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin", "academic", "documents"],
    });
  };

  const updateMutation = useMutation({
    mutationFn: (data: AdminUpdateAcademicDocumentInput) =>
      adminAPI.updateAcademicDocument(documentId, data),
    onSuccess: async () => {
      setSaved(true);
      await invalidateDocuments();
    },
  });
  const reviewMutation = useMutation({
    mutationFn: (data: AdminReviewAcademicDocumentInput) =>
      adminAPI.reviewAcademicDocument(documentId, data),
    onSuccess: async () => {
      await invalidateDocuments();
      onClose();
    },
  });
  const archiveMutation = useMutation({
    mutationFn: () => adminAPI.archiveAcademicDocument(documentId),
    onSuccess: async () => {
      await invalidateDocuments();
      onClose();
    },
  });
  const restoreMutation = useMutation({
    mutationFn: () => adminAPI.restoreAcademicDocument(documentId),
    onSuccess: async () => {
      await invalidateDocuments();
      onClose();
    },
  });

  const mutationError =
    updateMutation.error ??
    reviewMutation.error ??
    archiveMutation.error ??
    restoreMutation.error;
  const actionPending =
    reviewMutation.isPending ||
    archiveMutation.isPending ||
    restoreMutation.isPending;

  async function saveMetadata(data: AdminUpdateAcademicDocumentInput) {
    setSaved(false);
    await updateMutation.mutateAsync(data);
  }

  async function confirmAction() {
    try {
      if (!action) return;
      if (action === "archive") {
        await archiveMutation.mutateAsync();
        return;
      }
      if (action === "restore") {
        await restoreMutation.mutateAsync();
        return;
      }

      const statuses: Record<
        Exclude<DocumentReviewAction, "archive" | "restore">,
        AdminReviewAcademicDocumentInput["status"]
      > = {
        approve: "active",
        pending: "pending",
        reject: "rejected",
      };
      await reviewMutation.mutateAsync({
        note: note.trim() || undefined,
        status: statuses[action],
      });
    } catch {
      // React Query keeps the mutation error visible in the modal.
    }
  }

  return (
    <>
      <AcademicModal
        description="Review the source file before changing its publishing status."
        onClose={onClose}
        title={document?.title ?? "Document detail"}
        widthClass="max-w-[1040px]"
      >
        {documentQuery.isPending ? (
          <AcademicLoading label="Loading document detail..." />
        ) : documentQuery.isError ? (
          <AcademicInlineError error={documentQuery.error} />
        ) : document ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <DocumentReviewAside
              currentSubjectLabel={
                currentSubject
                  ? `${currentSubject.code} — ${currentSubject.name}`
                  : getDocumentSubjectLabel(
                      document.subject ?? document.subjectId,
                    )
              }
              document={document}
              note={note}
              onNoteChange={setNote}
            />

            <div>
              <DocumentMetadataForm
                departments={departmentOptions}
                document={document}
                effectiveDepartmentId={effectiveDepartmentId}
                effectiveSubjectId={effectiveSubjectId}
                error={mutationError ?? subjectsQuery.error}
                isPending={updateMutation.isPending}
                onDepartmentChange={(nextDepartmentId) => {
                  setDepartmentId(nextDepartmentId);
                  setSubjectId("");
                }}
                onSubjectChange={setSubjectId}
                onSubmit={saveMetadata}
                saved={saved}
                subjects={subjects}
              />
              <DocumentReviewActions
                onAction={setAction}
                status={document.status}
              />
            </div>
          </div>
        ) : null}
      </AcademicModal>

      {action ? (
        <AcademicConfirmDialog
          confirmLabel={documentActionLabels[action]}
          description={documentActionDescriptions[action]}
          isPending={actionPending}
          onCancel={() => setAction(null)}
          onConfirm={() => void confirmAction()}
          tone={
            action === "reject" || action === "archive"
              ? "danger"
              : "primary"
          }
          title={`${documentActionLabels[action]}?`}
        />
      ) : null}
    </>
  );
}
