"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const loggedUser = await login(email.trim(), password);
      toast.success("Welcome back!");

      const isCreatorOrAdmin =
        loggedUser?.role === "CREATOR" || loggedUser?.role === "ADMIN";
      const customRedirect = searchParams.get("redirect");

      let target = "/profile";
      if (customRedirect) {
        if (customRedirect.startsWith("/dashboard") && !isCreatorOrAdmin) {
          target = "/profile";
        } else {
          target = customRedirect;
        }
      } else if (isCreatorOrAdmin) {
        target = "/dashboard";
      }

      router.push(target);
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

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
        <p className="text-xs text-[#94A3B8]">
          Sign in to manage your agentic skills, security audits, and tokens.
        </p>
      </div>

      {error && (
        <div
          className={`p-3 rounded-[8px] flex flex-col gap-2 text-xs ${
            error.toLowerCase().includes("verify")
              ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className={`h-4 w-4 shrink-0 mt-0.5 ${
                error.toLowerCase().includes("verify") ? "text-amber-400" : "text-rose-400"
              }`}
            />
            <span className="leading-relaxed">{error}</span>
          </div>
          {error.toLowerCase().includes("verify") && (
            <div className="pl-6.5">
              <Link
                href="/verify-email"
                className="font-medium text-emerald-400 underline hover:text-emerald-300"
              >
                Resend or complete email verification &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#F8FAFC]">Password</label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#94A3B8] hover:text-emerald-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-9 text-xs"
              autoComplete="current-password"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="primary"
          className="w-full text-xs font-semibold py-2.5 shadow-md shadow-emerald-500/15"
        >
          {isLoading ? (
            <span>Authenticating...</span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              Sign In
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#1E2433] w-full" />
        <span className="bg-[#0F1219] px-3 text-[10px] text-[#64748B] uppercase font-mono tracking-wider absolute">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        <Button
          type="button"
          onClick={() => {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
            window.location.href = `${apiBase}/api/auth/google`;
          }}
          variant="secondary"
          size="sm"
          className="text-xs gap-1.5 cursor-pointer"
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
          <span>Google</span>
        </Button>

        <Button
          type="button"
          onClick={() => {
            toast.info("GitHub OAuth is coming soon.");
          }}
          variant="secondary"
          size="sm"
          className="text-xs gap-1.5 cursor-pointer"
        >
          <GithubIcon className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </Button>
      </div>

      <p className="text-center text-xs text-[#64748B]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-emerald-400 hover:underline font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-xs text-[#64748B] text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
