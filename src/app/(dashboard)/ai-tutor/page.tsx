import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  FileText,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

export default function AITutorPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]"><Sparkles className="h-4 w-4" />AI study tools</p>
          <h1 className="[font-family:var(--font-outfit)] text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">AI Tutor</h1>
          <p className="mt-2 max-w-[680px] text-sm leading-6 text-[#6e6b68] sm:text-base">A calm place to ask questions about your material. The conversation UI is ready for the backend chat capability.</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_16px_44px_rgba(27,28,25,0.06)]">
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4 sm:px-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]"><BrainCircuit className="h-6 w-6" /></span>
              <div><h2 className="[font-family:var(--font-outfit)] text-lg font-extrabold">Quizzy study assistant</h2><p className="text-xs font-semibold text-[#9a9692]">Preview conversation</p></div>
            </div>
            <div className="space-y-6 bg-[#fbf9f4] p-5 sm:p-8">
              <div className="ml-auto max-w-[75%] rounded-[22px] rounded-br-md bg-[#614db7] px-5 py-4 text-sm leading-6 text-white">Can you explain spaced repetition in simple terms?</div>
              <div className="flex max-w-[88%] gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1b1c19] text-white"><BrainCircuit className="h-5 w-5" /></span>
                <div className="rounded-[22px] rounded-tl-md border border-black/5 bg-white px-5 py-4 text-sm leading-6 text-[#5f5e5e] shadow-sm">Spaced repetition brings a card back just before you are likely to forget it. Easy cards wait longer; difficult cards return sooner, so your study time stays focused.</div>
              </div>
              <div className="rounded-[22px] border border-dashed border-[#cabeff] bg-white p-4">
                <div className="flex items-center gap-3 text-[#777474]"><MessageSquareText className="h-5 w-5" /><span className="text-sm font-semibold">Ask a follow-up question...</span></div>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[26px] bg-[#311485] p-6 text-white shadow-[0_16px_40px_rgba(49,20,133,0.18)]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f5d547]"><Sparkles className="h-6 w-6" /></span>
              <h2 className="mt-5 [font-family:var(--font-outfit)] text-2xl font-extrabold">Chat integration is next</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">The current backend supports AI source and job models, but it does not expose a tutor chat endpoint yet.</p>
            </section>
            <section className="rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)]">
              <h2 className="[font-family:var(--font-outfit)] text-lg font-extrabold">What works today</h2>
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffd9e4] text-[#7b3451]"><BookOpenText className="h-5 w-5" /></span><div><p className="text-sm font-bold">Manual flashcards</p><p className="text-xs text-[#9a9692]">Create cards inside your decks</p></div></div>
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d7f2e3] text-[#276345]"><FileText className="h-5 w-5" /></span><div><p className="text-sm font-bold">Organized library</p><p className="text-xs text-[#9a9692]">Keep your materials together</p></div></div>
              </div>
              <Link className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#614db7]" href="/flashcards">Create cards now <ArrowRight className="h-4 w-4" /></Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
