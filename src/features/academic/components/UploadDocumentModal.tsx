"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  FileUp,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { academicApi } from "@/services/api";
import { detectFileType, uploadToSupabaseStorage } from "@/lib/supabase-upload";
import { formatFileSize } from "@/features/academic/utils";
import type { Subject } from "@/types/academic.type";

type UploadProgress = "idle" | "uploading" | "saving" | "success" | "error";

interface UploadDocumentModalProps {
  deptCode: string;
  semester: number;
  subject: Subject;
  onClose: () => void;
}

const maxFileSize = 10 * 1024 * 1024;

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function UploadDocumentModal({
  deptCode,
  semester,
  subject,
  onClose,
}: UploadDocumentModalProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploadProgress, setUploadProgress] =
    useState<UploadProgress>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isBusy =
    uploadProgress === "uploading" || uploadProgress === "saving";

  const saveMetadataMutation = useMutation({
    mutationFn: academicApi.createDocumentMetadata,
    onSuccess: () => {
      setUploadProgress("success");
      queryClient.invalidateQueries({
        queryKey: ["academic", "documents", subject._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["academic", "documents", "my"],
      });
      queryClient.invalidateQueries({
        queryKey: ["academic", "subjects", subject.departmentId],
      });
      window.setTimeout(onClose, 1400);
    },
    onError: (error) => {
      setUploadProgress("error");
      setErrorMessage(
        getErrorMessage(error, "Failed to save document metadata."),
      );
    },
  });

  function pickFile(nextFile: File) {
    if (nextFile.size > maxFileSize) {
      setUploadProgress("error");
      setErrorMessage("File size must be 10MB or less.");
      return;
    }

    setFile(nextFile);
    setUploadProgress("idle");
    setErrorMessage("");

    if (!title.trim()) {
      setTitle(nextFile.name.split(".").slice(0, -1).join(".") || nextFile.name);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) pickFile(selectedFile);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) pickFile(droppedFile);
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !title.trim() || isBusy) return;

    try {
      setUploadProgress("uploading");
      setErrorMessage("");

      const { fileUrl, storagePath } = await uploadToSupabaseStorage(
        file,
        deptCode,
        semester,
        subject.code,
      );

      setUploadProgress("saving");
      saveMetadataMutation.mutate({
        title: title.trim(),
        description: description.trim() || undefined,
        subjectId: subject._id,
        fileUrl,
        fileName: file.name,
        fileType: detectFileType(file.name),
        fileSize: file.size,
        storagePath,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
    } catch (error) {
      setUploadProgress("error");
      setErrorMessage(
        getErrorMessage(error, "Upload to storage failed."),
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1c19]/55 p-4 backdrop-blur-sm">
      <form
        className="w-full max-w-[560px] rounded-[28px] border border-black/10 bg-white p-6 text-[#1b1c19] shadow-[0_24px_80px_rgba(27,28,25,0.22)]"
        onSubmit={handleUpload}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#614db7]">
              {subject.code} document
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-normal">
              Upload academic document
            </h2>
            <p className="mt-2 max-w-[420px] text-sm font-medium leading-6 text-[#777474]">
              Submitted files go into review first. They appear in the shared
              list after approval.
            </p>
          </div>
          <button
            aria-label="Close upload dialog"
            className="rounded-full p-2 text-[#777474] transition hover:bg-[#f6f3ee] hover:text-[#1b1c19]"
            disabled={isBusy}
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {uploadProgress === "success" ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#2f9f61]" />
            <p className="mt-4 text-lg font-bold">Submitted for review</p>
            <p className="mt-2 text-sm text-[#777474]">
              You can track it under your uploads while it waits for approval.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-[#5f5e5e]">
                Document title
              </span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#f8f5ff] px-4 text-sm font-semibold outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a clear title"
                value={title}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#5f5e5e]">
                Description
              </span>
              <textarea
                className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-black/10 bg-[#f8f5ff] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional notes about this file"
                value={description}
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#5f5e5e]">
                Tags
              </span>
              <input
                className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-[#f8f5ff] px-4 text-sm font-semibold outline-none transition focus:border-[#9b87f5] focus:ring-4 focus:ring-[#9b87f5]/10"
                onChange={(event) => setTags(event.target.value)}
                placeholder="exam, slides, assignment"
                value={tags}
              />
            </label>

            <input
              className="hidden"
              onChange={handleFileChange}
              ref={inputRef}
              type="file"
            />
            <button
              className="flex w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#cabeff] bg-[#fbf9f4] px-5 py-7 text-center transition hover:border-[#614db7] hover:bg-[#f6f2ff]"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              type="button"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6deff] text-[#614db7]">
                {file ? (
                  <FileUp className="h-7 w-7" />
                ) : (
                  <UploadCloud className="h-7 w-7" />
                )}
              </span>
              {file ? (
                <>
                  <span className="mt-4 max-w-full truncate text-sm font-extrabold text-[#311485]">
                    {file.name}
                  </span>
                  <span className="mt-1 text-xs font-bold text-[#777474]">
                    {formatFileSize(file.size)}
                  </span>
                </>
              ) : (
                <>
                  <span className="mt-4 text-sm font-extrabold text-[#311485]">
                    Click to select or drag a file here
                  </span>
                  <span className="mt-1 text-xs font-bold text-[#777474]">
                    PDF, DOCX, PPTX, XLSX, or other files up to 10MB
                  </span>
                </>
              )}
            </button>

            {uploadProgress === "error" && (
              <p className="flex items-start gap-2 rounded-2xl bg-[#fff0f0] px-4 py-3 text-sm font-bold text-[#a33a3a]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="rounded-full px-5 py-3 text-sm font-bold text-[#777474] transition hover:bg-[#f6f3ee] disabled:opacity-50"
                disabled={isBusy}
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-[#614db7] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#614db7]/20 transition hover:-translate-y-0.5 hover:bg-[#49339d] disabled:translate-y-0 disabled:bg-[#d8d1ca] disabled:shadow-none"
                disabled={!file || !title.trim() || isBusy}
                type="submit"
              >
                {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploadProgress === "uploading" && "Uploading file"}
                {uploadProgress === "saving" && "Submitting for review"}
                {uploadProgress === "idle" && "Submit for review"}
                {uploadProgress === "error" && "Try again"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
