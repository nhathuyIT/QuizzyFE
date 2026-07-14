"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpenCheck, Bot, Code2, Loader2 } from "lucide-react";
import { academicApi } from "@/services/api";
import type { Department } from "@/types/academic.type";

const departmentThemes: Record<
  Department["code"],
  {
    accent: string;
    description: string;
    icon: typeof Bot;
    panel: string;
  }
> = {
  AI: {
    accent: "text-[#614db7]",
    description:
      "Artificial Intelligence subjects, references, and shared course files.",
    icon: Bot,
    panel: "bg-[#e6deff]",
  },
  SE: {
    accent: "text-[#276345]",
    description:
      "Software Engineering syllabi, assignments, slides, and study documents.",
    icon: Code2,
    panel: "bg-[#d7f2e3]",
  },
};

export default function AcademicPage() {
  const departmentsQuery = useQuery({
    queryKey: ["academic", "departments"],
    queryFn: () => academicApi.getDepartments(),
  });

  const departments = (departmentsQuery.data?.data ?? []).filter(
    (department) => department.isActive,
  );

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-[32px] bg-[#1b1c19] p-7 text-white shadow-[0_20px_60px_rgba(27,28,25,0.16)] sm:p-9">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#cabeff]">
                <BookOpenCheck className="h-4 w-4" />
                Academic documents
              </p>
              <h1 className="text-3xl font-bold tracking-normal sm:text-5xl">
                Choose your major library.
              </h1>
            </div>
          </div>
        </header>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">
                Departments
              </h2>
              <p className="mt-1 text-sm text-[#777474]">
                Select AI or SE to continue to semester navigation.
              </p>
            </div>
          </div>

          {departmentsQuery.isLoading ? (
            <div className="flex min-h-60 items-center justify-center rounded-[28px] bg-white">
              <Loader2 className="h-7 w-7 animate-spin text-[#614db7]" />
            </div>
          ) : departmentsQuery.isError ? (
            <div className="rounded-[24px] bg-[#fff0f0] p-6 text-sm font-bold text-[#a33a3a]">
              {departmentsQuery.error.message}
            </div>
          ) : departments.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {departments.map((department) => (
                <DepartmentCard department={department} key={department._id} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#bbaef0] bg-[#f6f2ff] px-6 py-14 text-center">
              <BookOpenCheck className="mx-auto h-10 w-10 text-[#614db7]" />
              <h3 className="mt-4 text-xl font-bold">No departments yet</h3>
              <p className="mt-2 text-sm text-[#777474]">
                Active departments from the backend will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function DepartmentCard({ department }: { department: Department }) {
  const theme = departmentThemes[department.code] ?? departmentThemes.AI;
  const Icon = theme.icon;

  return (
    <Link
      className="group rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_12px_36px_rgba(27,28,25,0.05)] transition hover:-translate-y-1 hover:border-[#cabeff] hover:shadow-[0_18px_44px_rgba(49,20,133,0.09)]"
      href={`/academic/${department.code}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${theme.panel} ${theme.accent}`}
        >
          <Icon className="h-7 w-7" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f6f3ee] px-3 py-1.5 text-xs font-extrabold text-[#777474]">
          {department.code}
        </span>
      </div>
      <h3 className="mt-6 text-2xl font-bold tracking-normal text-[#1b1c19]">
        {department.name}
      </h3>
      <p className="mt-3 min-h-12 text-sm leading-6 text-[#777474]">
        {department.description || theme.description}
      </p>
      <div className="mt-7 flex items-center justify-between border-t border-black/5 pt-5">
        <span className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#9a9692]">
          9 semesters
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#614db7]">
          Open
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
