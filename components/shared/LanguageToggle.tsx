"use client";
import { useRouter, usePathname } from "next/navigation";
import { clsx } from "clsx";

export function LanguageToggle({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
      {(["my", "en"] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={clsx(
            "px-3 py-1 rounded-full text-sm font-semibold transition-all",
            locale === loc
              ? "bg-surface text-primary shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          {loc === "my" ? "မြန်မာ" : "EN"}
        </button>
      ))}
    </div>
  );
}
