import { FileCheck2, ShieldCheck } from "lucide-react";
import type { DocumentFilterStatus } from "../document-review.config";

export function DocumentReviewHeader({
  status,
}: {
  status: DocumentFilterStatus;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#614db7]">
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          Moderation queue
        </div>
        <h2 className="mt-3 text-3xl font-extrabold text-[#1b1c19]">
          Document Review
        </h2>
        <p className="mt-2 max-w-[680px] text-sm font-semibold leading-6 text-[#6e6a67]">
          Inspect uploaded academic resources, correct their metadata, and
          decide what becomes available to learners.
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-[#fff7e8] px-4 py-3 text-[#76511a]">
        <FileCheck2 aria-hidden="true" className="h-5 w-5" />
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.06em]">
            Current queue
          </p>
          <p className="text-sm font-bold capitalize">{status}</p>
        </div>
      </div>
    </div>
  );
}
