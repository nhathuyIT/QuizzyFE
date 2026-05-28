import { cn } from "@/lib/utils/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--black)] text-[var(--white)] hover:bg-[#333] active:bg-[#000] disabled:opacity-50",
  outline:
    "bg-transparent text-[var(--black)] border-2 border-[var(--black)] hover:bg-[var(--black)] hover:text-[var(--white)]",
  ghost:
    "bg-transparent text-[var(--black)] hover:bg-black/5 active:bg-black/10",
  link: "bg-transparent text-[var(--black)] underline-offset-4 hover:underline p-0",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-full",
  md: "text-sm px-5 py-3 rounded-full",
  lg: "text-base px-8 py-4 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
