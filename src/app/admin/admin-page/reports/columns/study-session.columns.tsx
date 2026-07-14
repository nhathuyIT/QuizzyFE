import { Eye } from "lucide-react";
import type { AdminStudySession } from "@/services/api";

export type StudySessionColumnContext = {
  onOpenSession: (session: AdminStudySession) => void;
};

type StudySessionColumn = {
  header: string;
  key: string;
  render: (
    session: AdminStudySession,
    context: StudySessionColumnContext,
  ) => React.ReactNode;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const studySessionColumns: StudySessionColumn[] = [
  {
    header: "Learner",
    key: "learner",
    render: (session) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-extrabold">
          {session.user?.name || "Unknown learner"}
        </span>
        <span className="truncate text-xs text-[#5f5e5e]">
          {session.user?.email || session.userId}
        </span>
      </div>
    ),
  },
  {
    header: "Deck",
    key: "deck",
    render: (session) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-semibold text-[#311485]">
          {session.deck?.title || "Unknown deck"}
        </span>
        {!session.deck?.title ? (
          <span className="truncate text-xs text-[#8a8784]">
            {session.deckId}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    header: "Mode",
    key: "mode",
    render: (session) => <ModeBadge mode={session.mode} />,
  },
  {
    header: "Status",
    key: "status",
    render: (session) => <StatusBadge isFinished={Boolean(session.finishedAt)} />,
  },
  {
    header: "Started",
    key: "startedAt",
    render: (session) => (
      <span className="text-xs font-semibold leading-5 text-[#5f5e5e]">
        {formatDate(session.startedAt)}
      </span>
    ),
  },
  {
    header: "Duration",
    key: "duration",
    render: (session) => (
      <span className="font-semibold text-[#1b1c19]">
        {formatDuration(session.startedAt, session.finishedAt)}
      </span>
    ),
  },
  {
    header: "Detail",
    key: "detail",
    render: (session, { onOpenSession }) => (
      <button
        className="inline-flex h-9 w-fit items-center gap-2 rounded-full bg-[#e6deff] px-3 text-xs font-extrabold text-[#311485] transition hover:bg-[#d8ccff] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!session.id && !session._id}
        onClick={() => onOpenSession(session)}
        type="button"
      >
        <Eye aria-hidden="true" className="h-3.5 w-3.5" />
        View
      </button>
    ),
  },
];

export function formatDuration(start: string, end?: string | null) {
  if (!end) return "In progress";

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return "—";

  const totalSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

export function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function ModeBadge({ mode }: { mode: string }) {
  const className =
    {
      flashcard: "bg-[#e6deff] text-[#311485]",
      learn: "bg-[#d8ccff] text-[#311485]",
      test: "bg-[#fcecd4] text-[#8a4a0a]",
      match: "bg-[#d4f0fc] text-[#1d5c7a]",
    }[mode] ?? "bg-[#f6f2ff] text-[#614db7]";

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-extrabold capitalize ${className}`}
    >
      {mode}
    </span>
  );
}

function StatusBadge({ isFinished }: { isFinished: boolean }) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-extrabold ${
        isFinished
          ? "bg-[#d7f2e3] text-[#276345]"
          : "bg-[#fcecd4] text-[#8a4a0a]"
      }`}
    >
      {isFinished ? "Finished" : "In progress"}
    </span>
  );
}
