"use client";

import { useQuery } from "@tanstack/react-query";
import {
  adminAPI,
  type AdminAcademicDocument,
} from "@/services/api";
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

  const userQuery = useQuery({
    queryKey: ["admin", "users", "uploader-email", uploaderId],
    queryFn: () => adminAPI.getUser(uploaderId),
    enabled: Boolean(uploaderId && !embeddedEmail),
    retry: false,
  });

  if (embeddedEmail) return embeddedEmail;
  if (userQuery.isPending && uploaderId) return "Loading email...";
  return userQuery.data?.data.email || "Email unavailable";
}
