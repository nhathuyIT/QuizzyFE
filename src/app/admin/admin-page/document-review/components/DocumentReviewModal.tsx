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
  getDocumentEntityId,
  getDocumentRelationId,
  getDocumentSubjectDepartmentId,
  getDocumentSubjectLabel,
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
  const subjectsQuery = useQuery({
    queryKey: ["admin", "academic", "subjects", "document-edit", departmentId],
    queryFn: () =>
      adminAPI.getAcademicSubjects({
        departmentId: departmentId || undefined,
        status: "all",
        take: 100,
      }),
  });

  const document = documentQuery.data?.data;
  const subjects = useMemo(
    () => subjectsQuery.data?.data ?? [],
    [subjectsQuery.data?.data],
  );
  const effectiveSubjectId =
    subjectId ?? getDocumentRelationId(document?.subjectId);
  const inferredSubject = subjects.find(
    (subject) => getDocumentEntityId(subject) === effectiveSubjectId,
  );
  const effectiveDepartmentId =
    departmentId ??
    (getDocumentSubjectDepartmentId(document?.subjectId) ||
      getDocumentRelationId(inferredSubject?.departmentId));
  const currentSubject = useMemo(
    () =>
      subjects.find(
        (subject) => getDocumentEntityId(subject) === effectiveSubjectId,
      ),
    [effectiveSubjectId, subjects],
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
                  : getDocumentSubjectLabel(document.subjectId)
              }
              document={document}
              note={note}
              onNoteChange={setNote}
            />

            <div>
              <DocumentMetadataForm
                departments={departments}
                document={document}
                effectiveDepartmentId={effectiveDepartmentId}
                effectiveSubjectId={effectiveSubjectId}
                error={mutationError}
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
