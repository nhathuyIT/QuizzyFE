import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "filled" | "outline";
type BadgeColor = "default" | "purple" | "dark" | "blue" | "yellow" | "green" | "red";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  default: "bg-[#e8e3ff] text-[var(--black)]",
  purple: "bg-[var(--purple)] text-white",
  dark: "bg-[var(--yellow)] text-[var(--black)]",
  blue: "bg-[var(--black)] text-white",
  yellow: "bg-[var(--yellow)] text-[var(--black)]",
  green: "bg-[var(--success)] text-white",
  red: "bg-[var(--red)] text-white",
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "",
  filled: "",
  outline: "border-2 border-current bg-transparent",
};

export function Badge({
  children,
  variant = "default",
  color = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide",
        colorClasses[color],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
