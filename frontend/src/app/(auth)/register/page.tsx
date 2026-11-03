"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
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
      <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9FBEA5]/15 border border-[#9FBEA5]/40 text-[#9FBEA5] mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
            Check Your Email
          </h1>
          <p className="text-xs text-[#A9B1AA] leading-relaxed max-w-sm mx-auto">
            We sent a verification link to <span className="text-[#F1F4EF] font-medium">{email}</span>. Click the link to verify your account and unlock publishing.
          </p>
        </div>
        <div className="pt-2 space-y-3">
          <Button asChild variant="primary" size="default" className="w-full">
            <Link href="/login">Proceed to Sign In</Link>
          </Button>
          <p className="text-xs text-[#707A72]">
            Didn&apos;t receive it? Check spam folder or{" "}
            <Link href="/verify-email" className="text-[#CCD7C5] underline hover:text-[#F1F4EF]">
              resend link
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F4EF]">
          Create Developer Account
        </h1>
        <p className="text-xs text-[#A9B1AA]">
          Publish, version, and share agentic skills with the community.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[6px] border border-[#C58F8F]/30 bg-[#C58F8F]/10 text-xs text-[#C58F8F]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="developer_handle"
              required
              className="pl-9 text-xs font-mono"
            />
          </div>
          <p className="text-[10px] text-[#707A72]">Letters, numbers, and underscores only.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sharad@example.com"
              required
              className="pl-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F1F4EF]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707A72]" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="pl-9 text-xs"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          size="default"
          className="w-full font-semibold"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="w-full border-t border-[#252D28]" />
        <span className="bg-[#0E1210] px-3 text-[10px] text-[#707A72] uppercase font-mono tracking-wider absolute">
          Or continue with
        </span>
      </div>

      <Button
        type="button"
        onClick={() => {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
          window.location.href = `${apiBase}/api/auth/google`;
        }}
        variant="secondary"
        size="sm"
        className="w-full text-xs gap-1.5 cursor-pointer mb-2"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </Button>

      <p className="text-center text-xs text-[#707A72]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#CCD7C5] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
