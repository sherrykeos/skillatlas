"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">(
    token ? "loading" : "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    authApi
      .verifyEmail(token)
      .then(() => {
        if (isMounted) setStatus("success");
      })
      .catch((err: any) => {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err.message || "Invalid or expired verification token.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    try {
      await authApi.resendVerification(resendEmail.trim());
      toast.success("Verification link resent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden">
      {/* Top subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <Link href="/" className="inline-flex items-center justify-center gap-2 group mb-2">
        <div className="relative h-8 w-8">
          <Image
            src="/logo.png"
            alt="SkillAtlas"
            fill
            className="object-contain group-hover:scale-105 transition-transform"
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
          Skill<span className="text-emerald-400">Atlas</span>
        </span>
      </Link>

      {status === "loading" && (
        <div className="space-y-4 py-6">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
          <h1 className="text-xl font-bold text-[#F8FAFC]">Verifying Email...</h1>
          <p className="text-xs text-[#94A3B8]">Connecting to token verification service.</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              Email Verified Successfully
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Your account is fully verified. You can now publish skills and participate in the developer registry.
            </p>
          </div>
          <div className="pt-2">
            <Button asChild variant="primary" size="default" className="w-full shadow-md shadow-emerald-500/15">
              <Link href="/login">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>
      )}

      {(status === "error" || status === "idle") && (
        <div className="space-y-4">
          {status === "error" && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              {status === "error" ? "Verification Failed" : "Verify Your Email"}
            </h1>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
              {status === "error"
                ? errorMessage
                : "Please confirm your email address to unlock publishing and developer profile features."}
            </p>
          </div>

          <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
            <label className="text-xs font-medium text-[#F8FAFC]">
              Need a new verification link?
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
                <Input
                  type="email"
                  placeholder="developer@skillatlas.dev"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  className="pl-9 text-xs"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="default"
                disabled={isResending}
                className="shrink-0 text-xs font-semibold"
              >
                {isResending ? "Sending..." : "Resend"}
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#1E2433]">
            <Link
              href="/login"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-xs text-[#64748B] text-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
