import { BottomNav } from "@/components/shared/BottomNav";

export default async function DriverLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-background pb-20">
      {children}
      <BottomNav locale={locale} />
    </div>
  );
}
