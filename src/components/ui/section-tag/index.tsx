import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type SectionTagSize = "sm" | "md";

interface SectionTagProps {
  children: ReactNode;
  size?: SectionTagSize;
  light?: boolean;
  className?: string;
}

export function SectionTag({
  children,
  size = "sm",
  light = false,
  className,
}: SectionTagProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-widest uppercase",
        size === "sm" ? "text-xs" : "text-sm",
        light ? "text-white" : "text-[var(--black)]",
        "opacity-50",
        className
      )}
    >
      <span
        className={cn(
          "block w-5 h-0.5",
          light ? "bg-white" : "bg-current"
        )}
      />
      {children}
    </div>
  );
}
