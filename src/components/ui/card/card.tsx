import { cn } from "@/lib/utils/cn";
import { forwardRef, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "light" | "purple" | "pink" | "teal" | "blue" | "yellow";
  interactive?: boolean;
}

const variantClasses: Record<string, string> = {
  default: "bg-white border border-gray-100",
  dark: "bg-[var(--black)] text-white",
  light: "bg-[#f0f0f0] border border-[#e0e0e0]",
  purple: "bg-[var(--purple)]",
  pink: "bg-[var(--pink-bg)]",
  teal: "bg-[var(--teal)] text-[var(--black)]",
  blue: "bg-[var(--blue)]",
  yellow: "bg-[var(--yellow)]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", interactive = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--card-radius)] p-8",
          variantClasses[variant] ?? variantClasses.default,
          interactive && "transition-transform duration-200 hover:-translate-y-1 cursor-default",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
