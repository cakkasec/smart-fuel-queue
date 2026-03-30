"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Share2, X, MapPin, Fuel } from "lucide-react";
import { MOCK_TOKEN, FUEL_LABELS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const t = {
  my: {
    title: "သင့် Token",
    position: (pos: number) => `${pos} ဦး နောက်မှာ ရောက်မည်`,
    estimatedTime: "ခန့်မှန်း ရောက်မည့်ချိန်",
    waitingStatus: "စောင့်ဆိုင်းနေသည်",
    notifyMe: "Notification ဖွင့်ရန်",
    cancelToken: "Token ပယ်ဖျက်ရန်",
    cancelConfirm: "Token ကို ပယ်ဖျက်မည်မှာ သေချာပါသလား?",
    cancelYes: "ဟုတ်ကဲ့ ပယ်ဖျက်ပါ",
    cancelNo: "မပယ်ဖျက်တော့ပါ",
    station: "ဆီဆိုင်",
    fuelType: "ဆီအမျိုးအစား",
    joinedAt: "Queue ဝင်ချိန်",
    notifyDesc: "မိနစ် ၃၀ အလို Push Notification ရမည်",
    queueAt: "Queue ထဲ ရောက်နေသည်",
    calledTitle: "သင့်အလှည့် ရောက်ပြီ!",
    calledDesc: (gate: number) => `Gate ${gate} သို့ ချက်ချင်း လာပါ`,
  },
  en: {
    title: "Your Token",
    position: (pos: number) => `${pos} people ahead`,
    estimatedTime: "Estimated call time",
    waitingStatus: "Waiting",
    notifyMe: "Enable Notifications",
    cancelToken: "Cancel Token",
    cancelConfirm: "Are you sure you want to cancel?",
    cancelYes: "Yes, Cancel",
    cancelNo: "Keep Token",
    station: "Station",
    fuelType: "Fuel Type",
    joinedAt: "Joined at",
    notifyDesc: "Get a push notification 30 min before your turn",
    queueAt: "In queue at",
    calledTitle: "Your turn is here!",
    calledDesc: (gate: number) => `Please come to Gate ${gate} now`,
  },
};

function formatTime(isoString: string, isMy: boolean) {
  const d = new Date(isoString);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export default function TokenPage({
  params,
}: {
  params: Promise<{ locale: string; tokenId: string }>;
}) {
  const { locale } = use(params);
  const isMy = locale === "my";
  const text = isMy ? t.my : t.en;
  const router = useRouter();
  const token = MOCK_TOKEN;

  const [showCancel, setShowCancel] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const stationName = isMy ? token.stationNameMy : token.stationName;
  const fuelLabel = isMy ? FUEL_LABELS[token.fuelType].my : FUEL_LABELS[token.fuelType].en;
  const progress = Math.max(0, 100 - (token.position / token.totalInQueue) * 100);

  const isCalled = token.status === "called";
  const isServing = token.status === "serving";
  const isCompleted = token.status === "completed";

  async function handleCancel() {
    setCancelLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    router.push(`/${locale}/home`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-bold text-foreground">{text.title}</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Share2 size={18} className="text-muted" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Called alert */}
        {isCalled && (
          <div className="bg-primary rounded-2xl p-5 text-center animate-pulse">
            <p className="text-4xl mb-2">🔔</p>
            <p className="text-white text-xl font-bold">{text.calledTitle}</p>
            <p className="text-primary-light text-sm mt-1">{text.calledDesc(token.gateNumber ?? 1)}</p>
          </div>
        )}

        {/* Token number display */}
        <Card className="p-6 text-center">
          <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-4 ${
            isCalled ? "bg-primary" : isCompleted ? "bg-gray-100" : "bg-primary-light"
          }`}>
            <p className={`text-4xl font-black ${isCalled ? "text-white" : "text-primary"}`}>
              {token.tokenNumber}
            </p>
          </div>

          <div className="flex justify-center mb-4">
            {token.status === "waiting" && <Badge variant="primary" dot>{text.waitingStatus}</Badge>}
            {token.status === "called" && <Badge variant="warning" dot>{isMy ? "ခေါ်နေသည်" : "Called"}</Badge>}
            {token.status === "serving" && <Badge variant="success" dot>{isMy ? "ဆောင်ရွက်နေသည်" : "Serving"}</Badge>}
            {token.status === "completed" && <Badge variant="neutral">{isMy ? "ပြီးဆုံးပြီ" : "Completed"}</Badge>}
          </div>

          {!isCompleted && (
            <>
              <p className="text-muted text-sm">{text.position(token.position)}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {text.estimatedTime}: {formatTime(token.estimatedCallAt, isMy)}
              </p>
            </>
          )}
        </Card>

        {/* Progress */}
        {!isCompleted && (
          <Card className="p-4">
            <div className="flex justify-between text-xs text-muted mb-2">
              <span>{isMy ? "Queue တိုးတက်မှု" : "Queue progress"}</span>
              <span>{token.totalInQueue - token.position}/{token.totalInQueue} {isMy ? "ဦး ပြီး" : "served"}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>
        )}

        {/* Notification prompt */}
        {!notifyEnabled && !isCompleted && (
          <div className="bg-accent-light border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <Bell size={20} className="text-accent shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{text.notifyMe}</p>
              <p className="text-xs text-muted">{text.notifyDesc}</p>
            </div>
            <button
              onClick={() => setNotifyEnabled(true)}
              className="text-xs font-bold text-accent bg-white px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 shrink-0"
            >
              {isMy ? "ဖွင့်ရန်" : "Enable"}
            </button>
          </div>
        )}
        {notifyEnabled && (
          <div className="bg-success-light border border-green-200 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-sm">🔔</span>
            <p className="text-xs font-semibold text-success">
              {isMy ? "Notification ဖွင့်ပြီး — မိနစ် ၃၀ အလို သတိပေးမည်" : "Notifications enabled — 30-min alert set"}
            </p>
          </div>
        )}

        {/* Token details */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted">
              <MapPin size={14} />
              <span className="text-sm">{text.station}</span>
            </div>
            <span className="text-sm font-semibold text-foreground text-right max-w-[60%]">{stationName}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted">
              <Fuel size={14} />
              <span className="text-sm">{text.fuelType}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{fuelLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{text.joinedAt}</span>
            <span className="text-sm font-semibold text-foreground">{formatTime(token.createdAt, isMy)}</span>
          </div>
        </Card>

        {/* Cancel */}
        {!isCompleted && token.status === "waiting" && (
          <Button
            variant="outline"
            fullWidth
            onClick={() => setShowCancel(true)}
          >
            <X size={16} />
            {text.cancelToken}
          </Button>
        )}

        {/* Cancel modal */}
        {showCancel && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-surface w-full max-w-lg mx-auto rounded-t-3xl p-6 space-y-4">
              <p className="text-base font-bold text-center text-foreground">{text.cancelConfirm}</p>
              <Button variant="danger" fullWidth loading={cancelLoading} onClick={handleCancel}>
                {text.cancelYes}
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setShowCancel(false)}>
                {text.cancelNo}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
