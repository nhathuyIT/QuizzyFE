import { supabase } from "./supabase";
import type { FileType } from "@/types/academic.type";

export const BUCKET_NAME = "academic-documents";

export interface UploadResult {
  fileUrl: string;
  storagePath: string;
}

export function detectFileType(fileName: string): FileType {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
      return "docx";
    case "ppt":
    case "pptx":
      return "pptx";
    case "xls":
    case "xlsx":
      return "xlsx";
    default:
      return "other";
  }
}

export async function uploadToSupabaseStorage(
  file: File,
  deptCode: string,
  semester: number,
  subjectCode: string,
): Promise<UploadResult> {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const storagePath = `documents/${deptCode}/${semester}/${subjectCode}/${timestamp}_${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return {
    fileUrl: urlData.publicUrl,
    storagePath: data.path,
  };
}
