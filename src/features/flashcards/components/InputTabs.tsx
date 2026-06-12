"use client";

import { FileText, Keyboard, UploadCloud } from "lucide-react";

export type CardInputMode = "manual" | "bulk" | "upload";

interface InputTabsProps {
  mode: CardInputMode;
  onModeChange: (mode: CardInputMode) => void;
  front: string;
  setFront: (value: string) => void;
  back: string;
  setBack: (value: string) => void;
  hint: string;
  setHint: (value: string) => void;
  explanation: string;
  setExplanation: (value: string) => void;
  examples: string;
  setExamples: (value: string) => void;
  bulkText: string;
  setBulkText: (value: string) => void;
}

export function InputTabs(props: InputTabsProps) {
  const tabs = [
    { id: "manual" as const, label: "Manual", icon: Keyboard },
    { id: "bulk" as const, label: "Bulk paste", icon: FileText },
    { id: "upload" as const, label: "Upload", icon: UploadCloud },
  ];

  return (
    <section className="rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)] sm:p-6">
      <div className="flex gap-2 overflow-x-auto border-b border-black/5 pb-4">
        {tabs.map((tab) => { const Icon = tab.icon; return <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ${props.mode === tab.id ? "bg-[#e6deff] text-[#311485]" : "text-[#777474] hover:bg-[#f6f3ee]"}`} key={tab.id} onClick={() => props.onModeChange(tab.id)} type="button"><Icon className="h-4 w-4" />{tab.label}</button>; })}
      </div>

      {props.mode === "manual" && (
        <div className="mt-6 space-y-5">
          <TextArea label="Front" note="Question or term" onChange={props.setFront} placeholder="What do you want to remember?" value={props.front} />
          <TextArea label="Back" note="Answer or definition" onChange={props.setBack} placeholder="Write a clear answer." value={props.back} />
          <div className="grid gap-5 md:grid-cols-2"><TextArea compact label="Hint" note="Optional" onChange={props.setHint} placeholder="A useful clue" value={props.hint} /><TextArea compact label="Explanation" note="Optional" onChange={props.setExplanation} placeholder="Why is this answer correct?" value={props.explanation} /></div>
          <label className="block text-sm font-extrabold">Examples <span className="font-medium text-[#9a9692]">one per line</span><textarea className="mt-2 min-h-28 w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-4 text-sm leading-6 outline-none focus:border-[#9b87f5]" onChange={(event) => props.setExamples(event.target.value)} placeholder="Example one&#10;Example two" value={props.examples} /></label>
        </div>
      )}

      {props.mode === "bulk" && (
        <div className="mt-6"><h2 className="[font-family:var(--font-outfit)] text-xl font-extrabold">Create many cards</h2><p className="mt-2 text-sm leading-6 text-[#777474]">Enter one card per line using <strong>front :: back</strong>.</p><textarea className="mt-5 min-h-[430px] w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 font-mono text-sm leading-7 outline-none focus:border-[#9b87f5]" onChange={(event) => props.setBulkText(event.target.value)} placeholder={"What is HTTP? :: Hypertext Transfer Protocol\nWhat is REST? :: Representational State Transfer"} value={props.bulkText} /></div>
      )}

      {props.mode === "upload" && (
        <div className="mt-6 flex min-h-[430px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#cabeff] bg-[#f8f5ff] p-8 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]"><UploadCloud className="h-8 w-8" /></span><h2 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold">Upload API is not exposed</h2><p className="mt-2 max-w-[460px] text-sm leading-6 text-[#777474]">The backend has AI source schemas but no upload controller endpoint, so this control remains disabled.</p></div>
      )}
    </section>
  );
}

function TextArea({ label, note, value, placeholder, onChange, compact = false }: { label: string; note: string; value: string; placeholder: string; onChange: (value: string) => void; compact?: boolean }) {
  return <label className="block text-sm font-extrabold">{label} <span className="font-medium text-[#9a9692]">{note}</span><textarea className={`mt-2 w-full resize-none rounded-[22px] border border-black/10 bg-[#fbf9f4] p-5 text-base font-medium leading-7 outline-none focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10 ${compact ? "min-h-28" : "min-h-40"}`} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} value={value} /></label>;
}
