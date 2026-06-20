import { CheckCircle2, XCircle } from "lucide-react";
import type { ResultState } from "../types";

export function ResultMark({ result }: { result: ResultState }) {
  if (result === "correct") return <CheckCircle2 className="h-5 w-5 shrink-0" />;
  if (result === "wrong") return <XCircle className="h-5 w-5 shrink-0" />;
  return <span className="h-5 w-5 shrink-0" />;
}
