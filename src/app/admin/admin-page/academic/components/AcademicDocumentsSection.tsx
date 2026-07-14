"use client";

import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpenCheck,
  Eye,
  FileSearch,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import {
  adminAPI,
  type AdminAcademicDepartment,
  type AdminAcademicDocumentStatus,
  type AdminAcademicSubject,
} from "@/services/api";
import {
  formatAcademicDocumentBytes,
  formatAcademicDocumentDate,
  getAcademicDocumentId,
  getAcademicDocumentSubjectLabel,
  getAcademicDocumentUploaderLabel,
} from "../academic-document.utils";
import { academicInputClass, getAcademicEntityId } from "../academic.config";
import {
  AcademicInlineError,
  AcademicLoading,
  AcademicPagination,
  AcademicStatusBadge,
} from "./AdminAcademicUi";
import { AcademicDocumentDetailModal } from "./AcademicDocumentDetailModal";

type BrowseDocumentStatus = AdminAcademicDocumentStatus | "all";

export function AcademicDocumentsSection({
  department,
  onClearSubject,
  subject,
}: {
  department: AdminAcademicDepartment;
  onClearSubject: () => void;
  subject: AdminAcademicSubject | null;
}) {
  const [keywordDraft, setKeywordDraft] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<BrowseDocumentStatus>("all");
  const [page, setPage] = useState(1);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const departmentId = getAcademicEntityId(department);
  const subjectId = getAcademicEntityId(subject);

  const documentsQuery = useQuery({
    queryKey: [
      "admin",
      "academic",
      "documents",
      "browse",
      departmentId,
      subjectId,
      keyword,
      status,
      page,
    ],
    queryFn: () =>
      adminAPI.getAcademicDocuments({
        departmentId,
        keyword: keyword || undefined,
        page,
        status,
        subjectId: subjectId || undefined,
        take: 10,
      }),
    enabled: Boolean(departmentId),
  });

  const documents = documentsQuery.data?.data ?? [];
  const meta = documentsQuery.data?.meta;

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setKeyword(keywordDraft.trim());
    setPage(1);
  }

  return (
    <section
      aria-busy={documentsQuery.isFetching}
      className="scroll-mt-6 rounded-[30px] border border-black/5 bg-white p-5 shadow-sm sm:p-7"
      id="academic-documents"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#614db7]">
            <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
            Academic documents
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-[#1b1c19]">
            {subject
              ? `${subject.code} — ${subject.name}`
              : `All documents in ${department.code}`}
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#6e6a67]">
            {subject
              ? "Browsing documents assigned to this subject only."
              : "Browse documents across every subject in this department."}
          </p>
        </div>
        {subject ? (
          <button
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#cabeff] bg-[#f6f2ff] px-4 py-2.5 text-sm font-extrabold text-[#614db7] transition hover:bg-[#e6deff]"
            onClick={onClearSubject}
            type="button"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All {department.code} documents
          </button>
        ) : null}
      </div>

      <form
        className="mt-6 grid gap-3 md:grid-cols-[1fr_190px_auto]"
        onSubmit={submitSearch}
      >
        <label className="relative block">
          <span className="sr-only">Search academic documents</span>
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8784]"
          />
          <input
            className={`${academicInputClass} pl-11`}
            onChange={(event) => setKeywordDraft(event.target.value)}
            placeholder="Search title, file name or tag"
            value={keywordDraft}
          />
        </label>
        <select
          aria-label="Filter academic documents by status"
          className={academicInputClass}
          onChange={(event) => {
            setStatus(event.target.value as BrowseDocumentStatus);
            setPage(1);
          }}
          value={status}
        >
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived</option>
        </select>
        <button
          className="h-12 rounded-2xl bg-[#1b1c19] px-5 text-sm font-extrabold text-white transition hover:bg-[#343530]"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="mt-5">
        {documentsQuery.isPending ? (
          <AcademicLoading label="Loading academic documents..." />
        ) : documentsQuery.isError ? (
          <div className="space-y-3">
            <AcademicInlineError error={documentsQuery.error} />
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-[#cabeff] bg-[#f6f2ff] px-4 py-2.5 text-sm font-extrabold text-[#614db7] transition hover:bg-[#e6deff] disabled:opacity-50"
              disabled={documentsQuery.isFetching}
              onClick={() => void documentsQuery.refetch()}
              type="button"
            >
              {documentsQuery.isFetching ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : null}
              Retry loading documents
            </button>
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-8 text-center">
            <FileSearch
              aria-hidden="true"
              className="mx-auto h-8 w-8 text-[#614db7]"
            />
            <p className="mt-3 text-sm font-extrabold text-[#311485]">
              {subject
                ? `No documents found for ${subject.code}.`
                : `No documents found in ${department.code}.`}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#6e6a67]">
              Try another status or search term.
            </p>
          </div>
        ) : (
          <div
            className={`space-y-3 transition-opacity ${
              documentsQuery.isFetching ? "opacity-65" : ""
            }`}
          >
            {documentsQuery.isFetching ? (
              <div className="flex items-center gap-2 text-xs font-bold text-[#614db7]">
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Refreshing documents...
              </div>
            ) : null}
            {documents.map((document) => (
              <article
                className="rounded-[22px] border border-black/5 bg-[#fbf9f4] p-4 transition hover:border-[#cabeff] hover:bg-white"
                key={getAcademicDocumentId(document) || document.fileName}
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
                    <FileText aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-base font-extrabold text-[#1b1c19]">
                        {document.title}
                      </h4>
                      <AcademicStatusBadge status={document.status} />
                    </div>
                    <p className="mt-1 truncate text-xs font-semibold text-[#8a8784]">
                      {document.fileName} · {document.fileType.toUpperCase()} ·{" "}
                      {formatAcademicDocumentBytes(document.fileSize)}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 xl:w-[510px]">
                    <BrowseMeta
                      label="Subject"
                      value={getAcademicDocumentSubjectLabel(document)}
                    />
                    <BrowseMeta
                      label="Uploader"
                      value={getAcademicDocumentUploaderLabel(document)}
                    />
                    <BrowseMeta
                      label="Uploaded"
                      value={formatAcademicDocumentDate(document.createdAt)}
                    />
                  </div>
                  <button
                    aria-label={`View details for ${document.title || document.fileName}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#614db7] px-4 text-sm font-extrabold text-white transition hover:bg-[#4f3d99]"
                    onClick={() =>
                      setSelectedDocumentId(getAcademicDocumentId(document))
                    }
                    type="button"
                  >
                    <Eye aria-hidden="true" className="h-4 w-4" />
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {meta ? (
        <AcademicPagination
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          isFetching={documentsQuery.isFetching}
          itemCount={meta.itemCount}
          onPageChange={setPage}
          page={meta.page}
          pageCount={meta.pageCount}
        />
      ) : null}

      {selectedDocumentId ? (
        <AcademicDocumentDetailModal
          documentId={selectedDocumentId}
          onClose={() => setSelectedDocumentId("")}
        />
      ) : null}
    </section>
  );
}

function BrowseMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-white px-3 py-2">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.05em] text-[#8a8784]">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-bold text-[#45433f]" title={value}>
        {value || "—"}
      </p>
    </div>
  );
}
