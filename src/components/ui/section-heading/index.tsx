import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  children,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "font-[var(--font-syne)] font-extrabold tracking-tight text-[var(--black)]",
        "leading-none",
        className
      )}
      style={{
        fontSize: "clamp(36px, 5vw, 72px)",
        letterSpacing: "-3px",
      }}
    >
      {children}
    </Tag>
  );
}
