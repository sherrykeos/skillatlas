"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Layers,
  GitBranch,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Code2,
  Share2,
} from "lucide-react";

export default function BecomeCreatorPage() {
  const { user, isCreator, becomeCreator } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  const handleActivate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await becomeCreator();
      setActivated(true);
    } catch (err: any) {
      setError(err?.message || "Failed to activate Creator status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCreator || activated) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <div className="relative overflow-hidden rounded-[12px] border border-emerald-500/30 bg-[#0F1219] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <Badge className="mb-3 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            Creator Mode Active
          </Badge>
          <h1 className="text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
            You&apos;re ready to publish on SkillAtlas!
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#94A3B8]">
            Your account now has full Creator privileges. Start building and sharing agent skills with the community.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              variant="primary"
              className="w-full sm:w-auto font-semibold shadow-md shadow-emerald-500/15"
            >
              <Link href="/skills/new">
                Create First Skill
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/github-import">
                <GitBranch className="mr-2 h-4 w-4 text-emerald-400" />
                Import from GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[12px] border border-[#1E2433] bg-[#0F1219] p-8 sm:p-10 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            1-Click Creator Activation
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
            Distribute Your Agent Skills to the World
          </h1>
          <p className="mt-3 text-base text-[#94A3B8] leading-relaxed">
            Turn your prompts, tools, and agent workflows into discoverable, version-controlled skills. Free for all developers.
          </p>

          {error && (
            <div className="mt-4 rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={handleActivate}
              disabled={isLoading}
              variant="primary"
              className="font-bold shadow-lg shadow-emerald-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  Activate Creator Access Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <span className="text-xs text-[#64748B]">
              Instant activation • No review queue
            </span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#1E2433] bg-[#0F1219] p-5 transition-all hover:border-emerald-500/40">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#F8FAFC]">Versioned Skill Packaging</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
            Tag semantic versions (v1.0.0), write markdown changelogs, and maintain draft updates before pushing live.
          </p>
        </Card>

        <Card className="border-[#1E2433] bg-[#0F1219] p-5 transition-all hover:border-emerald-500/40">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <GitBranch className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#F8FAFC]">GitHub 1-Click Import</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
            Sync tools directly from public GitHub repos. We extract folder trees and descriptions automatically.
          </p>
        </Card>

        <Card className="border-[#1E2433] bg-[#0F1219] p-5 transition-all hover:border-emerald-500/40">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-[#F8FAFC]">Ecosystem Reach &amp; Stats</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">
            Track total installs, agent downloads, upvotes, and community reviews in real time on your creator dashboard.
          </p>
        </Card>
      </div>

      {/* Creator Checklist */}
      <div className="rounded-[12px] border border-[#1E2433] bg-[#0F1219] p-6 shadow-xl">
        <h3 className="text-base font-semibold text-[#F8FAFC]">What happens when you activate?</h3>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-3 text-sm text-[#94A3B8]">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>You gain access to the &quot;Create Skill&quot; and &quot;GitHub Import&quot; features immediately.</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-[#94A3B8]">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Your public author profile shows your published skills and contributions.</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-[#94A3B8]">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>You keep all standard user capabilities (bookmarking, upvoting, reviewing, downloading).</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
