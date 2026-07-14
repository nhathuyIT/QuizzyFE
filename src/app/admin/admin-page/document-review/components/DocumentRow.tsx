import { ExternalLink, FileText } from "lucide-react";
import type {
  AdminAcademicDocument,
  AdminAcademicSubject,
} from "@/services/api";
import { AcademicStatusBadge } from "../../academic/components/AdminAcademicUi";
import {
  formatDocumentBytes,
  getDocumentSubjectLabel,
  getDocumentUploader,
} from "../document-review.config";
import { DocumentMetaCell } from "./DocumentMetaCell";
import { DocumentUploaderEmail } from "./DocumentUploaderEmail";

export function DocumentRow({
  document,
  onOpen,
  subject,
}: {
  document: AdminAcademicDocument;
  onOpen: () => void;
  subject?: AdminAcademicSubject;
}) {
  return (
    <article className="rounded-[26px] border border-black/5 bg-white p-4 shadow-sm transition hover:border-[#cabeff] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3efff] text-[#614db7]">
          <FileText aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-extrabold text-[#1b1c19]">
              {document.title}
            </h3>
            <AcademicStatusBadge status={document.status} />
          </div>
          <p className="mt-1 truncate text-xs font-semibold text-[#8a8784]">
            {document.fileName}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 lg:w-[420px]">
          <DocumentMetaCell
            label="Subject"
            value={subject?.code ?? getDocumentSubjectLabel(document.subjectId)}
          />
          <DocumentMetaCell
            label="Uploader"
            value={
              <DocumentUploaderEmail
                uploader={getDocumentUploader(document) ?? document.uploadedBy}
              />
            }
          />
          <DocumentMetaCell
            label="File"
            value={`${document.fileType.toUpperCase()} · ${formatDocumentBytes(document.fileSize)}`}
          />
        </div>
        <button
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#614db7] px-4 text-sm font-extrabold text-white transition hover:bg-[#4f3d99]"
          onClick={onOpen}
          type="button"
        >
          Review
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
