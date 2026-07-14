export type CardInputMode = "manual" | "bulk" | "upload";

export interface ManualCardDraft {
  front: string;
  back: string;
  hint: string;
  explanation: string;
  examples: string;
}

export type ManualCardField = keyof ManualCardDraft;

export interface StatusMessage {
  text: string;
  type: "" | "error" | "pending" | "success";
}
