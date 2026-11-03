"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing or invalid. Please request a new link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({ token, password });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to reset password. Link may have expired.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
            Password Updated
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Your password has been successfully reset. You can now log in with your new credentials.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="primary" size="default" className="w-full">
            <Link href="/login">Sign In</Link>
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
        <h1 className="text-lg font-bold text-[#F8FAFC]">Set New Password</h1>
        <p className="text-xs text-[#94A3B8]">
          Create a secure password for your SkillAtlas account.
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
          <label className="text-xs font-medium text-[#F8FAFC]">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-9 text-xs"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F8FAFC]">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <Input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-9 text-xs"
              autoComplete="new-password"
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
          {isLoading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-xs text-[#64748B] text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
