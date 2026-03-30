"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Fuel } from "lucide-react";
import { PhoneInput } from "@/components/shared/PhoneInput";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/shared/LanguageToggle";

const t = {
  my: {
    title: "Smart Fuel Queue",
    tagline: "အိမ်မှ ဆီဆိုင် တန်းစီပါ",
    phoneLabel: "ဖုန်းနံပါတ်",
    sendOtp: "OTP ပို့ပေးပါ",
    terms: "ဆက်လက်လုပ်ဆောင်ခြင်းဖြင့် ဝန်ဆောင်မှု စည်းမျဉ်းများကို သဘောတူသည်",
    invalidPhone: "ဖုန်းနံပါတ် မှားနေသည်",
  },
  en: {
    title: "Smart Fuel Queue",
    tagline: "Queue from Home",
    phoneLabel: "Phone Number",
    sendOtp: "Send OTP",
    terms: "By continuing you agree to our Terms of Service",
    invalidPhone: "Invalid phone number",
  },
};

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const isMy = locale === "my";
  const text = isMy ? t.my : t.en;
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const clean = phone.replace(/\D/g, "");
    if (!clean || clean.length < 8 || clean.length > 11) {
      setError(text.invalidPhone);
      return false;
    }
    setError("");
    return true;
  }

  async function handleSend() {
    if (!validate()) return;
    setLoading(true);
    // Mock: skip actual OTP, go straight to verify
    await new Promise((r) => setTimeout(r, 800));
    router.push(`/${locale}/verify?phone=${encodeURIComponent(phone)}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex justify-end p-4">
        <LanguageToggle locale={locale} />
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg mb-4">
              <Fuel size={40} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
            <p className="text-muted mt-1 text-base">{text.tagline}</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <PhoneInput
              label={text.phoneLabel}
              value={phone}
              onChange={setPhone}
              error={error}
            />
            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={handleSend}
            >
              {text.sendOtp}
            </Button>
          </div>

          <p className="text-center text-xs text-muted mt-6 leading-5">
            {text.terms}
          </p>
        </div>
      </div>
    </div>
  );
}
