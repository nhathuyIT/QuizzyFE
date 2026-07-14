"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Eye, FileText, Loader2 } from "lucide-react";
import { adminAPI } from "@/services/api";
import {
  formatAcademicDocumentBytes,
  formatAcademicDocumentDate,
  getAcademicDocumentDepartmentLabel,
  getAcademicDocumentReviewerLabel,
  getAcademicDocumentSubjectLabel,
  getAcademicDocumentUploaderLabel,
} from "../academic-document.utils";
import {
  AcademicInlineError,
  AcademicLoading,
  AcademicModal,
  AcademicStatusBadge,
} from "./AdminAcademicUi";

export function AcademicDocumentDetailModal({
  documentId,
  onClose,
}: {
  documentId: string;
  onClose: () => void;
}) {
  const documentQuery = useQuery({
    queryKey: ["admin", "academic", "documents", "browse-detail", documentId],
    queryFn: () => adminAPI.getAcademicDocument(documentId),
  });
  const document = documentQuery.data?.data;

  return (
    <AcademicModal
      description="Read-only catalog view. Publishing and moderation actions remain in Document Review."
      onClose={onClose}
      title={document?.title ?? "Academic document"}
      widthClass="max-w-[920px]"
    >
      {documentQuery.isPending ? (
        <AcademicLoading label="Loading document detail..." />
      ) : documentQuery.isError ? (
        <div className="space-y-3">
          <AcademicInlineError error={documentQuery.error} />
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-[#cabeff] bg-[#f6f2ff] px-4 py-2.5 text-sm font-extrabold text-[#614db7] transition hover:bg-[#e6deff] disabled:opacity-50"
            disabled={documentQuery.isFetching}
            onClick={() => void documentQuery.refetch()}
            type="button"
          >
            {documentQuery.isFetching ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : null}
            Retry loading detail
          </button>
        </div>
      ) : document ? (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[24px] bg-[#f6f2ff] p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#614db7]">
                <FileText aria-hidden="true" className="h-5 w-5" />
              </span>
              <AcademicStatusBadge status={document.status} />
            </div>
            <p className="mt-4 break-all text-sm font-extrabold text-[#1b1c19]">
              {document.fileName}
            </p>
            <p className="mt-1 text-xs font-bold uppercase text-[#8a8784]">
              {document.fileType} · {formatAcademicDocumentBytes(document.fileSize)}
            </p>
            <a
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b1c19] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#343530]"
              href={document.fileUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              Open source file
            </a>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#6e6a67]">
              <Eye aria-hidden="true" className="h-4 w-4" />
              {document.downloadCount ?? 0} downloads
            </div>
          </aside>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-[#614db7]">
                Description
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#5f5e5e]">
                {document.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyMeta
                label="Department"
                value={getAcademicDocumentDepartmentLabel(document)}
              />
              <ReadOnlyMeta
                label="Subject"
                value={getAcademicDocumentSubjectLabel(document)}
              />
              <ReadOnlyMeta
                label="Uploader"
                value={getAcademicDocumentUploaderLabel(document)}
              />
              <ReadOnlyMeta
                label="Uploaded"
                value={formatAcademicDocumentDate(document.createdAt)}
              />
              {document.reviewer || document.reviewedBy ? (
                <ReadOnlyMeta
                  label="Reviewer"
                  value={getAcademicDocumentReviewerLabel(document)}
                />
              ) : null}
              {document.reviewedAt ? (
                <ReadOnlyMeta
                  label="Reviewed"
                  value={formatAcademicDocumentDate(document.reviewedAt)}
                />
              ) : null}
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-[#5f5e5e]">
                Tags
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {document.tags?.length ? (
                  document.tags.map((tag) => (
                    <span
                      className="rounded-lg bg-[#f3efff] px-2.5 py-1 text-xs font-extrabold text-[#614db7]"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-[#8a8784]">
                    No tags
                  </span>
                )}
              </div>
            </div>

            {document.reviewNote || document.note ? (
              <div className="rounded-2xl bg-[#fff7e8] p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.06em] text-[#76511a]">
                  Review note
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#76511a]">
                  {document.reviewNote || document.note}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <AcademicInlineError error={new Error("Document detail is unavailable.")} />
      )}
    </AcademicModal>
  );
}

function ReadOnlyMeta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-black/5 bg-[#fbf9f4] p-3.5">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.05em] text-[#8a8784]">
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-bold text-[#45433f]">
        {value || "—"}
      </div>
    </div>
  );
}
