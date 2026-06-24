import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminAPI } from "@/services/api";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function StudySessionDetailModal({
  sessionId,
  onClose,
}: {
  sessionId: string;
  onClose: () => void;
}) {
  const sessionQuery = useQuery({
    queryKey: ["admin", "study-sessions", sessionId],
    queryFn: () => adminAPI.getStudySession(sessionId),
    retry: false,
  });

  const [reviewPage, setReviewPage] = useState(1);
  const reviewsQuery = useQuery({
    queryKey: ["admin", "study-sessions", sessionId, "reviews", { page: reviewPage }],
    queryFn: () => adminAPI.getStudySessionReviews(sessionId, { page: reviewPage, take: 20 }),
    retry: false,
  });

  const session = sessionQuery.data?.data;
  const reviews = reviewsQuery.data?.data ?? [];
  const meta = reviewsQuery.data?.meta;

  const isLoading = sessionQuery.isPending || reviewsQuery.isPending;
  const isError = sessionQuery.isError || reviewsQuery.isError;
  const errorMsg =
    (sessionQuery.error as Error)?.message || (reviewsQuery.error as Error)?.message;

  function formatDuration(start: string, end: string | null) {
    if (!end) return "In Progress";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const secs = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/45 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="flex max-h-[92vh] w-full max-w-[960px] flex-col overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
              Study Session Detail
            </p>
            <h3 className="mt-2 [font-family:var(--font-outfit)] text-3xl font-extrabold text-[#1b1c19]">
              {session?.user?.name ?? "Loading..."}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#5f5e5e]">
              Session ID: {sessionId}
            </p>
          </div>
          <button
            aria-label="Close detail"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6f3ee] text-[#5f5e5e] transition hover:text-[#1b1c19]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {isError ? (
            <div className="mb-5 flex items-center gap-2 rounded-2xl bg-[#fff0f0] px-4 py-3 text-sm font-extrabold text-[#a33a3a]">
              <AlertTriangle aria-hidden="true" className="h-4 w-4" />
              {errorMsg || "Unable to load session detail."}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="space-y-3">
              {isLoading && !session ? (
                <div className="flex h-20 items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Loading session
                </div>
              ) : null}
              {session ? (
                <>
                  <DetailRow label="Learner Email" value={session.user?.email || "N/A"} />
                  <DetailRow label="Deck" value={session.deck?.title || "N/A"} />
                  <DetailRow label="Mode" value={session.mode} />
                  <DetailRow
                    label="Duration"
                    value={formatDuration(session.startedAt, session.finishedAt)}
                  />
                  <DetailRow
                    label="Started At"
                    value={dateFormatter.format(new Date(session.startedAt))}
                  />
                  <DetailRow
                    label="Correct Rate"
                    value={`${session.correctReviewCount ?? 0} / ${
                      session.reviewCount ?? 0
                    } reviews`}
                  />
                </>
              ) : null}
            </div>

            <div className="flex flex-col overflow-hidden rounded-[24px] border border-black/5 bg-[#fbf9f4]">
              <div className="border-b border-black/5 bg-[#f6f2ff] px-5 py-3">
                <h4 className="text-sm font-extrabold text-[#614db7]">Review History</h4>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {reviewsQuery.isPending && !reviews.length ? (
                  <div className="flex h-32 items-center justify-center gap-2 text-sm font-bold text-[#614db7]">
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Loading reviews...
                  </div>
                ) : null}

                {!reviewsQuery.isPending && !reviews.length ? (
                  <div className="flex h-32 items-center justify-center text-sm font-bold text-[#5f5e5e]">
                    No reviews recorded in this session.
                  </div>
                ) : null}

                <div className="grid gap-3">
                  {reviews.map((review) => (
                    <div
                      className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                      key={review._id || review.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1b1c19]">
                            {review.card?.front || "Unknown question"}
                          </p>
                          <p className="mt-1 truncate text-xs text-[#5f5e5e]">
                            {review.card?.back || "Unknown answer"}
                          </p>
                          {review.answer && (
                            <p className="mt-2 text-xs italic text-[#a33a3a]">
                              User answered: {review.answer}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                              review.isCorrect
                                ? "bg-[#d7f2e3] text-[#276345]"
                                : "bg-[#fff0f0] text-[#a33a3a]"
                            }`}
                          >
                            {review.isCorrect ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {review.isCorrect ? "Correct" : "Incorrect"}
                          </span>
                          <span className="text-[10px] font-semibold text-[#8a8784]">
                            {review.responseTimeMs}ms
                          </span>
                          {review.rating && (
                            <span className="text-[10px] font-bold text-[#614db7]">
                              {review.rating.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {meta && meta.pageCount > 1 ? (
                <div className="flex items-center justify-between border-t border-black/5 p-4">
                  <span className="text-xs font-semibold text-[#5f5e5e]">
                    Page {meta.page} of {meta.pageCount}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={!meta.hasPreviousPage || reviewsQuery.isFetching}
                      onClick={() => setReviewPage((p) => p - 1)}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5f5e5e] shadow-sm transition hover:text-[#311485] disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      disabled={!meta.hasNextPage || reviewsQuery.isFetching}
                      onClick={() => setReviewPage((p) => p + 1)}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5f5e5e] shadow-sm transition hover:text-[#311485] disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[#fbf9f4] px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-normal text-[#797583]">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-extrabold text-[#1b1c19]">
        {value}
      </p>
    </div>
  );
}
