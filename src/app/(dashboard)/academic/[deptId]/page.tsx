"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpenText,
  ChevronRight,
  Layers3,
  Loader2,
} from "lucide-react";
import { academicApi } from "@/services/api";
import {
  getSemesterDocumentCount,
  resolveDepartment,
  semesters,
} from "@/features/academic/utils";

export default function AcademicDepartmentPage() {
  const { deptId } = useParams<{ deptId: string }>();
  const departmentsQuery = useQuery({
    queryKey: ["academic", "departments"],
    queryFn: () => academicApi.getDepartments(),
  });

  const departments = departmentsQuery.data?.data ?? [];
  const department = resolveDepartment(departments, deptId);
  const subjectsQuery = useQuery({
    queryKey: ["academic", "subjects", department?._id],
    queryFn: () => academicApi.getSubjectsByDepartment(department!._id),
    enabled: Boolean(department?._id),
  });

  const subjects = subjectsQuery.data?.data ?? [];
  const semesterCounts = semesters.map((semester) =>
    getSemesterDocumentCount(subjects, semester),
  );
  const maxCount = Math.max(1, ...semesterCounts);

  if (departmentsQuery.isLoading) return <PageLoading />;

  if (departmentsQuery.isError) {
    return <PageError message={departmentsQuery.error.message} />;
  }

  if (!department) {
    return <PageError message="Department not found." />;
  }

  return (
    <div className="h-full overflow-y-auto bg-[#fbf9f4] custom-scrollbar">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-[#777474]"
          href="/academic"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to departments
        </Link>

        <header className="mt-6 flex flex-col gap-5 rounded-[30px] bg-white p-6 shadow-[0_12px_36px_rgba(27,28,25,0.05)] sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#614db7]">
              {department.code} department
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
              {department.name}
            </h1>
            <p className="mt-3 max-w-[680px] text-sm leading-6 text-[#777474]">
              Choose a semester to view subjects and academic documents.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Stat label="Semesters" value="9" />
            <Stat label="Subjects" value={String(subjects.length)} />
            <Stat
              label="Documents"
              value={String(
                subjects.reduce(
                  (total, subject) => total + subject.documentCount,
                  0,
                ),
              )}
            />
          </div>
        </header>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-normal">
                Select semester
              </h2>
              <p className="mt-1 text-sm text-[#777474]">
                Document counts are summed from all subjects in each semester.
              </p>
            </div>
            {subjectsQuery.isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-[#614db7]" />
            )}
          </div>

          {subjectsQuery.isError ? (
            <div className="rounded-[24px] bg-[#fff0f0] p-6 text-sm font-bold text-[#a33a3a]">
              {subjectsQuery.error.message}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {semesters.map((semester, index) => (
                <SemesterCard
                  count={semesterCounts[index]}
                  departmentCode={department.code}
                  key={semester}
                  maxCount={maxCount}
                  semester={semester}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SemesterCard({
  count,
  departmentCode,
  maxCount,
  semester,
}: {
  count: number;
  departmentCode: string;
  maxCount: number;
  semester: number;
}) {
  const progress = Math.round((count / maxCount) * 100);

  return (
    <Link
      className="group rounded-[26px] border border-black/5 bg-white p-5 shadow-[0_12px_36px_rgba(27,28,25,0.05)] transition hover:-translate-y-1 hover:border-[#cabeff] hover:shadow-[0_18px_44px_rgba(49,20,133,0.09)]"
      href={`/academic/${departmentCode}/${semester}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2eefe] text-[#614db7]">
          <Layers3 className="h-6 w-6" />
        </span>
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full p-1"
          style={{
            background: `conic-gradient(#614db7 ${progress * 3.6}deg, #eee9e2 0deg)`,
          }}
        >
          <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-extrabold text-[#614db7]">
            {progress}%
          </span>
        </span>
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-normal">
        Semester {semester}
      </h3>
      <p className="mt-2 text-sm text-[#777474]">
        {count} uploaded {count === 1 ? "document" : "documents"}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-[#777474]">
          <BookOpenText className="h-4 w-4" />
          Browse subjects
        </span>
        <ChevronRight className="h-5 w-5 text-[#aaa5a0] transition group-hover:translate-x-1 group-hover:text-[#614db7]" />
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6f3ee] px-4 py-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#9a9692]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-[#1b1c19]">{value}</p>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-[#614db7]" />
    </div>
  );
}

function PageError({ message }: { message: string }) {
  return (
    <div className="p-8">
      <div className="rounded-[24px] bg-[#fff0f0] p-6 font-bold text-[#a33a3a]">
        {message}
      </div>
    </div>
  );
}
