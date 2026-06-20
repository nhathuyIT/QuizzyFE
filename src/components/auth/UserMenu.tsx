"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Library,
  Loader2,
  LogOut,
} from "lucide-react";
import { authAPI, type AuthUser } from "@/services/api";

export function UserMenu({ compact = false, user }: { compact?: boolean; user: AuthUser }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const initials = getInitials(user.name);

  const logoutMutation = useMutation({
    mutationFn: () => authAPI.logout(),
    onSettled: async () => {
      window.localStorage.removeItem("accessToken");
      window.dispatchEvent(new Event("quizzy:auth-changed"));
      queryClient.removeQueries({ queryKey: ["auth"] });
      setIsOpen(false);
      router.replace("/");
      router.refresh();
    },
  });

  useEffect(() => {
    function closeFromOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);

    return () => {
      document.removeEventListener("mousedown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 text-left shadow-sm transition hover:border-[#cabeff] hover:shadow-md ${
          compact ? "pr-2" : "pr-3"
        }`}
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5d547] text-xs font-bold text-[#493600]">
          {initials}
        </span>
        {!compact && (
          <span className="hidden max-w-32 sm:block">
            <span className="block truncate text-sm font-semibold text-[#1b1c19]">
              {user.name}
            </span>
            <span className="block truncate text-[11px] text-[#777474]">{user.email}</span>
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-[#777474] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-[0_18px_50px_rgba(27,28,25,0.16)]"
          role="menu"
        >
          <div className="border-b border-black/5 px-3 py-3">
            <p className="truncate text-sm font-semibold text-[#1b1c19]">{user.name}</p>
            <p className="mt-1 truncate text-xs text-[#777474]">{user.email}</p>
          </div>
          <div className="py-2">
            <MenuLink href="/home" icon={LayoutDashboard} label="Dashboard" />
            <MenuLink href="/my-library" icon={Library} label="My decks" />
            <MenuLink href="/#faq" icon={CircleHelp} label="Help center" />
          </div>
          <div className="border-t border-black/5 pt-2">
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#a33a3a] transition hover:bg-[#fff0f0] disabled:opacity-60"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              role="menuitem"
              type="button"
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
}) {
  return (
    <Link
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#5f5e5e] transition hover:bg-[#f6f3ee] hover:text-[#1b1c19]"
      href={href}
      role="menuitem"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "Q"
  );
}
