"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, User, MapPin } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "home", icon: Home, labelMy: "ပင်မ", labelEn: "Home" },
  { href: "history", icon: Clock, labelMy: "မှတ်တမ်း", labelEn: "History" },
  { href: "profile", icon: User, labelMy: "ကျွန်ုပ်", labelEn: "Profile" },
];

export function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const isMy = locale === "my";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-pb z-40">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ href, icon: Icon, labelMy, labelEn }) => {
          const fullHref = `/${locale}/${href}`;
          const isActive = pathname.includes(`/${href}`);
          return (
            <Link
              key={href}
              href={fullHref}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              )}
            >
              <Icon
                size={22}
                className={clsx(isActive && "stroke-primary")}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span>{isMy ? labelMy : labelEn}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
