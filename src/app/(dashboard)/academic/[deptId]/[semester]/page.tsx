"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Plus,
  Search,
  Wand2,
} from "lucide-react";
import { UploadDocumentModal } from "@/features/academic/components/UploadDocumentModal";
import {
  fileTypeOptions,
  formatAcademicDate,
  formatFileSize,
  getDocumentTypeLabel,
  getFileTypeClass,
  resolveDepartment,
} from "@/features/academic/utils";
import { cn } from "@/lib/utils";
import {
  academicApi,
  chatbotAPI,
  type GenerateJobStatus,
} from "@/services/api";
import type {
  AcademicDocument,
  FileType,
  QueryDocumentsParams,
  Subject,
} from "@/types/academic.type";

const statusLabels: Record<GenerateJobStatus, string> = {
  queued: "Queued",
  running: "Generating",
  done: "Deck ready",
  failed: "Failed",
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function AcademicSemesterPage() {
  const router = useRouter();
  const { deptId, semester } = useParams<{
    deptId: string;
    semester: string;
  }>();
  const queryClient = useQueryClient();
  const semesterNumber = Number(semester);
  const isValidSemester =
    Number.isInteger(semesterNumber) &&
    semesterNumber >= 1 &&
    semesterNumber <= 9;
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );
  const [keyword, setKeyword] = useState("");
  const [fileType, setFileType] = useState<FileType | "all">("all");
  const [page, setPage] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeGenerateJobId, setActiveGenerateJobId] = useState<string>();
  const [activeGenerateDocumentId, setActiveGenerateDocumentId] =
    useState<string>();
  const [generateError, setGenerateError] = useState("");

  const departmentsQuery = useQuery({
    queryKey: ["academic", "departments"],
    queryFn: () => academicApi.getDepartments(),
  });
  const departments = departmentsQuery.data?.data ?? [];
  const department = resolveDepartment(departments, deptId);

  const subjectsQuery = useQuery({
    queryKey: ["academic", "subjects", department?._id, semesterNumber],
    queryFn: () =>
      academicApi.getSubjectsByDepartment(department!._id, semesterNumber),
    enabled: Boolean(department?._id && isValidSemester),
  });

  const subjects = useMemo(
    () => subjectsQuery.data?.data ?? [],
    [subjectsQuery.data?.data],
  );
  const resolvedSubjectId = subjects.some(
    (subject) => subject._id === selectedSubjectId,
  )
    ? selectedSubjectId
    : (subjects[0]?._id ?? null);
  const selectedSubject = subjects.find(
    (subject) => subject._id === resolvedSubjectId,
  );

  const documentParams = useMemo<QueryDocumentsParams>(
    () => ({
      page,
      limit: 10,
      keyword: keyword.trim() || undefined,
      fileType: fileType === "all" ? undefined : fileType,
      status: "active",
    }),
    [fileType, keyword, page],
  );

  const documentsQuery = useQuery({
    queryKey: ["academic", "documents", resolvedSubjectId, documentParams],
    queryFn: () =>
      academicApi.getSubjectDocuments(resolvedSubjectId!, documentParams),
    enabled: Boolean(resolvedSubjectId),
  });

  const generateJobQuery = useQuery({
    queryKey: ["chatbot", "generate-job", activeGenerateJobId],
    queryFn: () => chatbotAPI.getGenerateJob(activeGenerateJobId!),
    enabled: Boolean(activeGenerateJobId),
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status === "queued" || status === "running" ? 2000 : false;
    },
  });

  const currentGenerateJob = generateJobQuery.data?.data;

  useEffect(() => {
    if (currentGenerateJob?.status === "done" && currentGenerateJob.targetDeckId) {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      router.push(`/decks/${currentGenerateJob.targetDeckId}`);
    }
  }, [currentGenerateJob, queryClient, router]);

  const generateAcademicMutation = useMutation({
    mutationFn: (document: AcademicDocument) =>
      chatbotAPI.generateFromAcademicDocument({
        documentId: document._id,
        title: document.title,
        cardCount: 10,
        difficulty: "medium",
        language: "vi",
      }),
    onMutate: (document) => {
      setActiveGenerateDocumentId(document._id);
      setActiveGenerateJobId(undefined);
      setGenerateError("");
    },
    onSuccess: (response) => {
      setActiveGenerateJobId(response.data.jobId);
    },
    onError: (error) => {
      setGenerateError(
        getErrorMessage(error, "Could not start flashcard generation."),
      );
    },
  });

  async function handleDownload(document: AcademicDocument) {
    try {
      await academicApi.incrementDownloadCount(document._id);
      queryClient.invalidateQueries({
        queryKey: ["academic", "documents", document.subjectId],
      });
    } catch (error) {
      console.error("Failed to increment download count", error);
    } finally {
      window.open(document.fileUrl, "_blank", "noopener,noreferrer");
    }
  }

  function handleGenerateFlashcards(document: AcademicDocument) {
    if (document.fileType !== "pdf") {
      setActiveGenerateDocumentId(document._id);
      setGenerateError("Only PDF academic documents are supported right now.");
      return;
    }

    generateAcademicMutation.mutate(document);
  }

  function handleAskAi(document: AcademicDocument) {
    if (document.fileType !== "pdf") {
      setActiveGenerateDocumentId(document._id);
      setGenerateError("Only PDF academic documents are supported right now.");
      return;
    }

    const params = new URLSearchParams({
      academicDocumentId: document._id,
      documentTitle: document.title,
    });

    router.push(`/ai-tutor?${params.toString()}`);
  }

  if (departmentsQuery.isLoading) return <PageLoading />;

  if (departmentsQuery.isError) {
    return <PageError message={departmentsQuery.error.message} />;
  }

  if (!department) {
    return <PageError message="Department not found." />;
  }

  if (!isValidSemester) {
    return <PageError message="Semester must be between 1 and 9." />;
  }

  const documents = documentsQuery.data?.data ?? [];
  const meta = documentsQuery.data?.meta;

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]"
          href={`/academic/${department.code}`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to semesters
        </Link>

        <header className="mt-6 flex flex-col gap-5 rounded-[30px] bg-[#1b1c19] p-6 text-white shadow-[0_20px_60px_rgba(27,28,25,0.14)] sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#cabeff]">
              {department.code} semester {semesterNumber}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
              Subject document portal
            </h1>
            <p className="mt-3 max-w-[720px] text-sm leading-6 text-white/70">
              Pick a subject, search shared academic files, and upload new
              resources for classmates.
            </p>
          </div>
          <button
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f5d547] px-5 py-3 text-sm font-extrabold text-[#493600] transition hover:-translate-y-0.5 hover:bg-[#ffe36a] disabled:translate-y-0 disabled:opacity-50"
            disabled={!selectedSubject}
            onClick={() => setIsUploadOpen(true)}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Upload document
          </button>
        </header>

        <div className="mt-8 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-black/5 bg-white p-4 shadow-[0_12px_36px_rgba(27,28,25,0.05)] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-normal">Subjects</h2>
                <p className="mt-1 text-sm text-[#777474]">
                  {subjects.length} in this semester
                </p>
              </div>
              {subjectsQuery.isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-[#614db7]" />
              )}
            </div>

            {subjectsQuery.isError ? (
              <div className="rounded-2xl bg-[#fff0f0] p-4 text-sm font-bold text-[#a33a3a]">
                {subjectsQuery.error.message}
              </div>
            ) : subjects.length ? (
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <SubjectButton
                    isActive={subject._id === resolvedSubjectId}
                    key={subject._id}
                    onClick={() => {
                      setSelectedSubjectId(subject._id);
                      setPage(1);
                    }}
                    subject={subject}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#d8d1ca] bg-[#fbf9f4] p-6 text-center">
                <FileText className="mx-auto h-8 w-8 text-[#9a9692]" />
                <h3 className="mt-3 font-bold">No subjects found</h3>
                <p className="mt-2 text-sm text-[#777474]">
                  Subjects for semester {semesterNumber} will appear here.
                </p>
              </div>
            )}
          </aside>

          <section className="min-w-0 rounded-[28px] border border-black/5 bg-white p-4 shadow-[0_12px_36px_rgba(27,28,25,0.05)] sm:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
                  {selectedSubject?.code ?? "Select subject"}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-normal">
                  {selectedSubject?.name ?? "Document library"}
                </h2>
                <p className="mt-2 text-sm text-[#777474]">
                  {selectedSubject
                    ? `${selectedSubject.documentCount} documents indexed by backend`
                    : "Choose a subject to browse documents."}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-[580px]">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a9692]" />
                  <input
                    className="h-12 w-full rounded-2xl bg-[#f6f3ee] pl-12 pr-4 text-sm font-semibold outline-none transition focus:ring-4 focus:ring-[#9b87f5]/10"
                    onChange={(event) => {
                      setKeyword(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search documents"
                    type="search"
                    value={keyword}
                  />
                </div>
                <select
                  className="h-12 rounded-2xl bg-[#f6f3ee] px-4 text-sm font-bold outline-none transition focus:ring-4 focus:ring-[#9b87f5]/10"
                  onChange={(event) => {
                    setFileType(event.target.value as FileType | "all");
                    setPage(1);
                  }}
                  value={fileType}
                >
                  {fileTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DocumentTable
              documents={documents}
              error={documentsQuery.error?.message}
              isError={documentsQuery.isError}
              isLoading={documentsQuery.isLoading || subjectsQuery.isLoading}
              onAskAi={handleAskAi}
              onDownload={handleDownload}
              onGenerate={handleGenerateFlashcards}
              generation={{
                documentId: activeGenerateDocumentId,
                error:
                  generateError ||
                  (generateJobQuery.error
                    ? getErrorMessage(
                        generateJobQuery.error,
                        "Could not check generation status.",
                      )
                    : ""),
                isStarting: generateAcademicMutation.isPending,
                status: currentGenerateJob?.status,
              }}
              selectedSubject={selectedSubject}
            />

            {meta && meta.pageCount > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  className="rounded-full border border-black/10 p-3 disabled:opacity-40"
                  disabled={!meta.hasPreviousPage}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold text-[#777474]">
                  Page {meta.page} of {meta.pageCount}
                </span>
                <button
                  className="rounded-full border border-black/10 p-3 disabled:opacity-40"
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((value) => value + 1)}
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {isUploadOpen && selectedSubject && (
        <UploadDocumentModal
          deptCode={department.code}
          onClose={() => setIsUploadOpen(false)}
          semester={semesterNumber}
          subject={selectedSubject}
        />
      )}
    </div>
  );
}

function SubjectButton({
  isActive,
  onClick,
  subject,
}: {
  isActive: boolean;
  onClick: () => void;
  subject: Subject;
}) {
  return (
    <button
      className={cn(
        "w-full rounded-[22px] border p-4 text-left transition",
        isActive
          ? "border-[#cabeff] bg-[#f6f2ff] shadow-[0_10px_28px_rgba(49,20,133,0.08)]"
          : "border-black/5 bg-[#fbf9f4] hover:border-[#ded8d1] hover:bg-white",
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#614db7]">
            {subject.code}
          </p>
          <h3 className="mt-1 font-bold leading-tight text-[#1b1c19]">
            {subject.name}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#777474]">
          {subject.documentCount}
        </span>
      </div>
    </button>
  );
}

function DocumentTable({
  documents,
  error,
  generation,
  isError,
  isLoading,
  onAskAi,
  onDownload,
  onGenerate,
  selectedSubject,
}: {
  documents: AcademicDocument[];
  error?: string;
  generation: {
    documentId?: string;
    error?: string;
    isStarting: boolean;
    status?: GenerateJobStatus;
  };
  isError: boolean;
  isLoading: boolean;
  onAskAi: (document: AcademicDocument) => void;
  onDownload: (document: AcademicDocument) => void;
  onGenerate: (document: AcademicDocument) => void;
  selectedSubject?: Subject;
}) {
  if (!selectedSubject) {
    return (
      <div className="mt-6 rounded-[24px] border border-dashed border-[#d8d1ca] bg-[#fbf9f4] px-6 py-14 text-center">
        <FileText className="mx-auto h-10 w-10 text-[#9a9692]" />
        <h3 className="mt-4 text-xl font-bold">Select a subject</h3>
        <p className="mt-2 text-sm text-[#777474]">
          Documents will load after a subject is selected.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-6 space-y-3">
        {[0, 1, 2].map((item) => (
          <div
            className="h-20 animate-pulse rounded-[22px] bg-[#f6f3ee]"
            key={item}
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 rounded-[24px] bg-[#fff0f0] p-6 text-sm font-bold text-[#a33a3a]">
        {error ?? "Failed to load documents."}
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="mt-6 rounded-[24px] border border-dashed border-[#bbaef0] bg-[#f6f2ff] px-6 py-14 text-center">
        <FileText className="mx-auto h-10 w-10 text-[#614db7]" />
        <h3 className="mt-4 text-xl font-bold">No documents found</h3>
        <p className="mt-2 text-sm text-[#777474]">
          Adjust the filters or upload the first file for this subject.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[1040px] border-separate border-spacing-y-3 text-left">
        <thead>
          <tr className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#9a9692]">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Uploaded</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Downloads</th>
            <th className="px-4 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => {
            const isActiveGeneration =
              generation.documentId === document._id;
            const isGenerating =
              isActiveGeneration &&
              (generation.isStarting ||
                generation.status === "queued" ||
                generation.status === "running");
            const hasActiveGeneration =
              generation.isStarting ||
              generation.status === "queued" ||
              generation.status === "running";
            const isUnsupported = document.fileType !== "pdf";
            const generationError =
              isActiveGeneration &&
              (generation.status === "failed" || generation.error)
                ? generation.error || "Generation failed."
                : "";

            return (
              <tr className="bg-[#fbf9f4]" key={document._id}>
                <td className="rounded-l-[20px] px-4 py-4">
                  <p className="font-bold text-[#1b1c19]">{document.title}</p>
                  <p className="mt-1 max-w-[340px] truncate text-xs font-semibold text-[#777474]">
                    {document.fileName}
                  </p>
                  {generationError && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#a33a3a]">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {generationError}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-extrabold",
                      getFileTypeClass(document.fileType),
                    )}
                  >
                    {getDocumentTypeLabel(document)}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-[#5f5e5e]">
                  {formatAcademicDate(document.createdAt)}
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-[#5f5e5e]">
                  {formatFileSize(document.fileSize)}
                </td>
                <td className="px-4 py-4 text-sm font-bold text-[#5f5e5e]">
                  {document.downloadCount}
                </td>
                <td className="rounded-r-[20px] px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-[#1b1c19] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#30312e]"
                      onClick={() => onDownload(document)}
                      type="button"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-full border border-[#cabeff] bg-white px-4 py-2 text-sm font-bold text-[#311485] transition hover:-translate-y-0.5 hover:bg-[#f4f0ff] disabled:translate-y-0 disabled:border-transparent disabled:bg-[#d8d1ca] disabled:text-[#777474]"
                      disabled={isUnsupported}
                      onClick={() => onAskAi(document)}
                      title={
                        isUnsupported
                          ? "Only PDF academic documents are supported right now"
                          : undefined
                      }
                      type="button"
                    >
                      <BrainCircuit className="h-4 w-4" />
                      {isUnsupported ? "PDF only" : "Ask AI"}
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-[#614db7] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#49339d] disabled:translate-y-0 disabled:bg-[#d8d1ca] disabled:text-[#777474]"
                      disabled={
                        isUnsupported ||
                        isGenerating ||
                        (hasActiveGeneration && !isActiveGeneration)
                      }
                      onClick={() => onGenerate(document)}
                      title={
                        isUnsupported
                          ? "Only PDF academic documents are supported right now"
                          : undefined
                      }
                      type="button"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      {isGenerating
                        ? statusLabels[generation.status ?? "queued"]
                        : isUnsupported
                          ? "PDF only"
                          : generationError
                            ? "Retry"
                            : "Generate"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-[#614db7]" />
    </div>
  );
}

function PageError({ message }: { message: string }) {
  return (
    <div className="p-8">
      <div className="rounded-[24px] bg-[#fff0f0] p-6 font-bold text-[#a33a3a]">
        {message}
      </div>
    </div>
  );
}
