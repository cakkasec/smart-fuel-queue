import Link from "next/link";
import { MapPin, Clock, ChevronRight, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type Station, type FuelType, FUEL_LABELS } from "@/lib/mock-data";

const FUEL_COLORS: Record<FuelType, string> = {
  octane_92: "bg-blue-100 text-blue-700",
  octane_95: "bg-purple-100 text-purple-700",
  diesel: "bg-amber-100 text-amber-700",
};

function getStatusBadge(status: Station["status"], isMy: boolean) {
  if (status === "open") return <Badge variant="success" dot>{isMy ? "ဖွင့်ထားသည်" : "Open"}</Badge>;
  if (status === "paused") return <Badge variant="warning" dot>{isMy ? "ယာယီရပ်" : "Paused"}</Badge>;
  return <Badge variant="danger" dot>{isMy ? "ပိတ်ထားသည်" : "Closed"}</Badge>;
}

export function StationCard({ station, locale }: { station: Station; locale: string }) {
  const isMy = locale === "my";
  const name = isMy ? station.nameMy : station.name;
  const address = isMy ? station.addressMy : station.address;
  const isClosed = station.status === "closed";

  return (
    <Link href={`/${locale}/stations/${station.id}`}>
      <Card pressable className={isClosed ? "opacity-60" : ""}>
        <div className="p-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base leading-tight truncate">{name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-muted shrink-0" />
                <span className="text-xs text-muted truncate">{address}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {getStatusBadge(station.status, isMy)}
              <span className="text-xs text-muted">{station.distance} km</span>
            </div>
          </div>

          {/* Queue info */}
          {!isClosed && (
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1.5 text-muted">
                <Users size={13} />
                <span className="font-semibold text-foreground">{station.queueLength}</span>
                <span>{isMy ? "ဦး" : "waiting"}</span>
              </div>
              {station.estimatedWaitMinutes > 0 && (
                <div className="flex items-center gap-1.5 text-muted">
                  <Clock size={13} />
                  <span>
                    {isMy
                      ? `~${station.estimatedWaitMinutes} မိနစ်`
                      : `~${station.estimatedWaitMinutes} min`}
                  </span>
                </div>
              )}
              {station.pauseReason && (
                <span className="text-xs text-warning">⚠ {station.pauseReason}</span>
              )}
            </div>
          )}

          {/* Queue progress bar */}
          {!isClosed && station.queueLength > 0 && (
            <div className="mb-3">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min((station.queueLength / station.maxCapacity) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Fuel types */}
          <div className="flex items-center gap-2">
            {station.fuels.map((fuel) => (
              <span
                key={fuel.type}
                className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  fuel.available ? FUEL_COLORS[fuel.type] : "bg-gray-100 text-gray-400 line-through"
                }`}
              >
                {isMy ? FUEL_LABELS[fuel.type].my : FUEL_LABELS[fuel.type].en}
              </span>
            ))}
            <ChevronRight size={14} className="text-muted ml-auto" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
