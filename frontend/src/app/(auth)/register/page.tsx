"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await register(username.trim(), email.trim(), password);
      setRegisteredSuccess(true);
      toast.success("Account created successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to create account. Please check your details.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (registeredSuccess) {
    return (
      <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Check Your Email
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
            We sent a verification link to <span className="text-[#F8FAFC] font-medium">{email}</span>. Click the link to verify your account and unlock publishing capabilities.
          </p>
        </div>
        <div className="pt-2 space-y-3">
          <Button asChild variant="primary" size="default" className="w-full">
            <Link href="/login">Proceed to Sign In</Link>
          </Button>
          <p className="text-xs text-[#64748B]">
            Didn&apos;t receive it? Check spam folder or{" "}
            <Link href="/verify-email" className="text-emerald-400 underline hover:text-emerald-300">
              resend link
            </Link>
          </p>
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
        <h1 className="text-lg font-bold text-[#F8FAFC]">Create Developer Account</h1>
        <p className="text-xs text-[#94A3B8]">
          Publish, version, and share agentic skills with the open developer community.
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
          <label className="text-xs font-medium text-[#F8FAFC]">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <Input
              type="text"
              placeholder="developer-handle"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
              required
              className="pl-9 text-xs font-mono"
              autoComplete="username"
            />
          </div>
          <span className="text-[10px] text-[#64748B] font-mono">
            Used as your unique creator slug: skillatlas.dev/@{username || "handle"}
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F8FAFC]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <Input
              type="email"
              placeholder="developer@skillatlas.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-9 text-xs"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F8FAFC]">Password</label>
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
          <span className="text-[10px] text-[#64748B]">Minimum 6 characters.</span>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          className="w-full text-xs font-semibold py-2.5 shadow-md shadow-emerald-500/15"
        >
          {isLoading ? (
            <span>Creating Account...</span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              Create Account
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-[#64748B]">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-400 hover:underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
