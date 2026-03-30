"use client";
import { forwardRef } from "react";
import { clsx } from "clsx";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, error, placeholder = "09XXXXXXXXX", label }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/\D/g, "");
      onChange(raw);
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="flex items-center gap-0 border border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all bg-surface">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-r border-border shrink-0">
            <span className="text-lg">🇲🇲</span>
            <span className="text-sm font-semibold text-muted">+95</span>
          </div>
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={11}
            className="flex-1 py-3 px-4 text-foreground placeholder-muted bg-transparent focus:outline-none text-base"
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";
