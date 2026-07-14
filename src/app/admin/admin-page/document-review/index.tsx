"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileCheck2 } from "lucide-react";
import {
  adminAPI,
  type AdminAcademicDocumentFileType,
} from "@/services/api";
import {
  AcademicInlineError,
  AcademicLoading,
  AcademicPagination,
} from "../academic/components/AdminAcademicUi";
import {
  getDocumentEntityId,
  resolveDocumentSubject,
  type DocumentFilterStatus,
} from "./document-review.config";
import { DocumentReviewFilters } from "./components/DocumentReviewFilters";
import { DocumentReviewHeader } from "./components/DocumentReviewHeader";
import { DocumentReviewModal } from "./components/DocumentReviewModal";
import { DocumentRow } from "./components/DocumentRow";

export function DocumentReviewPanel() {
  const [status, setStatus] = useState<DocumentFilterStatus>("pending");
  const [departmentId, setDepartmentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [fileType, setFileType] =
    useState<AdminAcademicDocumentFileType | "">("");
  const [keyword, setKeyword] = useState("");
  const [uploaderId, setUploaderId] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  const departmentsQuery = useQuery({
    queryKey: ["admin", "academic", "departments", "review-filter"],
    queryFn: () =>
      adminAPI.getAcademicDepartments({ status: "all", take: 100 }),
  });
  const subjectsQuery = useQuery({
    queryKey: ["admin", "academic", "subjects", "review-filter", departmentId],
    queryFn: () =>
      adminAPI.getAcademicSubjects({
        departmentId,
        status: "all",
        take: 100,
      }),
    enabled: Boolean(departmentId),
  });
  const documentsQuery = useQuery({
    queryKey: [
      "admin",
      "academic",
      "documents",
      status,
      departmentId,
      subjectId,
      fileType,
      keyword,
      uploaderId,
      page,
    ],
    queryFn: () =>
      adminAPI.getAcademicDocuments({
        departmentId: departmentId || undefined,
        fileType: fileType || undefined,
        keyword: keyword || undefined,
        page,
        status,
        subjectId: subjectId || undefined,
        take: 20,
        uploaderId: uploaderId || undefined,
      }),
  });

  const departments = departmentsQuery.data?.data ?? [];
  const subjects = subjectsQuery.data?.data ?? [];
  const documents = documentsQuery.data?.data ?? [];

  function resetPage() {
    setPage(1);
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-[30px] border border-black/5 bg-white p-5 shadow-sm sm:p-7">
        <DocumentReviewHeader status={status} />
        <DocumentReviewFilters
          departmentId={departmentId}
          departments={departments}
          fileType={fileType}
          onDepartmentChange={(nextDepartmentId) => {
            setDepartmentId(nextDepartmentId);
            setSubjectId("");
            resetPage();
          }}
          onFileTypeChange={(nextFileType) => {
            setFileType(nextFileType);
            resetPage();
          }}
          onSearch={(nextKeyword) => {
            setKeyword(nextKeyword);
            resetPage();
          }}
          onStatusChange={(nextStatus) => {
            setStatus(nextStatus);
            resetPage();
          }}
          onSubjectChange={(nextSubjectId) => {
            setSubjectId(nextSubjectId);
            resetPage();
          }}
          onUploaderChange={(nextUploaderId) => {
            setUploaderId(nextUploaderId);
            resetPage();
          }}
          status={status}
          subjectId={subjectId}
          subjects={subjects}
          uploaderId={uploaderId}
        />
        {departmentsQuery.isError ? (
          <div className="mt-3">
            <AcademicInlineError error={departmentsQuery.error} />
          </div>
        ) : subjectsQuery.isError ? (
          <div className="mt-3">
            <AcademicInlineError error={subjectsQuery.error} />
          </div>
        ) : null}
      </div>

      {documentsQuery.isPending ? (
        <AcademicLoading label="Loading documents..." />
      ) : documentsQuery.isError ? (
        <AcademicInlineError error={documentsQuery.error} />
      ) : documents.length === 0 ? (
        <DocumentQueueEmpty />
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <DocumentRow
              document={document}
              key={getDocumentEntityId(document) || document.fileName}
              onOpen={() =>
                setSelectedDocumentId(getDocumentEntityId(document))
              }
              subject={resolveDocumentSubject(document, subjects)}
            />
          ))}
          {documentsQuery.data?.meta ? (
            <AcademicPagination
              hasNextPage={documentsQuery.data.meta.hasNextPage}
              hasPreviousPage={documentsQuery.data.meta.hasPreviousPage}
              isFetching={documentsQuery.isFetching}
              itemCount={documentsQuery.data.meta.itemCount}
              onPageChange={setPage}
              page={documentsQuery.data.meta.page}
              pageCount={documentsQuery.data.meta.pageCount}
            />
          ) : null}
        </div>
      )}

      {selectedDocumentId ? (
        <DocumentReviewModal
          departments={departments}
          documentId={selectedDocumentId}
          onClose={() => setSelectedDocumentId("")}
        />
      ) : null}
    </section>
  );
}

function DocumentQueueEmpty() {
  return (
    <div className="rounded-[30px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-10 text-center">
      <FileCheck2
        aria-hidden="true"
        className="mx-auto h-9 w-9 text-[#614db7]"
      />
      <h3 className="mt-4 text-xl font-extrabold text-[#311485]">
        Queue is clear
      </h3>
      <p className="mt-2 text-sm font-semibold text-[#6e6a67]">
        No documents match the current filters.
      </p>
    </div>
  );
}
