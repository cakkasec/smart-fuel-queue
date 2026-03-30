import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  pressable?: boolean;
}

export function Card({ children, className, onClick, pressable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          "bg-surface rounded-2xl shadow-sm border border-border",
          pressable && "cursor-pointer active:scale-[0.98] transition-transform duration-100 hover:shadow-md",
          className
        )
      )}
    >
      {children}
    </div>
  );
}
