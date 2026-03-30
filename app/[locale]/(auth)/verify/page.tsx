"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OTPInput } from "@/components/shared/OTPInput";
import { Button } from "@/components/ui/Button";

const t = {
  my: {
    title: "OTP ကုဒ် ထည့်ပါ",
    subtitle: (phone: string) => `+95${phone} သို့ OTP ပို့ပြီးပါပြီ`,
    verify: "အတည်ပြုပါ",
    resend: "ထပ်ပို့ပါ",
    resendIn: (s: number) => `${s} စက္ကန့်နောက် ထပ်ပို့နိုင်သည်`,
    back: "နောက်သို့",
    wrongOtp: "OTP မှားသည် (စစ်ဆေးရန်: 123456)",
  },
  en: {
    title: "Enter OTP",
    subtitle: (phone: string) => `OTP sent to +95${phone}`,
    verify: "Verify",
    resend: "Resend",
    resendIn: (s: number) => `Resend in ${s}s`,
    back: "Back",
    wrongOtp: "Invalid OTP (hint: 123456)",
  },
};

export default function VerifyPage() {
  const { locale } = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const isMy = locale === "my";
  const text = isMy ? t.my : t.en;
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(59);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  async function handleVerify() {
    if (otp.length < 6) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    // Mock: accept "123456"
    if (otp !== "123456") {
      setError(text.wrongOtp);
      setLoading(false);
      return;
    }
    router.push(`/${locale}/home`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex items-center p-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{text.title}</h1>
            <p className="text-muted text-sm leading-6">{text.subtitle(phone)}</p>
          </div>

          <div className="space-y-6">
            <OTPInput value={otp} onChange={setOtp} error={error} />
            <Button
              fullWidth
              size="lg"
              loading={loading}
              disabled={otp.length < 6}
              onClick={handleVerify}
            >
              {text.verify}
            </Button>
          </div>

          <div className="text-center mt-6">
            {resendCountdown > 0 ? (
              <p className="text-sm text-muted">{text.resendIn(resendCountdown)}</p>
            ) : (
              <button
                onClick={() => setResendCountdown(59)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {text.resend}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
