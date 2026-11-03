"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email.trim());
      setIsSubmitted(true);
      toast.success("Password reset instructions sent!");
    } catch (err: any) {
      const msg = err.message || "Failed to process request. Please check your email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
            Reset Link Sent
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
            If an account exists for <span className="text-[#F8FAFC] font-medium">{email}</span>, you will receive password reset instructions shortly.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="secondary" size="default" className="w-full">
            <Link href="/login">Return to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-3 text-center relative z-10">
        <Link href="/" className="inline-flex items-center justify-center gap-2 group">
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
        <h1 className="text-lg font-bold text-[#F8FAFC]">Reset Password</h1>
        <p className="text-xs text-[#94A3B8]">
          Enter your developer email address and we will dispatch a secure reset token.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[8px] border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F8FAFC]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@skillatlas.dev"
              required
              className="pl-9 text-xs"
              autoComplete="email"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          size="default"
          className="w-full font-semibold shadow-md shadow-emerald-500/15"
        >
          {isLoading ? "Sending Link..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
