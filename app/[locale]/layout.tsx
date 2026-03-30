import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "Smart Fuel Queue — ဆီတန်းစီ App",
  description: "အိမ်မှ ဆီဆိုင် တန်းစီပါ",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "my" | "en")) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale} className="h-full">
      <body className="h-full bg-background">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
