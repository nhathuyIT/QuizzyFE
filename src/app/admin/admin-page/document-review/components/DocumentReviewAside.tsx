import { ExternalLink } from "lucide-react";
import type { AdminAcademicDocument } from "@/services/api";
import { AcademicStatusBadge } from "../../academic/components/AdminAcademicUi";
import {
  documentInputClass,
  formatDocumentBytes,
  formatDocumentDate,
} from "../document-review.config";
import { DocumentMetaCell } from "./DocumentMetaCell";
import { DocumentUploaderEmail } from "./DocumentUploaderEmail";

export function DocumentReviewAside({
  currentSubjectLabel,
  document,
  note,
  onNoteChange,
}: {
  currentSubjectLabel: string;
  document: AdminAcademicDocument;
  note: string;
  onNoteChange: (note: string) => void;
}) {
  return (
    <aside className="space-y-4">
      <div className="rounded-[24px] bg-[#f6f2ff] p-5">
        <div className="flex items-center justify-between gap-3">
          <AcademicStatusBadge status={document.status} />
          <span className="rounded-lg bg-white px-2 py-1 text-xs font-extrabold text-[#614db7]">
            {document.fileType.toUpperCase()}
          </span>
        </div>
        <p className="mt-4 break-all text-sm font-extrabold text-[#1b1c19]">
          {document.fileName}
        </p>
        <p className="mt-1 text-xs font-bold text-[#8a8784]">
          {formatDocumentBytes(document.fileSize)}
        </p>
        <a
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b1c19] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#343530]"
          href={document.fileUrl}
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          Open source file
        </a>
      </div>

      <div className="space-y-2 rounded-[24px] border border-black/5 bg-[#fbf9f4] p-4">
        <DocumentMetaCell
          label="Uploader"
          value={<DocumentUploaderEmail uploader={document.uploadedBy} />}
        />
        <DocumentMetaCell label="Subject" value={currentSubjectLabel} />
        <DocumentMetaCell
          label="Downloads"
          value={String(document.downloadCount ?? 0)}
        />
        <DocumentMetaCell
          label="Uploaded"
          value={formatDocumentDate(document.createdAt)}
        />
        {document.reviewNote || document.note ? (
          <DocumentMetaCell
            label="Review note"
            value={document.reviewNote || document.note || "—"}
          />
        ) : null}
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.06em] text-[#5f5e5e]">
          Review note (optional)
        </span>
        <textarea
          className={`${documentInputClass} min-h-24 resize-y py-3`}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Explain the review decision"
          value={note}
        />
      </label>
    </aside>
  );
}
