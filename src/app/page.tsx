import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  CirclePlay,
  Flame,
  Layers3,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UploadCloud,
  UsersRound,
  Zap,
} from "lucide-react";
import { GlobalHeader } from "@/components/navigation/GlobalHeader";

type Feature = {
  description: string;
  icon: LucideIcon;
  title: string;
};

const featureCards: Feature[] = [
  {
    icon: Layers3,
    title: "Flashcards in seconds",
    description:
      "Turn lecture notes, documents, and messy study material into focused cards that are ready to review.",
  },
  {
    icon: Target,
    title: "Quizzes that adapt",
    description:
      "Practice the topics that need attention and spend less time repeating answers you already know.",
  },
];

const steps: Feature[] = [
  {
    icon: UploadCloud,
    title: "Drop in your material",
    description: "Upload notes, paste text, or start with a topic you want to master.",
  },
  {
    icon: BrainCircuit,
    title: "Let AI shape the lesson",
    description: "Quizzy builds flashcards and questions around the key ideas in seconds.",
  },
  {
    icon: Trophy,
    title: "Study, score, improve",
    description: "Review your results, revisit weak spots, and keep your learning streak alive.",
  },
];

const benefits: Feature[] = [
  {
    icon: Zap,
    title: "Fast by default",
    description: "Go from document to practice session before your motivation disappears.",
  },
  {
    icon: Target,
    title: "Focused practice",
    description: "Every session helps you spend more time on the ideas that matter most.",
  },
  {
    icon: UsersRound,
    title: "Built for momentum",
    description: "Simple streaks and visible progress turn a study plan into a daily habit.",
  },
  {
    icon: ShieldCheck,
    title: "Calm, clear workflow",
    description: "A distraction-free workspace keeps your material organized and easy to revisit.",
  },
];

const testimonials = [
  {
    quote:
      "Quizzy helped me turn a pile of biology notes into a study plan I could actually finish before finals.",
    name: "An Nguyen",
    role: "Medical student",
    initials: "AN",
  },
  {
    quote:
      "The generated quizzes are direct and useful. I can see my weak areas instead of rereading the same chapter.",
    name: "Minh Khoa",
    role: "Computer science student",
    initials: "MK",
  },
  {
    quote:
      "It takes minutes to prepare a revision session now. The progress view makes it much easier to stay consistent.",
    name: "Linh Tran",
    role: "High school senior",
    initials: "LT",
  },
];

const faqs = [
  {
    question: "What can I turn into a study deck?",
    answer:
      "You can begin with pasted notes, lecture summaries, documents, or a topic prompt. Quizzy organizes the important ideas into a review-ready deck.",
  },
  {
    question: "Do I need to prepare my notes first?",
    answer:
      "No. Rough notes are welcome. Quizzy is designed to help you transform unstructured material into a focused place to begin studying.",
  },
  {
    question: "Can I use Quizzy for different subjects?",
    answer:
      "Yes. The workflow works well for sciences, languages, history, professional training, and any subject that benefits from active recall.",
  },
  {
    question: "Is Quizzy suitable for daily review?",
    answer:
      "Yes. Short quizzes, visible progress, and streaks are designed to make repeat study sessions easier to maintain.",
  },
];

const partnerNames = ["StudyLab", "Nova Academy", "BrightPath", "Campus+", "Focus Club"];

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  align?: "center" | "left";
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[680px] text-center" : "max-w-[620px]"}>
      <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-[#614db7]">
        {eyebrow}
      </p>
      <h2 className="[font-family:var(--font-outfit)] text-4xl font-extrabold tracking-[-0.03em] text-[#1b1c19] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#5f5e5e] sm:text-lg">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf9f4] text-[#1b1c19]">
      <GlobalHeader />

      <section className="relative px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-40">
        <div className="pointer-events-none absolute left-[5%] top-44 h-24 w-40 rotate-[-8deg] rounded-2xl bg-[#e6deff]/70" />
        <div className="pointer-events-none absolute right-[7%] top-24 hidden h-20 w-28 rotate-[14deg] rounded-2xl bg-[#f5d547]/70 md:block" />
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#e6deff]/70 px-4 py-2 text-xs font-bold uppercase tracking-normal text-[#311485]">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              AI-powered study companion
            </div>

            <h1 className="max-w-[740px] [font-family:var(--font-outfit)] text-5xl font-extrabold leading-[0.98] tracking-[-0.035em] text-[#1b1c19] sm:text-6xl lg:text-[76px]">
              Turn any notes into{" "}
              <span className="text-[#614db7]">study wins.</span>
            </h1>

            <p className="mt-7 max-w-[630px] text-lg leading-8 text-[#5f5e5e] sm:text-xl">
              Build flashcards, generate quizzes, and focus your revision with a study flow
              that helps you start quickly and remember more.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b1c19] px-7 py-4 text-base font-bold text-white shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:bg-[#30312e]"
                href="/login"
              >
                Create your first deck
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </Link>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black/10 bg-white/80 px-7 py-4 text-base font-bold text-[#614db7] transition hover:border-[#9b87f5] hover:bg-white"
                href="#features"
              >
                <CirclePlay aria-hidden="true" className="h-5 w-5" />
                See how it works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-[#5f5e5e]">
              <div className="flex -space-x-2">
                {["AN", "MK", "LT"].map((initials, index) => (
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#fbf9f4] text-[10px] font-extrabold ${
                      index === 0
                        ? "bg-[#ffd9e4] text-[#531c34]"
                        : index === 1
                          ? "bg-[#cabeff] text-[#1d0061]"
                          : "bg-[#d7f2e3] text-[#16492f]"
                    }`}
                    key={initials}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-bold text-[#1b1c19]">12,000+ active learners</p>
                <p>Building a smarter study habit today</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -left-6 -top-8 h-24 w-24 rotate-[-8deg] rounded-2xl bg-[#e6deff]" />
            <div className="absolute -bottom-7 -right-5 h-28 w-28 rounded-full bg-[#ffd9e4]" />
            <div className="absolute -right-4 top-20 h-16 w-16 rotate-12 rounded-2xl bg-[#f5d547]/80" />

            <div className="relative overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
              <div className="grid gap-4 p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-normal text-[#614db7]">
                      Today&apos;s study plan
                    </p>
                    <h2 className="mt-1 [font-family:var(--font-outfit)] text-2xl font-extrabold tracking-normal">
                      Biology foundations
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#e6deff] px-3 py-2 text-xs font-bold text-[#311485]">
                    76% mastered
                  </span>
                </div>

                <div className="overflow-hidden rounded-full bg-[#ece9f5]">
                  <div className="h-3 w-[76%] rounded-full bg-[#614db7]" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border-2 border-black/5 bg-[#fbf9f4] p-4">
                    <div className="flex items-center gap-2 text-[#614db7]">
                      <Layers3 aria-hidden="true" className="h-5 w-5" />
                      <span className="text-xs font-bold uppercase tracking-[0.12em]">Deck</span>
                    </div>
                    <p className="mt-4 [font-family:var(--font-outfit)] text-3xl font-extrabold tracking-normal">
                      48
                    </p>
                    <p className="mt-1 text-sm text-[#5f5e5e]">flashcards ready</p>
                  </div>
                  <div className="rounded-[18px] border-2 border-black/5 bg-[#fbf9f4] p-4">
                    <div className="flex items-center gap-2 text-[#b46b00]">
                      <Flame aria-hidden="true" className="h-5 w-5" />
                      <span className="text-xs font-bold uppercase tracking-[0.12em]">Streak</span>
                    </div>
                    <p className="mt-4 [font-family:var(--font-outfit)] text-3xl font-extrabold tracking-normal">
                      12
                    </p>
                    <p className="mt-1 text-sm text-[#5f5e5e]">days of progress</p>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#311485] p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#cabeff]">
                        Quick quiz
                      </p>
                      <p className="mt-2 max-w-[320px] [font-family:var(--font-outfit)] text-xl font-bold leading-6">
                        Which organelle is known as the powerhouse of the cell?
                      </p>
                    </div>
                    <BrainCircuit aria-hidden="true" className="h-7 w-7 shrink-0 text-[#f5d547]" />
                  </div>
                  <div className="mt-5 grid gap-2 text-sm">
                    <span className="rounded-xl bg-white/10 px-3 py-2">A. Ribosome</span>
                    <span className="rounded-xl bg-[#9b87f5] px-3 py-2 font-bold">
                      B. Mitochondria
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-black/5 bg-white/70 px-4 py-7 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[230px] text-xs font-bold uppercase tracking-normal text-[#5f5e5e]">
            Trusted by learners across ambitious study communities
          </p>
          <div className="grid flex-1 grid-cols-2 gap-4 text-center sm:grid-cols-5">
            {partnerNames.map((partner) => (
              <span className="[font-family:var(--font-outfit)] text-sm font-extrabold text-[#614db7]/70" key={partner}>
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative scroll-mt-28 px-4 py-24 sm:px-6" id="features">
        <div className="mx-auto max-w-[1180px]">
          <SectionHeading
            description="Start with the material you already have. Quizzy turns it into a structured, active study session without adding more preparation work."
            eyebrow="Features"
            title="A clearer path from notes to knowledge."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[#e6deff] p-6 shadow-[0_16px_42px_rgba(49,20,133,0.08)] sm:p-8 lg:row-span-2">
              <div className="relative z-10 max-w-[420px]">
                <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#311485] text-[#f5d547]">
                  <BrainCircuit aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-8 [font-family:var(--font-outfit)] text-3xl font-extrabold tracking-[-0.02em] text-[#311485] sm:text-4xl">
                  AI deck generation that gives you a useful first draft.
                </h3>
                <p className="mt-4 text-base leading-7 text-[#311485]/75">
                  Quizzy picks out key ideas, creates review prompts, and gives you a focused
                  place to begin. You can study immediately and refine the deck as you go.
                </p>
              </div>

              <div className="relative mt-10 min-h-[250px] overflow-hidden rounded-[22px] border border-white/50 bg-white/45 p-4 backdrop-blur-sm">
                <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#ffd9e4]" />
                <div className="absolute -bottom-12 right-5 h-40 w-52 rotate-[8deg] rounded-[24px] border border-white/40 bg-[#9b87f5]/50" />
                <div className="absolute -bottom-3 right-10 h-40 w-52 rotate-[-4deg] rounded-[24px] border border-white/60 bg-white/60" />
                <div className="relative z-10 max-w-[250px] space-y-3">
                  {["Paste your material", "Generate a smart deck", "Start reviewing"].map(
                    (item, index) => (
                      <div
                        className="flex items-center gap-3 rounded-[14px] bg-white/85 px-3 py-3 text-sm font-bold text-[#311485] shadow-sm"
                        key={item}
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#311485] text-xs text-white">
                          {index + 1}
                        </span>
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {featureCards.map(({ description, icon: Icon, title }, index) => (
              <article
                className={`relative min-h-[290px] overflow-hidden rounded-[28px] border border-black/5 p-6 shadow-[0_16px_42px_rgba(0,0,0,0.05)] sm:p-8 ${
                  index === 0 ? "bg-[#ffd9e4]" : "bg-[#d7f2e3]"
                }`}
                key={title}
              >
                <Icon aria-hidden="true" className="h-8 w-8 text-[#311485]" />
                <h3 className="mt-12 max-w-[440px] [font-family:var(--font-outfit)] text-3xl font-extrabold tracking-[-0.02em] text-[#1b1c19]">
                  {title}
                </h3>
                <p className="mt-3 max-w-[470px] text-base leading-7 text-[#5f5e5e]">
                  {description}
                </p>
                <span className="absolute -bottom-8 -right-5 flex h-28 w-28 items-center justify-center rounded-full bg-white/45">
                  <ChevronRight aria-hidden="true" className="h-9 w-9 text-[#614db7]" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative scroll-mt-28 bg-white/75 px-4 py-24 sm:px-6" id="how-it-works">
        <div className="mx-auto max-w-[1180px]">
          <SectionHeading
            description="No complicated setup. Build a useful study session while the topic is still fresh in your mind."
            eyebrow="How it works"
            title="From upload to active recall in three steps."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map(({ description, icon: Icon, title }, index) => (
              <article
                className="relative rounded-[24px] border border-black/5 bg-[#fbf9f4] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
                key={title}
              >
                <span className="absolute right-5 top-4 [font-family:var(--font-outfit)] text-5xl font-extrabold text-[#614db7]/10">
                  0{index + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#e6deff] text-[#311485]">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-12 [font-family:var(--font-outfit)] text-2xl font-extrabold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#5f5e5e]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative scroll-mt-28 px-4 py-24 sm:px-6" id="why-quizzy">
        <div className="mx-auto max-w-[1180px]">
          <SectionHeading
            description="Quizzy keeps the experience light enough to begin quickly and structured enough to keep improving."
            eyebrow="Why Quizzy"
            title="Make every study session count."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ description, icon: Icon, title }) => (
              <article key={title}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/5 bg-white text-[#614db7] shadow-sm">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 [font-family:var(--font-outfit)] text-xl font-extrabold tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5f5e5e]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative scroll-mt-28 bg-[#e6deff] px-4 py-24 sm:px-6" id="reviews">
        <div className="mx-auto max-w-[1180px]">
          <SectionHeading
            description="A simpler study flow makes it easier to show up, practice, and build confidence one session at a time."
            eyebrow="Reviews"
            title="Learners feel the difference."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {testimonials.map(({ initials, name, quote, role }) => (
              <article
                className="rounded-[24px] border border-white/60 bg-white/75 p-6 shadow-[0_12px_30px_rgba(49,20,133,0.06)] backdrop-blur-sm"
                key={name}
              >
                <div className="flex gap-1 text-[#e9a400]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star aria-hidden="true" className="h-4 w-4 fill-current" key={index} />
                  ))}
                </div>
                <p className="mt-6 min-h-[120px] text-base leading-7 text-[#5f5e5e]">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-3 border-t border-black/5 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#311485] text-xs font-extrabold text-white">
                    {initials}
                  </span>
                  <div>
                    <p className="font-bold text-[#1b1c19]">{name}</p>
                    <p className="text-sm text-[#5f5e5e]">{role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative scroll-mt-28 bg-white px-4 py-24 sm:px-6" id="faq">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            align="left"
            description="A few quick answers before you build your first deck."
            eyebrow="FAQ"
            title="Questions, answered."
          />

          <div className="space-y-3">
            {faqs.map(({ answer, question }) => (
              <details
                className="group rounded-[18px] border border-black/5 bg-[#fbf9f4] px-5 py-4 open:bg-[#e6deff]"
                key={question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-[#1b1c19]">
                  {question}
                  <span className="text-2xl leading-none text-[#614db7] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[740px] pr-8 text-sm leading-6 text-[#5f5e5e]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-10 sm:px-6 sm:py-16">
        <div className="relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[32px] border border-black/5 bg-[#9b87f5] p-7 text-[#311485] shadow-[0_20px_60px_rgba(0,0,0,0.1)] sm:p-10 lg:grid-cols-[1fr_340px] lg:items-center lg:gap-8">
          <div className="absolute -bottom-12 -left-8 h-36 w-52 rotate-[-8deg] rounded-2xl border border-black/10 bg-[#e6deff]/50" />
          <div className="absolute right-12 top-8 hidden h-20 w-28 rotate-[12deg] rounded-2xl border border-black/10 bg-[#f5d547]/70 lg:block" />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-normal text-[#311485]/75">
              Your next study session
            </p>
            <h2 className="mt-4 max-w-[720px] [font-family:var(--font-outfit)] text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
              Spend less time preparing. Start learning now.
            </h2>
            <p className="mt-4 max-w-[660px] text-base leading-7 text-[#311485]/80">
              Turn the notes waiting on your desk into a focused deck and a clear next step.
            </p>
            <Link
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1b1c19] px-6 py-4 font-bold text-white shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:bg-[#30312e]"
              href="/login"
            >
              Start with Quizzy
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
          </div>

          <div className="relative mt-8 hidden min-h-[230px] lg:block">
            <div className="absolute bottom-0 right-0 w-full max-w-[320px] rounded-[28px] border border-white/30 bg-white/30 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.08)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex -space-x-2">
                  {["AN", "MK"].map((initials, index) => (
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#9b87f5] text-[10px] font-extrabold ${
                        index === 0
                          ? "bg-[#ffd9e4] text-[#531c34]"
                          : "bg-[#cabeff] text-[#1d0061]"
                      }`}
                      key={initials}
                    >
                      {initials}
                    </span>
                  ))}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#9b87f5] bg-[#311485] text-[10px] font-extrabold text-white">
                    +12k
                  </span>
                </div>
                <Sparkles aria-hidden="true" className="h-5 w-5 text-[#311485]" />
              </div>
              <p className="mt-5 text-base leading-7 text-[#311485]">
                A focused deck is only a few minutes away.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative px-4 pb-8 pt-12 sm:px-6">
        <div className="mx-auto max-w-[1180px] border-t border-black/5 pt-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <Link className="flex items-center gap-3" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1b1c19] text-white">
                <BrainCircuit aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="[font-family:var(--font-outfit)] text-lg font-extrabold tracking-normal text-[#1b1c19]">
                Quizzy AI
              </span>
            </Link>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#5f5e5e]">
              <a className="transition hover:text-[#614db7]" href="#features">
                Features
              </a>
              <a className="transition hover:text-[#614db7]" href="#how-it-works">
                How it works
              </a>
              <a className="transition hover:text-[#614db7]" href="#reviews">
                Reviews
              </a>
              <a className="transition hover:text-[#614db7]" href="#faq">
                FAQs
              </a>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-black/5 pt-5 text-xs text-[#5f5e5e] sm:flex-row sm:justify-between">
            <p>© 2026 Quizzy. Study smarter, remember more.</p>
            <p>AI-powered learning for ambitious students.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
