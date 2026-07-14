"use client";

import { useState, type FormEvent } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import type {
  AdminAcademicDepartment,
  AdminAcademicEntityStatus,
  AdminAcademicSubject,
  PageMeta,
} from "@/services/api";
import {
  getAcademicEntityId,
  SEMESTERS,
} from "../academic.config";
import {
  AcademicInlineError,
  AcademicLoading,
  AcademicPagination,
} from "./AdminAcademicUi";
import { SubjectCard } from "./SubjectCard";

export function SubjectsSection({
  department,
  error,
  isFetching,
  isPending,
  meta,
  onAdd,
  onEdit,
  onPageChange,
  onSearch,
  onSemesterChange,
  onStatusChange,
  onSubjectStatusChange,
  page,
  semester,
  status,
  subjects,
}: {
  department: AdminAcademicDepartment;
  error: unknown;
  isFetching: boolean;
  isPending: boolean;
  meta?: PageMeta;
  onAdd: () => void;
  onEdit: (subject: AdminAcademicSubject) => void;
  onPageChange: (page: number) => void;
  onSearch: (keyword: string) => void;
  onSemesterChange: (semester: number) => void;
  onStatusChange: (status: AdminAcademicEntityStatus) => void;
  onSubjectStatusChange: (subject: AdminAcademicSubject) => void;
  page: number;
  semester: number;
  status: AdminAcademicEntityStatus;
  subjects: AdminAcademicSubject[];
}) {
  const [keywordDraft, setKeywordDraft] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(keywordDraft.trim());
  }

  return (
    <div className="rounded-[30px] border border-black/5 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#614db7]">
            Curriculum
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#1b1c19]">
            Semester {semester}
          </h3>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#614db7] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#4f3d99] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!department.isActive}
          onClick={onAdd}
          type="button"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add subject
        </button>
      </div>

      {!department.isActive ? (
        <div className="mt-5 rounded-2xl bg-[#fff7e8] px-4 py-3 text-sm font-bold text-[#76511a]">
          Restore this department before adding new subjects.
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
        {SEMESTERS.map((item) => (
          <button
            aria-current={semester === item ? "true" : undefined}
            className={`rounded-2xl border px-3 py-3 text-center transition ${
              semester === item
                ? "border-[#614db7] bg-[#e6deff] text-[#311485]"
                : "border-black/5 bg-[#fbf9f4] text-[#6e6a67] hover:border-[#cabeff] hover:bg-[#f6f2ff]"
            }`}
            key={item}
            onClick={() => onSemesterChange(item)}
            type="button"
          >
            <span className="block text-[10px] font-extrabold uppercase">
              Semester
            </span>
            <span className="mt-1 block text-xl font-extrabold">{item}</span>
          </button>
        ))}
      </div>

      <form
        className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_auto]"
        onSubmit={submitSearch}
      >
        <label className="relative block">
          <span className="sr-only">Search subjects</span>
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8784]"
          />
          <input
            className="h-12 w-full rounded-2xl border border-black/10 bg-[#fbf9f4] pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#8f7ce0] focus:bg-white"
            onChange={(event) => setKeywordDraft(event.target.value)}
            placeholder="Search code or subject name"
            value={keywordDraft}
          />
        </label>
        <select
          className="h-12 rounded-2xl border border-black/10 bg-[#fbf9f4] px-4 text-sm font-bold text-[#5f5e5e] outline-none focus:border-[#8f7ce0]"
          onChange={(event) =>
            onStatusChange(event.target.value as AdminAcademicEntityStatus)
          }
          value={status}
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          className="h-12 rounded-2xl bg-[#1b1c19] px-5 text-sm font-extrabold text-white transition hover:bg-[#343530]"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="mt-5">
        {isPending ? (
          <AcademicLoading label="Loading subjects..." />
        ) : error ? (
          <AcademicInlineError error={error} />
        ) : subjects.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#cabeff] bg-[#f6f2ff] p-8 text-center">
            <BookOpen
              aria-hidden="true"
              className="mx-auto h-7 w-7 text-[#614db7]"
            />
            <p className="mt-3 text-sm font-extrabold text-[#311485]">
              No subjects found in semester {semester}.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {subjects.map((subject) => (
              <SubjectCard
                key={
                  getAcademicEntityId(subject) ||
                  `${subject.code}-${subject.semester}`
                }
                onEdit={() => onEdit(subject)}
                onStatusChange={() => onSubjectStatusChange(subject)}
                subject={subject}
              />
            ))}
          </div>
        )}
      </div>

      {meta ? (
        <AcademicPagination
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          isFetching={isFetching}
          itemCount={meta.itemCount}
          onPageChange={onPageChange}
          page={meta.page || page}
          pageCount={meta.pageCount}
        />
      ) : null}
    </div>
  );
}
