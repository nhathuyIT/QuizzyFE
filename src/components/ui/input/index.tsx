import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--black)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-5 py-3 rounded-full border-2 border-black/10",
            "bg-white/60 backdrop-blur-sm text-sm font-medium outline-none",
            "placeholder:text-gray-400",
            "focus:border-[var(--black)] focus:bg-white focus:shadow-md",
            "transition-all duration-200",
            error && "border-[var(--red)] focus:border-[var(--red)]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-gray-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[var(--red)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
