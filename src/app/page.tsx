import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  CirclePlay,
  Clock3,
  FileText,
  Flame,
  GraduationCap,
  Layers3,
  LineChart,
  MessageCircleQuestion,
  PenLine,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UploadCloud,
  WandSparkles,
  Zap,
} from "lucide-react";
import { GlobalHeader } from "@/components/navigation/GlobalHeader";

type Feature = {
  description: string;
  icon: LucideIcon;
  title: string;
};

const heroStats = [
  { label: "Decks generated", value: "42k+" },
  { label: "Practice questions", value: "1.8m" },
  { label: "Avg. setup time", value: "3 min" },
];

const steps: Feature[] = [
  {
    icon: UploadCloud,
    title: "Bring the material",
    description:
      "Drop in notes, a document, or a rough topic list. Quizzy keeps the useful ideas and clears away the noise.",
  },
  {
    icon: WandSparkles,
    title: "Shape a study deck",
    description:
      "AI turns the source into flashcards, quiz prompts, and a first review path you can adjust before studying.",
  },
  {
    icon: Target,
    title: "Practice with focus",
    description:
      "Short sessions, progress signals, and weak-spot review help you keep moving without rereading everything.",
  },
];

const features: Feature[] = [
  {
    icon: Layers3,
    title: "Flashcards that start clean",
    description:
      "Generate concise cards from messy class material, then edit the deck before it becomes part of your library.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Quizzes with instant context",
    description:
      "Practice active recall with direct questions, answer choices, and quick feedback on the ideas that need work.",
  },
  {
    icon: LineChart,
    title: "Progress that feels useful",
    description:
      "See what is mastered, what is due, and where to spend the next ten minutes of focused review.",
  },
  {
    icon: ShieldCheck,
    title: "A calmer study workflow",
    description:
      "Everything stays organized around decks, sessions, and documents so you can return without rebuilding the plan.",
  },
];

const subjects = [
  "Biology",
  "History",
  "Programming",
  "Medicine",
  "Languages",
  "Business",
  "Law",
  "Certification prep",
];

const testimonials = [
  {
    quote:
      "Quizzy turns my notes into something I can actually practice with. I spend less time setting up and more time recalling.",
    name: "An Nguyen",
    role: "Medical student",
    initials: "AN",
  },
  {
    quote:
      "The quiz flow is direct. It quickly shows which topics are weak instead of making me reread a whole chapter.",
    name: "Minh Khoa",
    role: "Computer science student",
    initials: "MK",
  },
  {
    quote:
      "I use it for short review sessions after class. The deck and progress views make it easier to stay consistent.",
    name: "Linh Tran",
    role: "High school senior",
    initials: "LT",
  },
];

const faqs = [
  {
    question: "What can I turn into a study deck?",
    answer:
      "You can start from pasted notes, lecture summaries, documents, or a topic prompt. Quizzy organizes the important ideas into a review-ready deck.",
  },
  {
    question: "Do I need polished notes first?",
    answer:
      "No. Rough notes are fine. The workflow is designed to give you a clean first draft that you can study or edit right away.",
  },
  {
    question: "Can Quizzy work across subjects?",
    answer:
      "Yes. It works well for sciences, languages, history, professional training, and any subject that benefits from active recall.",
  },
  {
    question: "Is this for daily review?",
    answer:
      "Yes. Short quizzes, visible progress, and streak-friendly sessions are designed for repeat study instead of last-minute cramming.",
  },
];

function SectionHeading({
  align = "center",
  description,
  eyebrow,
  title,
}: {
  align?: "center" | "left";
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-[720px] text-center"
          : "max-w-[660px]"
      }
    >
      <p className="text-xs font-extrabold uppercase tracking-normal text-[#6b4df6]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-normal text-[#101828] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#667085] sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function HeroCanvas() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-[-150px] top-8 hidden w-[720px] lg:block xl:right-[-80px]"
    >
      <div className="absolute left-12 top-12 h-[560px] w-[560px] rotate-3 border border-[#d0d5dd] bg-white/72 shadow-[0_30px_90px_rgba(16,24,40,0.16)] backdrop-blur-md" />
      <div className="absolute left-24 top-24 h-[500px] w-[500px] -rotate-2 border border-[#101828] bg-[#101828] p-4 shadow-[12px_12px_0_rgba(107,77,246,0.18)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
            <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
            <span className="h-3 w-3 rounded-full bg-[#35d0ba]" />
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/70">
            Live deck
          </span>
        </div>

        <div className="grid gap-3 pt-4">
          <div className="border border-white/10 bg-white p-4">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-normal text-[#6b4df6]">
                  Generated from PDF
                </p>
                <p className="mt-2 text-xl font-extrabold text-[#101828]">
                  Cellular respiration
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#ffec99] text-[#855d00]">
                <FileText className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["48", "cards"],
                ["16", "quiz"],
                ["76%", "ready"],
              ].map(([value, label]) => (
                <div className="border border-[#eaecf0] bg-[#f8fafc] p-3" key={label}>
                  <p className="text-lg font-extrabold text-[#101828]">{value}</p>
                  <p className="text-xs font-semibold text-[#667085]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_130px] gap-3">
            <div className="border border-white/10 bg-[#6b4df6] p-4 text-white">
              <p className="text-[11px] font-extrabold uppercase tracking-normal text-white/65">
                Current prompt
              </p>
              <p className="mt-3 text-lg font-bold leading-6">
                What does the mitochondrion produce during respiration?
              </p>
              <div className="mt-4 space-y-2 text-xs font-bold">
                <span className="block bg-white/15 px-3 py-2">Glucose</span>
                <span className="block bg-[#35d0ba] px-3 py-2 text-[#063b35]">
                  ATP
                </span>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="border border-white/10 bg-[#35d0ba] p-4 text-[#063b35]">
                <Flame className="h-5 w-5" />
                <p className="mt-4 text-2xl font-extrabold">12</p>
                <p className="text-xs font-bold">day streak</p>
              </div>
              <div className="border border-white/10 bg-[#ffec99] p-4 text-[#5d4300]">
                <Clock3 className="h-5 w-5" />
                <p className="mt-4 text-2xl font-extrabold">9m</p>
                <p className="text-xs font-bold">session</p>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/10 p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/70">
              <span>Mastery</span>
              <span>76%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[76%] rounded-full bg-[#35d0ba]" />
            </div>
          </div>
        </div>
      </div>

      <Image
        alt=""
        className="absolute left-0 top-0 h-32 w-32 object-contain drop-shadow-[0_20px_30px_rgba(16,24,40,0.2)]"
        height={160}
        priority
        src="/icon-1.png"
        width={160}
      />
      <Image
        alt=""
        className="absolute bottom-2 left-10 h-40 w-40 object-contain drop-shadow-[0_20px_30px_rgba(16,24,40,0.18)]"
        height={180}
        priority
        src="/icon-3.png"
        width={180}
      />
      <Image
        alt=""
        className="absolute right-4 top-[390px] h-36 w-36 object-contain drop-shadow-[0_20px_30px_rgba(16,24,40,0.2)]"
        height={170}
        priority
        src="/icon-2.png"
        width={170}
      />
    </div>
  );
}

function MobileHeroPreview() {
  return (
    <div className="mt-10 border border-[#d0d5dd] bg-white p-4 shadow-[8px_8px_0_rgba(16,24,40,0.08)] lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-normal text-[#6b4df6]">
            Live deck preview
          </p>
          <p className="mt-1 text-xl font-extrabold text-[#101828]">
            Biology foundations
          </p>
        </div>
        <Image alt="" height={74} src="/icon-1.png" width={74} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {heroStats.map((stat) => (
          <div className="border border-[#eaecf0] bg-[#f8fafc] p-3" key={stat.label}>
            <p className="text-lg font-extrabold text-[#101828]">{stat.value}</p>
            <p className="text-[11px] font-semibold leading-4 text-[#667085]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="border border-[#d0d5dd] bg-[#101828] p-5 text-white shadow-[10px_10px_0_rgba(107,77,246,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-normal text-[#a89bff]">
              Study session
            </p>
            <h3 className="mt-2 text-2xl font-extrabold">Respiration quiz</h3>
          </div>
          <span className="rounded-full bg-[#35d0ba] px-3 py-1 text-xs font-extrabold text-[#063b35]">
            Active recall
          </span>
        </div>

        <div className="mt-6">
          <p className="text-lg font-bold leading-7">
            Which molecule stores usable energy for the cell?
          </p>
          <div className="mt-5 grid gap-3">
            {["Oxygen", "ATP", "Carbon dioxide"].map((answer, index) => (
              <div
                className={`flex items-center justify-between border px-4 py-3 text-sm font-bold ${
                  index === 1
                    ? "border-[#35d0ba] bg-[#35d0ba] text-[#063b35]"
                    : "border-white/10 bg-white/5 text-white/75"
                }`}
                key={answer}
              >
                {answer}
                {index === 1 ? <CheckCircle2 className="h-5 w-5" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-white/65">
            <span>Confidence after review</span>
            <span>High</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-full w-[82%] rounded-full bg-[#ffec99]" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-[#eaecf0] bg-white p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#edfdfb] text-[#087b70]">
            <BookOpenCheck className="h-5 w-5" />
          </span>
          <h3 className="mt-8 text-xl font-extrabold text-[#101828]">
            Review due cards first
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            The dashboard keeps the next useful action easy to spot.
          </p>
        </div>
        <div className="border border-[#eaecf0] bg-white p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#fff7d6] text-[#8f6700]">
            <PenLine className="h-5 w-5" />
          </span>
          <h3 className="mt-8 text-xl font-extrabold text-[#101828]">
            Edit before studying
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            Generated cards are a starting point, not a locked box.
          </p>
        </div>
        <div className="border border-[#eaecf0] bg-white p-5 sm:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-normal text-[#6b4df6]">
                Weekly momentum
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#101828]">
                5 sessions completed
              </h3>
            </div>
            <div className="flex gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${
                    index < 5
                      ? "bg-[#6b4df6] text-white"
                      : "bg-[#f2f4f7] text-[#98a2b3]"
                  }`}
                  key={`${day}-${index}`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fb] text-[#101828]">
      <GlobalHeader />

      <section className="relative overflow-hidden border-b border-[#eaecf0] bg-[#f7f8fb] px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(107,77,246,0.07)_1px,transparent_1px),linear-gradient(180deg,rgba(107,77,246,0.07)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <HeroCanvas />

        <div className="relative z-10 mx-auto max-w-[1180px]">
          <div className="max-w-[720px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d0d5dd] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-normal text-[#6b4df6] shadow-sm">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              AI-powered active recall
            </div>

            <h1 className="max-w-[680px] text-5xl font-extrabold leading-[1.02] tracking-normal text-[#101828] sm:text-6xl lg:text-7xl">
              Quizzy AI
            </h1>
            <p className="mt-6 max-w-[620px] text-lg leading-8 text-[#475467] sm:text-xl">
              Turn notes, PDFs, and rough class material into clean flashcards,
              adaptive quizzes, and short review sessions that are easy to start.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#101828] px-6 py-4 text-base font-extrabold text-white shadow-[0_16px_32px_rgba(16,24,40,0.18)] transition hover:-translate-y-0.5 hover:bg-[#252f3f]"
                href="/register"
              >
                Start studying
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d0d5dd] bg-white px-6 py-4 text-base font-extrabold text-[#101828] transition hover:-translate-y-0.5 hover:border-[#6b4df6] hover:text-[#6b4df6]"
                href="#demo"
              >
                <CirclePlay aria-hidden="true" className="h-5 w-5" />
                See the flow
              </a>
            </div>

            <div className="mt-9 hidden max-w-[620px] gap-3 sm:grid sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  className="border border-[#d0d5dd] bg-white/82 p-4 shadow-sm backdrop-blur"
                  key={stat.label}
                >
                  <p className="text-2xl font-extrabold text-[#101828]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#667085]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <MobileHeroPreview />
        </div>
      </section>

      <section className="border-b border-[#eaecf0] bg-white px-4 py-5 sm:px-6">
        <div className="mx-auto grid max-w-[1180px] gap-4 text-sm font-bold text-[#475467] sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-[#6b4df6]" />
            Designed for students and self-learners
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#087b70]" />
            Built around fast review loops
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[#b57900]" />
            Progress you can return to tomorrow
          </div>
        </div>
      </section>

      <section className="scroll-mt-28 px-4 py-20 sm:px-6 lg:py-24" id="process">
        <div className="mx-auto max-w-[1180px]">
          <SectionHeading
            description="The homepage should make the product feel quick, useful, and calm. This flow shows the core loop from source material to review."
            eyebrow="Process"
            title="From raw notes to active recall in one focused path."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map(({ description, icon: Icon, title }, index) => (
              <article
                className="relative border border-[#eaecf0] bg-white p-6 shadow-[0_14px_34px_rgba(16,24,40,0.06)]"
                key={title}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#eef2ff] text-[#6b4df6]">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-extrabold text-[#98a2b3]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-extrabold tracking-normal text-[#101828]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-28 border-y border-[#eaecf0] bg-white px-4 py-20 sm:px-6 lg:py-24"
        id="features"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
            <SectionHeading
              align="left"
              description="Less decoration, more clarity: every block now explains a real part of the product and gives the page more rhythm."
              eyebrow="Features"
              title="Everything a study session needs, without the clutter."
            />
            <div className="hidden justify-end lg:flex">
              <Image
                alt=""
                className="h-36 w-36 object-contain drop-shadow-[0_18px_28px_rgba(16,24,40,0.14)]"
                height={150}
                src="/icon-3.png"
                width={150}
              />
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {features.map(({ description, icon: Icon, title }, index) => (
              <article
                className={`border p-6 shadow-[0_14px_34px_rgba(16,24,40,0.05)] ${
                  index === 0
                    ? "border-[#c7d7fe] bg-[#eef2ff]"
                    : index === 1
                      ? "border-[#b9ebe3] bg-[#edfdfb]"
                      : index === 2
                        ? "border-[#ffe59d] bg-[#fff9e8]"
                        : "border-[#eaecf0] bg-[#f8fafc]"
                }`}
                key={title}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-[#101828] shadow-sm">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-8 text-2xl font-extrabold tracking-normal text-[#101828]">
                  {title}
                </h3>
                <p className="mt-3 max-w-[520px] text-sm leading-6 text-[#475467]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-28 px-4 py-20 sm:px-6 lg:py-24" id="demo">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <SectionHeading
                align="left"
                description="The page now shows a concrete learning state: generated cards, an active quiz, and the next review signal."
                eyebrow="Product preview"
                title="Make the study loop visible before users sign up."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                {subjects.map((subject) => (
                  <span
                    className="rounded-full border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-bold text-[#475467]"
                    key={subject}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <ProductPreview />
          </div>
        </div>
      </section>

      <section
        className="scroll-mt-28 border-y border-[#eaecf0] bg-[#101828] px-4 py-20 text-white sm:px-6 lg:py-24"
        id="reviews"
      >
        <div className="mx-auto max-w-[1180px]">
          <SectionHeading
            description="A sharper presentation still keeps the promise simple: start faster, practice better, and come back tomorrow."
            eyebrow="Reviews"
            title="Learners come for speed and stay for momentum."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {testimonials.map(({ initials, name, quote, role }) => (
              <article className="border border-white/10 bg-white/6 p-6" key={name}>
                <div className="flex gap-1 text-[#ffcf4a]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star aria-hidden="true" className="h-4 w-4 fill-current" key={index} />
                  ))}
                </div>
                <p className="mt-6 min-h-[144px] text-base leading-7 text-white/72">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#35d0ba] text-xs font-extrabold text-[#063b35]">
                    {initials}
                  </span>
                  <div>
                    <p className="font-extrabold text-white">{name}</p>
                    <p className="text-sm text-white/55">{role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-28 bg-white px-4 py-20 sm:px-6 lg:py-24" id="faq">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            align="left"
            description="A few quick answers before the first deck."
            eyebrow="FAQ"
            title="Questions, answered."
          />

          <div className="space-y-3">
            {faqs.map(({ answer, question }) => (
              <details
                className="group border border-[#eaecf0] bg-[#f8fafc] px-5 py-4 open:border-[#c7d7fe] open:bg-[#eef2ff]"
                key={question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-extrabold text-[#101828]">
                  {question}
                  <span className="text-2xl leading-none text-[#6b4df6] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[760px] pr-8 text-sm leading-6 text-[#667085]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-[1180px] gap-8 border border-[#101828] bg-[#ffec99] p-6 shadow-[10px_10px_0_rgba(16,24,40,0.16)] sm:p-8 lg:grid-cols-[1fr_300px] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-normal text-[#6b4df6]">
              Ready for the next session
            </p>
            <h2 className="mt-3 max-w-[760px] text-3xl font-extrabold leading-tight tracking-normal text-[#101828] sm:text-4xl">
              Turn the notes waiting on your desk into a study plan you can use today.
            </h2>
          </div>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#101828] px-6 py-4 text-base font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#252f3f]"
            href="/register"
          >
            Create your deck
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#eaecf0] bg-white px-4 pb-8 pt-10 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <Link className="flex items-center gap-3" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#101828] text-white">
                <BrainCircuit aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-normal text-[#101828]">
                Quizzy AI
              </span>
            </Link>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-[#667085]">
              <a className="transition hover:text-[#6b4df6]" href="#features">
                Features
              </a>
              <a className="transition hover:text-[#6b4df6]" href="#process">
                Process
              </a>
              <a className="transition hover:text-[#6b4df6]" href="#demo">
                Demo
              </a>
              <a className="transition hover:text-[#6b4df6]" href="#reviews">
                Reviews
              </a>
              <a className="transition hover:text-[#6b4df6]" href="#faq">
                FAQs
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-[#eaecf0] pt-5 text-xs font-semibold text-[#98a2b3] sm:flex-row sm:justify-between">
            <p>(c) 2026 Quizzy. Study smarter, remember more.</p>
            <p>AI-powered learning for ambitious students.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
