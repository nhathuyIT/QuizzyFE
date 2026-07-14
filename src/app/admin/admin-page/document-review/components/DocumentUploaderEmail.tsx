import type { AdminAcademicDocument } from "@/services/api";
import { getDocumentEntityId } from "../document-review.config";

export function DocumentUploaderEmail({
  uploader,
}: {
  uploader: AdminAcademicDocument["uploadedBy"];
}) {
  const embeddedEmail =
    typeof uploader === "string" ? "" : uploader.email?.trim() ?? "";
  const uploaderId =
    typeof uploader === "string" ? uploader : getDocumentEntityId(uploader);

  if (embeddedEmail) return embeddedEmail;
  if (typeof uploader !== "string" && uploader.name?.trim()) {
    return uploader.name.trim();
  }
  return uploaderId || "Uploader unavailable";
}

