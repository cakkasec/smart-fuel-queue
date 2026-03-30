import { MapPin, Search } from "lucide-react";
import { MOCK_STATIONS } from "@/lib/mock-data";
import { StationCard } from "@/components/driver/StationCard";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

const t = {
  my: {
    title: "ဆီဆိုင်များ",
    subtitle: "နီးနားဆုံး ဆီဆိုင်များ",
    location: "ရန်ကုန်မြို့",
    search: "ဆီဆိုင် ရှာရန်...",
    activeToken: "သင့် Token",
    viewToken: "ကြည့်ရန်",
  },
  en: {
    title: "Fuel Stations",
    subtitle: "Nearby stations",
    location: "Yangon",
    search: "Search stations...",
    activeToken: "Your Token",
    viewToken: "View",
  },
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isMy = locale === "my";
  const text = isMy ? t.my : t.en;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background z-30 px-4 pt-12 pb-3">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-muted text-sm mb-0.5">
              <MapPin size={13} />
              <span>{text.location}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          </div>
          <LanguageToggle locale={locale} />
        </div>
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={text.search}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* Active token banner */}
      <div className="px-4 py-3">
        <div className="bg-primary rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-primary-light text-xs font-medium">{text.activeToken}</p>
            <p className="text-white text-2xl font-bold">A-055</p>
            <p className="text-primary-light text-xs mt-0.5">
              {isMy ? "ရွှေမိုး ဆီဆိုင် • ၁၂ ဦးနောက်" : "Shwe Moe Petrol • 12 ahead"}
            </p>
          </div>
          <a
            href={`/${locale}/token/t1`}
            className="bg-white text-primary text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-light transition-colors"
          >
            {text.viewToken}
          </a>
        </div>
      </div>

      {/* Station list */}
      <div className="px-4 pb-4 space-y-3">
        <p className="text-xs font-semibold text-muted uppercase tracking-wide">{text.subtitle}</p>
        {MOCK_STATIONS.map((station) => (
          <StationCard key={station.id} station={station} locale={locale} />
        ))}
      </div>
    </div>
  );
}
