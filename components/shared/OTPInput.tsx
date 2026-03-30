"use client";
import { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { clsx } from "clsx";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OTPInput({ value, onChange, error }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    onChange(newDigits.join("").replace(/\s/g, ""));
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      onChange(newDigits.join("").replace(/\s/g, ""));
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={clsx(
              "w-11 h-14 text-center text-xl font-bold rounded-xl border-2 bg-surface transition-all focus:outline-none focus:ring-2",
              error
                ? "border-danger focus:ring-danger/30 text-danger"
                : digits[i]
                  ? "border-primary text-primary focus:ring-primary/30"
                  : "border-border text-foreground focus:ring-primary/30 focus:border-primary"
            )}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs text-danger font-medium">{error}</p>
      )}
    </div>
  );
}
