"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { authAPI } from "@/services/api";

export function GlobalHeader() {
  const hasToken = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe(),
    enabled: hasToken,
    retry: false,
  });
  const user = userQuery.data?.data;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#eaecf0] bg-white/88 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#101828] text-white">
            <BrainCircuit aria-hidden="true" className="h-6 w-6" />
          </span>
          <span className="text-xl font-extrabold tracking-normal text-[#101828]">Quizzy AI</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-[#667085] lg:flex">
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
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                className="hidden items-center gap-2 rounded-full bg-[#101828] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#252f3f] sm:inline-flex"
                href="/home"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <UserMenu compact user={user} />
            </>
          ) : hasToken && userQuery.isPending ? (
            <span className="h-11 w-24 animate-pulse rounded-full bg-[#e8e3dc]" />
          ) : (
            <>
              <Link
                className="hidden px-3 py-2 text-sm font-bold text-[#667085] transition hover:text-[#6b4df6] sm:inline-flex"
                href="/login"
              >
                Log in
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-[#101828] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#252f3f]"
                href="/register"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function subscribeToAuth(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("quizzy:auth-changed", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("quizzy:auth-changed", onStoreChange);
  };
}

function getAuthSnapshot() {
  return Boolean(window.localStorage.getItem("accessToken"));
}

function getServerAuthSnapshot() {
  return false;
}
