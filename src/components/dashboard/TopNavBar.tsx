"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bell, Menu, Plus, Search } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { authAPI } from "@/services/api";

interface TopNavBarProps {
  onMenuClick?: () => void;
  searchPlaceholder?: string;
}

export function TopNavBar({
  onMenuClick,
  searchPlaceholder = "Search your decks",
}: TopNavBarProps) {
  const router = useRouter();
  const userQuery = useQuery({ queryKey: ["auth", "me"], queryFn: () => authAPI.getMe(), retry: false });
  const user = userQuery.data?.data;

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const keyword = String(form.get("keyword") ?? "").trim();
    router.push(keyword ? `/my-library?keyword=${encodeURIComponent(keyword)}` : "/my-library");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[76px] items-center gap-3 border-b border-black/5 bg-[#fbf9f4]/90 px-4 backdrop-blur-xl md:left-[272px] sm:px-6 lg:px-8">
      <button
        aria-label="Open navigation"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white text-[#1b1c19] shadow-sm md:hidden"
        onClick={onMenuClick}
        type="button"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form className="relative mx-auto w-full max-w-[720px]" onSubmit={handleSearch}>
        <Search
          aria-hidden="true"
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a8784]"
        />
        <input
          aria-label="Search"
          className="h-12 w-full rounded-2xl border border-black/5 bg-white pl-12 pr-4 text-sm font-medium text-[#1b1c19] shadow-sm outline-none transition placeholder:text-[#9a9692] focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10"
          name="keyword"
          placeholder={searchPlaceholder}
          type="search"
        />
      </form>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          aria-label="Create flashcards"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#614db7] text-white shadow-lg shadow-[#614db7]/20 transition hover:-translate-y-0.5 hover:bg-[#49339d]"
          href="/flashcards"
        >
          <Plus className="h-5 w-5" />
        </Link>
        <button
          aria-label="Notifications"
          className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-[#5f5e5e] shadow-sm transition hover:text-[#614db7] sm:flex"
          type="button"
        >
          <Bell className="h-5 w-5" />
        </button>
        {user ? (
          <UserMenu compact user={user} />
        ) : (
          <span className="h-11 w-14 animate-pulse rounded-full bg-[#e8e3dc]" />
        )}
      </div>
    </header>
  );
}
