"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Car, Globe, Bell, LogOut, ChevronRight, Clock } from "lucide-react";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Card } from "@/components/ui/Card";

const t = {
  my: {
    title: "ကျွန်ုပ်",
    name: "အမည်",
    vehicle: "ယာဉ်အမျိုးအစား",
    language: "ဘာသာစကား",
    notifications: "Notification",
    history: "ဆီဖြည့်မှတ်တမ်း",
    favorites: "အကြိုက်ဆိုင်များ",
    logout: "ထွက်ရန်",
    car: "ကား",
    motorbike: "မော်တော်ဆိုင်ကယ်",
    truck: "ထရပ်ကား",
    phone: "ဖုန်းနံပါတ်",
    version: "ဗားရှင်း",
  },
  en: {
    title: "Profile",
    name: "Name",
    vehicle: "Vehicle Type",
    language: "Language",
    notifications: "Notifications",
    history: "Fuel History",
    favorites: "Favorite Stations",
    logout: "Sign Out",
    car: "Car",
    motorbike: "Motorbike",
    truck: "Truck",
    phone: "Phone Number",
    version: "Version",
  },
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const isMy = locale === "my";
  const text = isMy ? t.my : t.en;
  const router = useRouter();
  const [vehicle, setVehicle] = useState("car");

  return (
    <div className="max-w-lg mx-auto">
      <div className="px-4 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
        <LanguageToggle locale={locale} />
      </div>

      <div className="px-4 space-y-4 pb-6">
        {/* Profile card */}
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center">
              <User size={28} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">Mg Mg</p>
              <p className="text-muted text-sm">+95 9 7654 3210</p>
            </div>
          </div>
        </Card>

        {/* Vehicle type */}
        <Card className="p-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">{text.vehicle}</p>
          <div className="grid grid-cols-3 gap-2">
            {(["car", "motorbike", "truck"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVehicle(v)}
                className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                  vehicle === v
                    ? "border-primary bg-primary-light text-primary"
                    : "border-border text-muted hover:border-primary/30"
                }`}
              >
                {v === "car" ? "🚗" : v === "motorbike" ? "🏍️" : "🚛"}
                <br />
                {isMy
                  ? v === "car" ? "ကား" : v === "motorbike" ? "ဆိုင်ကယ်" : "ထရပ်"
                  : v === "car" ? "Car" : v === "motorbike" ? "Motorbike" : "Truck"}
              </button>
            ))}
          </div>
        </Card>

        {/* Menu items */}
        <Card>
          {[
            { icon: Clock, label: text.history, href: `/${locale}/history` },
            { icon: Bell, label: text.notifications, href: "#" },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-border last:border-0"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon size={16} className="text-muted" />
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
              <ChevronRight size={16} className="text-muted" />
            </a>
          ))}
        </Card>

        {/* Logout */}
        <button
          onClick={() => router.push(`/${locale}/login`)}
          className="w-full flex items-center gap-3 px-4 py-4 bg-danger-light rounded-2xl hover:bg-red-100 transition-colors"
        >
          <div className="w-8 h-8 bg-danger/10 rounded-lg flex items-center justify-center">
            <LogOut size={16} className="text-danger" />
          </div>
          <span className="text-sm font-semibold text-danger">{text.logout}</span>
        </button>

        <p className="text-center text-xs text-muted pb-2">Smart Fuel Queue v1.0.0</p>
      </div>
    </div>
  );
}
