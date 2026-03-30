"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Clock, MapPin, Fuel } from "lucide-react";
import { MOCK_STATIONS, FUEL_LABELS, type FuelType } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const t = {
  my: {
    nowServing: "ယခု ဆောင်ရွက်နေသည်",
    waiting: "ဦး တန်းစီနေသည်",
    waitTime: "ခန့်မှန်း",
    minutes: "မိနစ် စောင့်ရမည်",
    fuelType: "ဆီအမျိုးအစားရွေးပါ",
    liters: "လိုချင်သော ဆီပမာဏ (လီတာ)",
    litersHint: "ရွေးချယ်ရန် (မဖြစ်မနေမဟုတ်)",
    joinQueue: "Queue ထဲဝင်ရန်",
    available: "ရရှိနိုင်သည်",
    unavailable: "မရရှိနိုင်ပါ",
    closed: "ယနေ့ Queue ပိတ်ပြီး",
    paused: "ယာယီရပ်ဆိုင်းထားသည်",
    alreadyQueued: "ဤဆိုင်တွင် Token ရပြီးဖြစ်သည်",
    selectFuel: "ဆီအမျိုးအစား ရွေးပါ",
  },
  en: {
    nowServing: "Now Serving",
    waiting: "waiting",
    waitTime: "~",
    minutes: " min wait",
    fuelType: "Select Fuel Type",
    liters: "Amount needed (liters)",
    litersHint: "Optional",
    joinQueue: "Join Queue",
    available: "Available",
    unavailable: "Unavailable",
    closed: "Queue closed for today",
    paused: "Queue temporarily paused",
    alreadyQueued: "You already have a token here",
    selectFuel: "Please select a fuel type",
  },
};

export default function StationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; stationId: string }>;
}) {
  const { locale, stationId } = use(params);
  const isMy = locale === "my";
  const text = isMy ? t.my : t.en;
  const router = useRouter();

  const station = MOCK_STATIONS.find((s) => s.id === stationId) ?? MOCK_STATIONS[0];
  const [selectedFuel, setSelectedFuel] = useState<FuelType | null>(null);
  const [liters, setLiters] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const name = isMy ? station.nameMy : station.name;
  const address = isMy ? station.addressMy : station.address;
  const isOpen = station.status === "open";

  async function handleJoin() {
    if (!selectedFuel) { setError(text.selectFuel); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push(`/${locale}/token/t1`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 mb-3"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-foreground leading-tight">{name}</h1>
        <div className="flex items-center gap-1.5 mt-1 text-muted text-sm">
          <MapPin size={12} />
          <span>{address}</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Live queue status */}
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted mb-1">{text.nowServing}</p>
              <p className="text-2xl font-bold text-primary">{station.currentServing}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">{isMy ? "တန်းစီနေသူ" : "Waiting"}</p>
              <p className="text-2xl font-bold text-foreground">{station.queueLength}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">{isMy ? "ခန့်မှန်း" : "Est. Wait"}</p>
              <p className="text-2xl font-bold text-foreground">
                {station.estimatedWaitMinutes > 0
                  ? `${station.estimatedWaitMinutes}`
                  : "-"}
              </p>
              {station.estimatedWaitMinutes > 0 && (
                <p className="text-xs text-muted">{isMy ? "မိနစ်" : "min"}</p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>{isMy ? "Queue ပြည့်မှ" : "Queue capacity"}</span>
              <span>{station.queueLength}/{station.maxCapacity}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(station.queueLength / station.maxCapacity) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Status alert */}
        {station.status === "paused" && (
          <div className="bg-warning-light border border-warning/20 rounded-2xl p-4 flex gap-3">
            <span className="text-xl">⏸</span>
            <div>
              <p className="font-semibold text-warning text-sm">{text.paused}</p>
              {station.pauseReason && (
                <p className="text-xs text-warning/80 mt-0.5">{station.pauseReason}</p>
              )}
            </div>
          </div>
        )}
        {station.status === "closed" && (
          <div className="bg-danger-light border border-danger/20 rounded-2xl p-4 flex gap-3">
            <span className="text-xl">🔒</span>
            <p className="font-semibold text-danger text-sm">{text.closed}</p>
          </div>
        )}

        {/* Fuel availability */}
        <Card className="p-4">
          <p className="text-sm font-bold text-foreground mb-3">{text.fuelType}</p>
          <div className="space-y-2">
            {station.fuels.map((fuel) => (
              <button
                key={fuel.type}
                onClick={() => fuel.available && isOpen && setSelectedFuel(fuel.type)}
                disabled={!fuel.available || !isOpen}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  selectedFuel === fuel.type
                    ? "border-primary bg-primary-light"
                    : fuel.available && isOpen
                      ? "border-border hover:border-primary/50 hover:bg-gray-50"
                      : "border-border opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Fuel
                    size={18}
                    className={selectedFuel === fuel.type ? "text-primary" : "text-muted"}
                  />
                  <span className={`font-semibold text-sm ${selectedFuel === fuel.type ? "text-primary" : "text-foreground"}`}>
                    {isMy ? FUEL_LABELS[fuel.type].my : FUEL_LABELS[fuel.type].en}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted font-medium">
                    {fuel.price.toLocaleString()} {isMy ? "ကျပ်" : "MMK"}
                  </span>
                  <Badge variant={fuel.available ? "success" : "danger"}>
                    {fuel.available ? text.available : text.unavailable}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Liters input */}
        {selectedFuel && isOpen && (
          <Card className="p-4">
            <label className="block text-sm font-bold text-foreground mb-2">
              {text.liters}
            </label>
            <div className="relative">
              <input
                type="number"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                placeholder={text.litersHint}
                className="w-full border border-border rounded-xl py-3 px-4 text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
                {isMy ? "လီတာ" : "L"}
              </span>
            </div>
          </Card>
        )}

        {error && <p className="text-sm text-danger font-medium text-center">{error}</p>}

        {/* Join button */}
        <div className="pt-2">
          <Button
            fullWidth
            size="lg"
            loading={loading}
            disabled={!isOpen}
            onClick={handleJoin}
          >
            {isOpen ? text.joinQueue : (station.status === "closed" ? text.closed : text.paused)}
          </Button>
        </div>
      </div>
    </div>
  );
}
