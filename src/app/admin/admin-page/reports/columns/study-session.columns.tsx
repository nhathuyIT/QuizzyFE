import { Eye } from "lucide-react";
import type { AdminStudySession } from "@/services/api";

export type StudySessionColumnContext = {
  onOpenSession: (session: AdminStudySession) => void;
};

type StudySessionColumn = {
  header: string;
  key: string;
  render: (session: AdminStudySession, context: StudySessionColumnContext) => React.ReactNode;
};

function formatDuration(start: string, end: string | null) {
  if (!end) return "In Progress";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const secs = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}



export const studySessionColumns: StudySessionColumn[] = [
  {
    header: "Learner",
    key: "learner",
    render: (session) => (
      <div className="flex flex-col">
        <span className="truncate font-extrabold">{session.user?.name || "Unknown"}</span>
        <span className="truncate text-xs text-[#5f5e5e]">{session.user?.email}</span>
      </div>
    ),
  },
  {
    header: "Deck",
    key: "deck",
    render: (session) => (
      <span className="truncate font-semibold text-[#311485]">{session.deck?.title || "Unknown Deck"}</span>
    ),
  },
  {
    header: "Mode",
    key: "mode",
    render: (session) => <ModeBadge mode={session.mode} />,
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
        className="inline-flex h-9 w-fit items-center gap-2 rounded-full bg-[#e6deff] px-3 text-xs font-extrabold text-[#311485] transition hover:bg-[#d8ccff] disabled:opacity-50"
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

function ModeBadge({ mode }: { mode: string }) {
  const getModeColor = () => {
    switch (mode) {
      case "flashcard":
        return "bg-[#e6deff] text-[#311485]";
      case "learn":
        return "bg-[#d8ccff] text-[#311485]";
      case "test":
        return "bg-[#cabeff] text-[#311485]";
      case "match":
        return "bg-[#bdadff] text-[#311485]";
      default:
        return "bg-[#f6f2ff] text-[#614db7]";
    }
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-extrabold capitalize ${getModeColor()}`}
    >
      {mode}
    </span>
  );
}
