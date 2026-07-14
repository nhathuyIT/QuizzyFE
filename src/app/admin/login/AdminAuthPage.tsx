"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { authAPI, type AuthUser } from "@/services/api";
import { AdminPageContent } from "../admin-page/AdminPageContent";

export default function AdminAuthPage({
  initialSection,
}: {
  initialSection?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasStoredToken, setHasStoredToken] = useState(false);
  const [loginAdminUser, setLoginAdminUser] = useState<AuthUser | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);

  useEffect(() => {
    const syncTokenState = () => {
      setHasStoredToken(Boolean(window.localStorage.getItem("accessToken")));
      setIsAuthReady(true);
    };

    syncTokenState();
    window.addEventListener("quizzy:auth-changed", syncTokenState);
    window.addEventListener("quizzy:unauthorized", syncTokenState);

    return () => {
      window.removeEventListener("quizzy:auth-changed", syncTokenState);
      window.removeEventListener("quizzy:unauthorized", syncTokenState);
    };
  }, []);

  const adminSessionQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      try {
        const response = await authAPI.getMe();
        const user = response.data;

        if (user.role !== "admin") {
          console.log("[AdminAuth] Stored session blocked: non-admin role.", user.role);
          window.localStorage.removeItem("accessToken");
          window.dispatchEvent(new Event("quizzy:auth-changed"));
          throw new Error("Admin role required.");
        }

        console.log("[AdminAuth] Stored admin session verified.");
        return user;
      } catch (error) {
        console.log("[AdminAuth] Stored admin session verification failed.", error);
        throw error instanceof Error
          ? error
          : new Error("Unable to verify admin session.");
      }
    },
    enabled: hasStoredToken && !loginAdminUser,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: () => authAPI.login({ email: email.trim(), password }),
    onSuccess: (response) => {
      console.log("[AdminAuth] Login API success:", response);

      if (!response?.data?.accessToken) {
        console.log("[AdminAuth] Login API missing access token.");
        setErrorMsg("Invalid response from server.");
        return;
      }

      if (response.data.user.role !== "admin") {
        console.log("[AdminAuth] Login blocked: non-admin role.", response.data.user.role);
        setErrorMsg("Admin role required.");
        return;
      }

      console.log("[AdminAuth] Admin login verified.");
      setLoginAdminUser(response.data.user);
      localStorage.setItem("accessToken", response.data.accessToken);
      window.dispatchEvent(new Event("quizzy:auth-changed"));
      setIsLoginSuccessful(true);
    },
    onError: (error: unknown) => {
      console.log("[AdminAuth] Login API failed:", error);
      setErrorMsg(error instanceof Error ? error.message : "Unable to sign in.");
    },
  });

  useEffect(() => {
    if (!isLoginSuccessful) return;

    const timeout = window.setTimeout(() => setIsLoginSuccessful(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [isLoginSuccessful]);

  function handleLogout() {
    window.localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("quizzy:auth-changed"));
    setLoginAdminUser(null);
    setIsAuthReady(true);
    setHasStoredToken(false);
    setEmail("");
    setPassword("");
    setErrorMsg("");
    setIsLoginSuccessful(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");
    setIsLoginSuccessful(false);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter admin email and password.");
      return;
    }

    loginMutation.mutate();
  }

  // Query data can remain cached after logout. Only trust it while the token
  // that authenticated that session is still present.
  const currentAdminUser =
    loginAdminUser ?? (hasStoredToken ? adminSessionQuery.data : null);
  const adminSessionError =
    adminSessionQuery.error instanceof Error
      ? adminSessionQuery.error.message
      : "Unable to verify admin session.";
  const visibleErrorMsg = errorMsg || (adminSessionQuery.isError ? adminSessionError : "");

  if (
    !isAuthReady ||
    (hasStoredToken && adminSessionQuery.isPending && !currentAdminUser)
  ) {
    return <AdminLoadingScreen />;
  }

  if (currentAdminUser) {
    return (
      <>
        <AdminPageContent
          initialSection={initialSection}
          user={currentAdminUser}
          onLogout={handleLogout}
        />
        {isLoginSuccessful ? <AdminVerifiedDialog /> : null}
      </>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f4] p-4 text-[#1b1c19] md:p-8">
      <div className="flex w-full items-center justify-center">
        <section className="w-full max-w-[520px] overflow-hidden rounded-[32px] border border-black/5 bg-white px-6 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:px-10 lg:px-14">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[440px]">
              <header className="mb-10 text-center sm:text-left">
                <p className="mb-3 text-xs font-bold uppercase tracking-normal text-[#614db7]">
                  Admin Portal
                </p>
                <h2 className="[font-family:var(--font-outfit)] text-4xl font-extrabold tracking-normal text-[#1b1c19]">
                  Secure sign in
                </h2>
                <p className="mt-3 text-base leading-7 text-[#5f5e5e]">
                  Admin credentials are required. Student and teacher accounts are blocked.
                </p>
              </header>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {visibleErrorMsg ? (
                  <StatusMessage tone="error">{visibleErrorMsg}</StatusMessage>
                ) : null}

                <Field htmlFor="admin-email" label="Admin Email">
                  <input
                    autoComplete="email"
                    className={inputClassName}
                    disabled={loginMutation.isPending}
                    id="admin-email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@quizzy.ai"
                    type="email"
                    value={email}
                  />
                </Field>

                <Field htmlFor="admin-password" label="Password">
                  <div className="relative">
                    <input
                      autoComplete="current-password"
                      className={`${inputClassName} pr-14`}
                      disabled={loginMutation.isPending}
                      id="admin-password"
                      name="password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                    />
                    <button
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#797583] transition hover:bg-[#f5f3ee] hover:text-[#1b1c19] focus:outline-none focus:ring-4 focus:ring-[#9b87f5]/20"
                      disabled={loginMutation.isPending}
                      onClick={() => setIsPasswordVisible((value) => !value)}
                      type="button"
                    >
                      {isPasswordVisible ? (
                        <EyeOff aria-hidden="true" className="h-5 w-5" />
                      ) : (
                        <Eye aria-hidden="true" className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </Field>

                <button
                  className="group flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#1b1c19] px-6 text-lg font-bold text-white shadow-xl shadow-black/10 transition hover:-translate-y-px hover:bg-[#30312e] focus:outline-none focus:ring-4 focus:ring-[#9b87f5]/25 active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
                  disabled={loginMutation.isPending}
                  type="submit"
                >
                  {loginMutation.isPending ? "Verifying..." : "Sign in as admin"}
                  {loginMutation.isPending ? (
                    <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowRight
                      aria-hidden="true"
                      className="h-5 w-5 transition group-hover:translate-x-0.5"
                    />
                  )}
                </button>
              </form>

              <footer className="mt-10 flex items-center justify-between gap-4 text-base text-[#5f5e5e]">
                <Link className="font-semibold transition hover:text-[#614db7]" href="/login">
                  User sign in
                </Link>
                <Link className="font-semibold transition hover:text-[#614db7]" href="/">
                  Back to home
                </Link>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputClassName =
  "h-14 w-full rounded-2xl border-2 border-black/5 bg-white px-5 text-base text-[#1b1c19] outline-none transition placeholder:text-[#797583]/60 focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/20 disabled:opacity-70";

function Field({
  children,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  htmlFor: string;
  label: string;
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
      </div>
      {children}
    </div>
  );
}

function StatusMessage({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "error" | "success";
}) {
  const toneClassName =
    tone === "error"
      ? "border-[#ba1a1a]/20 bg-[#ffdad6] text-[#93000a]"
      : "border-[#614db7]/20 bg-[#e6deff] text-[#311485]";

  return (
    <p
      aria-live="polite"
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${toneClassName}`}
    >
      {tone === "success" ? (
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
      ) : null}
      {children}
    </p>
  );
}

function AdminLoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f4] text-[#1b1c19]">
      <div className="flex flex-col items-center gap-4 text-[#614db7]">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6deff]">
          <BrainCircuit aria-hidden="true" className="h-7 w-7" />
        </span>
        <div className="flex items-center gap-2 text-sm font-bold">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          Checking admin session
        </div>
      </div>
    </main>
  );
}

function AdminVerifiedDialog() {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/40 p-4 backdrop-blur-md"
      role="dialog"
    >
      <div className="flex w-full max-w-[384px] flex-col items-center rounded-[28px] border border-black/5 bg-[#fbf9f4] p-8 text-center shadow-2xl">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e6deff] text-[#311485]">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold tracking-normal text-[#1b1c19]">
          Admin verified
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#5f5e5e]">
          Your administrator session is active.
        </p>
        <div className="mt-7 h-2 w-full overflow-hidden rounded-full bg-[#e4e2dd]">
          <div className="h-full w-full rounded-full bg-[#614db7]" />
        </div>
      </div>
    </div>
  );
}
