"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BrainCircuit, Loader2 } from "lucide-react";
import { authAPI } from "@/services/api";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("accessToken"));
  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe(),
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    if (!hasToken || userQuery.isError) router.replace("/login");
  }, [hasToken, router, userQuery.isError]);

  useEffect(() => {
    const handleUnauthorized = () => router.replace("/login");
    window.addEventListener("quizzy:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("quizzy:unauthorized", handleUnauthorized);
  }, [router]);

  if (!hasToken || userQuery.isPending || userQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f4]">
        <div className="flex flex-col items-center gap-4 text-[#614db7]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6deff]">
            <BrainCircuit className="h-7 w-7" />
          </span>
          <div className="flex items-center gap-2 text-sm font-bold">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your workspace
          </div>
        </div>
      </div>
    );
  }

  return children;
}
