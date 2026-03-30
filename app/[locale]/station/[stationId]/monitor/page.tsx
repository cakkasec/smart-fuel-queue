import { MOCK_QUEUE_TOKENS, MOCK_STATIONS } from "@/lib/mock-data";

const STATION = MOCK_STATIONS[0];

export default async function MonitorPage({
  params,
}: {
  params: Promise<{ locale: string; stationId: string }>;
}) {
  const { locale } = await params;
  const isMy = locale === "my";
  const next5 = MOCK_QUEUE_TOKENS.filter((t) => t.status === "waiting").slice(0, 5);

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/20">
        <div>
          <p className="text-primary-light text-sm font-medium">Smart Fuel Queue</p>
          <p className="text-white text-xl font-bold">
            {isMy ? STATION.nameMy : STATION.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-primary-light text-sm">{isMy ? "ယနေ့ ၄၂ ဦး ပြီး" : "42 served today"}</p>
          <p className="text-white text-sm font-medium">
            {new Date().toLocaleTimeString(isMy ? "my-MM" : "en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Now serving — big */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <p className="text-primary-light text-xl font-semibold mb-4 uppercase tracking-widest">
          {isMy ? "ယခု ဆောင်ရွက်နေသည်" : "NOW SERVING"}
        </p>
        <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl">
          <p className="text-7xl font-black text-primary">A-043</p>
        </div>
        <p className="text-primary-light text-2xl">
          {isMy ? "Gate 1 သို့ ကြွပါ" : "Please proceed to Gate 1"}
        </p>
      </div>

      {/* Next up */}
      <div className="px-8 py-6 border-t border-white/20">
        <p className="text-primary-light text-sm font-semibold uppercase tracking-widest mb-4">
          {isMy ? "နောက်လာမည့်သူများ" : "NEXT UP"}
        </p>
        <div className="flex gap-4">
          {next5.map((token, i) => (
            <div
              key={token.id}
              className={`flex-1 text-center py-4 rounded-2xl ${
                i === 0 ? "bg-white" : "bg-white/20"
              }`}
            >
              <p className={`text-2xl font-black ${i === 0 ? "text-primary" : "text-white"}`}>
                {token.tokenNumber}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
