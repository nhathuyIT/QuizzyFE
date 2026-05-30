"use client";

import { useEffect, useState, type FormEvent, type PointerEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import {
  Apple,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { authAPI } from "@/services/api";

type AuthMode = "login" | "register";

const learnerAvatars = [
  { initials: "AN", className: "bg-[#ffd9e4] text-[#531c34]" },
  { initials: "MK", className: "bg-[#cabeff] text-[#1d0061]" },
];

const visualCopy = {
  login: {
    eyebrow: "AI-powered study decks",
    heading: (
      <>
        Master
        <br />
        Anything
        <br />
        Instantly.
      </>
    ),
    description:
      "Join 2 million learners using AI to turn messy notes into focused flashcards, quizzes, and review sessions.",
    testimonial:
      "The AI deck generator saved my finals week. It feels like a personal tutor that actually knows my notes.",
  },
  register: {
    eyebrow: "Build your learning habit",
    heading: (
      <>
        Learn
        <br />
        Smarter
        <br />
        Every Day.
      </>
    ),
    description:
      "Create your learning space and turn every note, lecture, and study goal into a clear next step.",
    testimonial:
      "Quizzy gave me a study routine I could actually stick with. Starting a review session now feels effortless.",
  },
} as const;

export function AuthPage({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false);
  const [successMode, setSuccessMode] = useState<AuthMode | null>(null);
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const smoothX = useSpring(cardX, { stiffness: 120, damping: 18 });
  const smoothY = useSpring(cardY, { stiffness: 120, damping: 18 });
  const copy = visualCopy[mode];

  const loginMutation = useMutation({
    mutationFn: () => authAPI.login({ email: loginEmail.trim(), password: loginPassword }),
    onSuccess: (response) => {
      if (response?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        setSuccessMode("login");
      } else {
        setErrorMsg("Invalid response from server.");
      }
    },
    onError: (error: unknown) => {
      setErrorMsg(error instanceof Error ? error.message : "Login failed.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: () =>
      authAPI.register({
        name: name.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      }),
    onSuccess: () => setSuccessMode("register"),
    onError: (error: unknown) => {
      setErrorMsg(error instanceof Error ? error.message : "Registration failed.");
    },
  });

  useEffect(() => {
    if (successMode !== "login") return;

    const timeout = window.setTimeout(() => router.push("/home"), 1200);
    return () => window.clearTimeout(timeout);
  }, [router, successMode]);

  function switchMode(nextMode: AuthMode) {
    setErrorMsg("");
    setMode(nextMode);
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg("Please enter email and password.");
      return;
    }

    loginMutation.mutate();
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !registerEmail.trim() || !registerPassword || !confirmPassword) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMsg("Password must contain at least 6 characters.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!acceptsTerms) {
      setErrorMsg("Please accept the terms to create your account.");
      return;
    }

    registerMutation.mutate();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / 28;
    const y = (event.clientY - rect.top - rect.height / 2) / 28;

    cardX.set(x);
    cardY.set(y);
  }

  function resetFloatingCard() {
    cardX.set(0);
    cardY.set(0);
  }

  function finishRegistration() {
    setLoginEmail(registerEmail);
    setLoginPassword("");
    setSuccessMode(null);
    switchMode("login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f4] p-4 text-[#1b1c19] md:p-8">
      <section className="grid w-full max-w-[1280px] overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:min-h-[820px] lg:grid-cols-2">
        <motion.div
          className={`relative flex min-h-[520px] flex-col justify-between overflow-hidden bg-[#9b87f5] p-6 sm:p-10 ${
            mode === "register" ? "lg:order-2" : "lg:order-1"
          }`}
          layout
          onPointerLeave={resetFloatingCard}
          onPointerMove={handlePointerMove}
          transition={{ layout: { type: "spring", stiffness: 150, damping: 22 } }}
        >
          <div className="absolute left-8 top-28 h-28 w-44 rotate-[-8deg] rounded-2xl border border-black/10 bg-[#e6deff]/60" />
          <div className="absolute bottom-24 right-8 h-32 w-48 rotate-[8deg] rounded-2xl border border-black/10 bg-[#ffd9e4]/70" />
          <div className="absolute right-16 top-12 hidden h-20 w-28 rotate-[14deg] rounded-2xl border border-black/10 bg-[#f5d547]/80 md:block" />

          <div className="relative z-10">
            <Link className="mb-12 inline-flex items-center gap-3" href="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b1c19] text-white">
                <BrainCircuit aria-hidden="true" className="h-6 w-6" />
              </span>
              <span className="[font-family:var(--font-outfit)] text-2xl font-extrabold tracking-normal">
                Quizzy AI
              </span>
            </Link>

            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 12 }}
                key={mode}
                transition={{ duration: 0.28 }}
              >
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/25 px-4 py-2 text-xs font-bold uppercase tracking-normal text-[#1d0061]">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  {copy.eyebrow}
                </p>

                <h1 className="[font-family:var(--font-outfit)] text-5xl font-extrabold leading-none tracking-normal text-[#311485] sm:text-6xl lg:text-7xl">
                  {copy.heading}
                </h1>

                <p className="mt-6 max-w-[440px] text-base leading-7 text-[#311485]/80 sm:text-lg">
                  {copy.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            className="relative z-10 mt-10 max-w-[460px] rounded-[28px] border border-white/30 bg-white/30 p-6 shadow-[4px_4px_0_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8"
            style={{ x: smoothX, y: smoothY }}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center">
                {learnerAvatars.map((avatar) => (
                  <span
                    className={`-ml-2 first:ml-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#9b87f5] text-xs font-extrabold ${avatar.className}`}
                    key={avatar.initials}
                  >
                    {avatar.initials}
                  </span>
                ))}
                <span className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#9b87f5] bg-[#311485] text-[10px] font-extrabold text-white">
                  +12k
                </span>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-normal text-[#311485]">
                <UsersRound aria-hidden="true" className="h-4 w-4" />
                Active Today
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                animate={{ opacity: 1 }}
                className="text-base leading-7 text-[#311485]"
                initial={{ opacity: 0 }}
                key={mode}
                transition={{ duration: 0.25 }}
              >
                &ldquo;{copy.testimonial}&rdquo;
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          className={`flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-14 ${
            mode === "register" ? "lg:order-1" : "lg:order-2"
          }`}
          layout
          transition={{ layout: { type: "spring", stiffness: 150, damping: 22 } }}
        >
          <div className="w-full max-w-[440px]">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  initial={{ opacity: 0, x: 24 }}
                  key="login-form"
                  transition={{ duration: 0.28 }}
                >
                  <header className="mb-10 text-center lg:text-left">
                    <p className="mb-3 text-xs font-bold uppercase tracking-normal text-[#614db7]">
                      Continue learning
                    </p>
                    <h2 className="[font-family:var(--font-outfit)] text-4xl font-extrabold tracking-normal text-[#1b1c19]">
                      Welcome Back
                    </h2>
                    <p className="mt-3 text-base leading-7 text-[#5f5e5e]">
                      Ready to crush your learning goals today?
                    </p>
                  </header>

                  <SocialButtons />
                  <Divider />

                  <form className="space-y-6" onSubmit={handleLogin}>
                    <ErrorMessage message={errorMsg} />
                    <Field htmlFor="login-email" label="Work Email">
                      <input
                        autoComplete="email"
                        className={inputClassName}
                        disabled={loginMutation.isPending}
                        id="login-email"
                        name="email"
                        onChange={(event) => setLoginEmail(event.target.value)}
                        placeholder="name@example.com"
                        type="email"
                        value={loginEmail}
                      />
                    </Field>

                    <Field
                      htmlFor="login-password"
                      label="Password"
                      trailing={
                        <Link
                          className="text-xs font-bold text-[#614db7] transition hover:text-[#49339d]"
                          href="/forgot-password"
                        >
                          Forgot?
                        </Link>
                      }
                    >
                      <PasswordInput
                        autoComplete="current-password"
                        disabled={loginMutation.isPending}
                        id="login-password"
                        isVisible={isLoginPasswordVisible}
                        onChange={setLoginPassword}
                        onToggle={() => setIsLoginPasswordVisible((value) => !value)}
                        value={loginPassword}
                      />
                    </Field>

                    <label className="flex items-center gap-3 py-1 text-sm leading-6 text-[#5f5e5e]">
                      <input
                        className="h-5 w-5 rounded border-2 border-black/10 accent-[#614db7]"
                        name="remember"
                        type="checkbox"
                      />
                      Remember me for 30 days
                    </label>

                    <SubmitButton
                      isPending={loginMutation.isPending}
                      pendingLabel="Signing In..."
                    >
                      Sign In
                    </SubmitButton>
                  </form>

                  <footer className="mt-10 text-center text-base text-[#5f5e5e]">
                    Don&apos;t have an account?
                    <button
                      className="ml-1 font-bold text-[#1b1c19] transition hover:text-[#614db7]"
                      onClick={() => switchMode("register")}
                      type="button"
                    >
                      Create an account
                    </button>
                  </footer>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  initial={{ opacity: 0, x: -24 }}
                  key="register-form"
                  transition={{ duration: 0.28 }}
                >
                  <header className="mb-6 text-center lg:text-left">
                    <p className="mb-3 text-xs font-bold uppercase tracking-normal text-[#614db7]">
                      Start your journey
                    </p>
                    <h2 className="[font-family:var(--font-outfit)] text-4xl font-extrabold tracking-normal text-[#1b1c19]">
                      Create Account
                    </h2>
                    <p className="mt-3 text-base leading-7 text-[#5f5e5e]">
                      Build your personal study space in a minute.
                    </p>
                  </header>

                  <SocialButtons compact />
                  <Divider compact />

                  <form className="space-y-4" onSubmit={handleRegister}>
                    <ErrorMessage message={errorMsg} />
                    <Field htmlFor="register-name" label="Display Name">
                      <input
                        autoComplete="name"
                        className={inputClassName}
                        disabled={registerMutation.isPending}
                        id="register-name"
                        name="name"
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        type="text"
                        value={name}
                      />
                    </Field>

                    <Field htmlFor="register-email" label="Work Email">
                      <input
                        autoComplete="email"
                        className={inputClassName}
                        disabled={registerMutation.isPending}
                        id="register-email"
                        name="email"
                        onChange={(event) => setRegisterEmail(event.target.value)}
                        placeholder="name@example.com"
                        type="email"
                        value={registerEmail}
                      />
                    </Field>

                    <Field htmlFor="register-password" label="Password">
                      <PasswordInput
                        autoComplete="new-password"
                        disabled={registerMutation.isPending}
                        id="register-password"
                        isVisible={isRegisterPasswordVisible}
                        onChange={setRegisterPassword}
                        onToggle={() => setIsRegisterPasswordVisible((value) => !value)}
                        value={registerPassword}
                      />
                    </Field>

                    <Field htmlFor="confirm-password" label="Confirm Password">
                      <PasswordInput
                        autoComplete="new-password"
                        disabled={registerMutation.isPending}
                        id="confirm-password"
                        isVisible={isRegisterPasswordVisible}
                        onChange={setConfirmPassword}
                        onToggle={() => setIsRegisterPasswordVisible((value) => !value)}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                      />
                    </Field>

                    <label className="flex items-start gap-3 py-1 text-sm leading-6 text-[#5f5e5e]">
                      <input
                        checked={acceptsTerms}
                        className="mt-0.5 h-5 w-5 rounded border-2 border-black/10 accent-[#614db7]"
                        name="terms"
                        onChange={(event) => setAcceptsTerms(event.target.checked)}
                        type="checkbox"
                      />
                      I agree to the Terms and Privacy Policy.
                    </label>

                    <SubmitButton
                      isPending={registerMutation.isPending}
                      pendingLabel="Creating Account..."
                    >
                      Create Account
                    </SubmitButton>
                  </form>

                  <footer className="mt-7 text-center text-base text-[#5f5e5e]">
                    Already have an account?
                    <button
                      className="ml-1 font-bold text-[#1b1c19] transition hover:text-[#614db7]"
                      onClick={() => switchMode("login")}
                      type="button"
                    >
                      Sign in
                    </button>
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {successMode && (
        <motion.div
          animate={{ opacity: 1 }}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/40 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          role="dialog"
        >
          <motion.div
            animate={{ scale: 1, y: 0 }}
            className="flex w-full max-w-sm flex-col items-center rounded-[32px] border border-black/5 bg-[#fbf9f4] p-8 text-center shadow-2xl"
            initial={{ scale: 0.96, y: 12 }}
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e6deff] text-[#311485]">
              <CheckCircle2 aria-hidden="true" className="h-10 w-10" />
            </div>
            <h3 className="[font-family:var(--font-outfit)] text-2xl font-bold tracking-normal text-[#1b1c19]">
              {successMode === "login" ? "Welcome Back!" : "Account Created!"}
            </h3>
            <p className="mt-3 text-base leading-7 text-[#5f5e5e]">
              {successMode === "login"
                ? "Launching your personalized study dashboard..."
                : "Your learning space is ready. Sign in and start your first deck."}
            </p>
            <div className="mt-7 h-3 w-full overflow-hidden rounded-full bg-[#e4e2dd]">
              <motion.div
                animate={{ width: "100%" }}
                className="h-full rounded-full bg-[#614db7]"
                initial={{ width: "0%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <button
              className="mt-6 text-sm font-bold text-[#614db7] transition hover:text-[#49339d]"
              onClick={
                successMode === "register" ? finishRegistration : () => setSuccessMode(null)
              }
              type="button"
            >
              {successMode === "register" ? "Continue to sign in" : "Stay on login"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}

const inputClassName =
  "h-14 w-full rounded-2xl border-2 border-black/5 bg-white px-5 text-base text-[#1b1c19] transition placeholder:text-[#797583]/60 focus:border-[#9b87f5] focus:outline-none focus:ring-4 focus:ring-[#9b87f5]/20 disabled:opacity-70";

function Field({
  children,
  htmlFor,
  label,
  trailing,
}: {
  children: React.ReactNode;
  htmlFor: string;
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label
          className="block text-xs font-bold uppercase tracking-normal text-[#484552]"
          htmlFor={htmlFor}
        >
          {label}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function PasswordInput({
  autoComplete,
  disabled,
  id,
  isVisible,
  onChange,
  onToggle,
  placeholder = "Password",
  value,
}: {
  autoComplete: string;
  disabled: boolean;
  id: string;
  isVisible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div className="relative">
      <input
        autoComplete={autoComplete}
        className={`${inputClassName} pr-14`}
        disabled={disabled}
        id={id}
        name={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={isVisible ? "text" : "password"}
        value={value}
      />
      <button
        aria-label={isVisible ? "Hide password" : "Show password"}
        className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#797583] transition hover:bg-[#f5f3ee] hover:text-[#1b1c19] focus:outline-none focus:ring-4 focus:ring-[#9b87f5]/20"
        onClick={onToggle}
        type="button"
      >
        {isVisible ? (
          <EyeOff aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Eye aria-hidden="true" className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;

  return (
    <p
      aria-live="polite"
      className="rounded-2xl border border-[#ba1a1a]/20 bg-[#ffdad6] px-4 py-3 text-sm font-semibold text-[#93000a]"
    >
      {message}
    </p>
  );
}

function SocialButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? "mb-5" : "mb-8"} grid grid-cols-2 gap-3 sm:gap-4`}>
      <button
        className="flex h-14 items-center justify-center gap-3 rounded-full border-2 border-black/10 bg-white px-4 text-sm font-semibold text-[#1b1c19] transition hover:bg-[#f5f3ee] focus:outline-none focus:ring-4 focus:ring-[#9b87f5]/20"
        type="button"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full text-sm font-extrabold text-[#614db7]">
          G
        </span>
        Google
      </button>
      <button
        className="flex h-14 items-center justify-center gap-3 rounded-full border-2 border-black/10 bg-white px-4 text-sm font-semibold text-[#1b1c19] transition hover:bg-[#f5f3ee] focus:outline-none focus:ring-4 focus:ring-[#9b87f5]/20"
        type="button"
      >
        <Apple aria-hidden="true" className="h-5 w-5" />
        Apple
      </button>
    </div>
  );
}

function Divider({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? "mb-5" : "mb-8"} flex items-center gap-4`}>
      <span className="h-px flex-1 bg-[#c9c4d4]/70" />
      <span className="text-[10px] font-bold uppercase tracking-normal text-[#797583]">
        Or Email
      </span>
      <span className="h-px flex-1 bg-[#c9c4d4]/70" />
    </div>
  );
}

function SubmitButton({
  children,
  isPending,
  pendingLabel,
}: {
  children: React.ReactNode;
  isPending: boolean;
  pendingLabel: string;
}) {
  return (
    <button
      className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#1b1c19] px-6 text-lg font-bold text-white shadow-xl shadow-black/10 transition hover:-translate-y-px hover:bg-[#30312e] focus:outline-none focus:ring-4 focus:ring-[#9b87f5]/25 active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
      disabled={isPending}
      type="submit"
    >
      {isPending ? pendingLabel : children}
      {isPending ? (
        <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
      ) : (
        <ArrowRight
          aria-hidden="true"
          className="h-5 w-5 transition group-hover:translate-x-0.5"
        />
      )}
    </button>
  );
}
