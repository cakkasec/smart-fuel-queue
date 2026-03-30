"use client";
import { use, useState } from "react";
import {
  Users, Pause, Play, X, Megaphone, Monitor,
  CheckCircle, SkipForward, Settings, BarChart2, ChevronRight
} from "lucide-react";
import { MOCK_QUEUE_TOKENS, MOCK_STATIONS, FUEL_LABELS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const STATION = MOCK_STATIONS[0];

const t = {
  my: {
    dashboard: "Queue Dashboard",
    nowServing: "ယခု ဆောင်ရွက်နေသည်",
    callNext: "နောက်တစ်ဦး ခေါ်ရန်",
    queue: "တန်းစီနေသူများ",
    noWaiting: "တန်းစီနေသူ မရှိပါ",
    gate: (n: number) => `Gate ${n}`,
    complete: "ပြီးသည်",
    skip: "ကျော်ရန်",
    pause: "ယာယီရပ်ရန်",
    resume: "ဆက်လုပ်ရန်",
    broadcast: "Message ပို့ရန်",
    broadcastPlaceholder: "တန်းစီသူများထံ message...",
    send: "ပို့ရန်",
    totalToday: (n: number) => `ယနေ့ ${n} ဦး`,
    avgWait: (n: number) => `ပျမ်းမျှ ${n} မိနစ်`,
    monitor: "မော်နီတာ",
    analytics: "ဒေတာ",
    fuelSettings: "ဆီ",
    queueSettings: "Setting",
    served: "ဆောင်ရွက်ပြီး",
    waiting: "စောင့်ဆိုင်းနေသည်",
  },
  en: {
    dashboard: "Queue Dashboard",
    nowServing: "Now Serving",
    callNext: "Call Next",
    queue: "Waiting Queue",
    noWaiting: "No one waiting",
    gate: (n: number) => `Gate ${n}`,
    complete: "Done",
    skip: "Skip",
    pause: "Pause",
    resume: "Resume",
    broadcast: "Broadcast",
    broadcastPlaceholder: "Message to all in queue...",
    send: "Send",
    totalToday: (n: number) => `${n} served today`,
    avgWait: (n: number) => `Avg ${n} min wait`,
    monitor: "Monitor",
    analytics: "Analytics",
    fuelSettings: "Fuel",
    queueSettings: "Settings",
    served: "Served",
    waiting: "Waiting",
  },
};

export default function StationDashboardPage({
  params,
}: {
  params: Promise<{ locale: string; stationId: string }>;
}) {
  const { locale } = use(params);
  const isMy = locale === "my";
  const text = isMy ? t.my : t.en;

  const [isPaused, setIsPaused] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [serving, setServing] = useState("A-043");
  const [queue, setQueue] = useState(MOCK_QUEUE_TOKENS.filter((t) => t.status === "waiting"));
  const [callLoading, setCallLoading] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  async function handleCallNext() {
    if (queue.length === 0) return;
    setCallLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const next = queue[0];
    setServing(next.tokenNumber);
    setQueue((prev) => prev.slice(1));
    setCallLoading(false);
  }

  async function handleSendBroadcast() {
    if (!broadcastMsg.trim()) return;
    await new Promise((r) => setTimeout(r, 400));
    setBroadcastSent(true);
    setBroadcastMsg("");
    setTimeout(() => { setShowBroadcast(false); setBroadcastSent(false); }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-surface border-b border-border px-4 pt-10 pb-3 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">{isMy ? STATION.nameMy : STATION.name}</p>
            <h1 className="text-lg font-bold text-foreground">{text.dashboard}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isPaused ? "warning" : "success"} dot>
              {isPaused ? (isMy ? "ယာယီရပ်" : "Paused") : (isMy ? "ဖွင့်ထားသည်" : "Open")}
            </Badge>
          </div>
        </div>

        {/* Stats row */}
        <div className="max-w-2xl mx-auto flex gap-4 mt-3 text-center">
          <div className="flex-1 bg-primary-light rounded-xl py-2">
            <p className="text-lg font-bold text-primary">42</p>
            <p className="text-xs text-muted">{text.served}</p>
          </div>
          <div className="flex-1 bg-amber-50 rounded-xl py-2">
            <p className="text-lg font-bold text-accent">{queue.length}</p>
            <p className="text-xs text-muted">{text.waiting}</p>
          </div>
          <div className="flex-1 bg-gray-100 rounded-xl py-2">
            <p className="text-lg font-bold text-foreground">8</p>
            <p className="text-xs text-muted">{isMy ? "မိနစ် ပျမ်းမျှ" : "min avg"}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Now serving */}
        <Card className="p-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">{text.nowServing}</p>
          <div className="flex items-center justify-between">
            <div className="w-28 h-28 bg-primary rounded-2xl flex items-center justify-center">
              <p className="text-4xl font-black text-white">{serving}</p>
            </div>
            <div className="flex flex-col gap-2 flex-1 ml-4">
              <Button
                fullWidth
                size="lg"
                loading={callLoading}
                disabled={queue.length === 0}
                onClick={handleCallNext}
              >
                {text.callNext} →
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" fullWidth>
                  <CheckCircle size={14} />
                  {text.complete}
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <SkipForward size={14} />
                  {text.skip}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
              isPaused
                ? "border-success bg-success-light text-success"
                : "border-warning bg-warning-light text-warning"
            }`}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? text.resume : text.pause}
          </button>
          <button
            onClick={() => setShowBroadcast(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 border-border bg-surface text-foreground hover:bg-gray-50 transition-all"
          >
            <Megaphone size={16} />
            {text.broadcast}
          </button>
        </div>

        {/* Waiting queue */}
        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted" />
              <p className="font-bold text-foreground text-sm">{text.queue}</p>
            </div>
            <Badge variant="neutral">{queue.length}</Badge>
          </div>
          {queue.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted text-sm">{text.noWaiting}</div>
          ) : (
            <div className="divide-y divide-border">
              {queue.map((token, i) => (
                <div key={token.id} className="px-4 py-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    i === 0 ? "bg-primary text-white" : "bg-gray-100 text-muted"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{token.tokenNumber}</p>
                    <p className="text-xs text-muted">
                      {isMy ? FUEL_LABELS[token.fuelType].my : FUEL_LABELS[token.fuelType].en}
                      {" · ~"}{token.waitMinutes}{isMy ? " မိနစ်" : " min"}
                    </p>
                  </div>
                  {i === 0 && (
                    <Badge variant="warning" dot>{isMy ? "နောက်" : "Next"}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick nav */}
        <Card>
          {[
            { icon: Monitor, label: text.monitor, href: `/${locale}/station/${STATION.id}/monitor` },
            { icon: BarChart2, label: text.analytics, href: "#" },
            { icon: Settings, label: text.queueSettings, href: "#" },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 border-b border-border last:border-0 transition-colors"
            >
              <Icon size={16} className="text-muted" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight size={14} className="text-muted" />
            </a>
          ))}
        </Card>
      </div>

      {/* Broadcast modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-surface w-full max-w-lg mx-auto rounded-t-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-foreground">{text.broadcast}</p>
              <button onClick={() => setShowBroadcast(false)}>
                <X size={20} className="text-muted" />
              </button>
            </div>
            {broadcastSent ? (
              <div className="text-center py-4">
                <p className="text-4xl mb-2">✅</p>
                <p className="font-semibold text-success">{isMy ? "Message ပို့ပြီး" : "Message sent!"}</p>
              </div>
            ) : (
              <>
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder={text.broadcastPlaceholder}
                  rows={3}
                  className="w-full border border-border rounded-xl p-3 text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <Button fullWidth onClick={handleSendBroadcast} disabled={!broadcastMsg.trim()}>
                  <Megaphone size={16} />
                  {text.send}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
