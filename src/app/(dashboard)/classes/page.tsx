import { CalendarDays, Clock3, Plus, UsersRound } from "lucide-react";

const groups = [
  { title: "Biology study circle", members: 12, next: "Thursday, 7:00 PM", color: "bg-[#e6deff] text-[#614db7]" },
  { title: "Academic English", members: 8, next: "Saturday, 9:30 AM", color: "bg-[#ffd9e4] text-[#7b3451]" },
  { title: "Data structures", members: 16, next: "Monday, 6:00 PM", color: "bg-[#d7f2e3] text-[#276345]" },
];

export default function ClassesPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]">Learn together</p>
            <h1 className="[font-family:var(--font-outfit)] text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">Study groups</h1>
            <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#6e6b68] sm:text-base">A future space for shared decks, group review sessions, and class collaboration.</p>
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1b1c19] px-5 py-3 text-sm font-bold text-white opacity-60" disabled type="button"><Plus className="h-4 w-4" />New group</button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <article className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)]" key={group.title}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${group.color}`}><UsersRound className="h-6 w-6" /></span>
              <h2 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold">{group.title}</h2>
              <div className="mt-5 space-y-3 text-sm font-semibold text-[#777474]">
                <p className="flex items-center gap-2"><UsersRound className="h-4 w-4" />{group.members} learners</p>
                <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Next session</p>
                <p className="flex items-center gap-2 text-[#1b1c19]"><Clock3 className="h-4 w-4 text-[#614db7]" />{group.next}</p>
              </div>
              <button className="mt-6 w-full rounded-full border border-black/10 px-4 py-3 text-sm font-bold text-[#777474]" disabled type="button">Coming soon</button>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[28px] border border-[#cabeff] bg-[#f2eefe] p-6 sm:p-8">
          <h2 className="[font-family:var(--font-outfit)] text-2xl font-extrabold text-[#311485]">Backend support is not available yet</h2>
          <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#5f4d94]">These cards are a visual preview only. A real study group feature will need class, membership, shared deck, and invitation APIs before the controls are enabled.</p>
        </section>
      </div>
    </div>
  );
}
