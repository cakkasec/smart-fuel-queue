"use client";
import { clsx } from "clsx";
import { forwardRef } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 flex items-center text-muted pointer-events-none">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              "w-full bg-surface border rounded-xl py-3 text-foreground placeholder-muted transition-colors focus:outline-none focus:ring-2",
              prefix ? "pl-16 pr-4" : "px-4",
              suffix ? "pr-12" : "",
              error
                ? "border-danger focus:ring-danger/30"
                : "border-border focus:ring-primary/30 focus:border-primary",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 flex items-center text-muted">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
