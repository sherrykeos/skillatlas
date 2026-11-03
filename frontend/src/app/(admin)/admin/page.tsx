"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FileCode,
  Download,
  ThumbsUp,
  MessageSquare,
  FolderHeart,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminApi, AdminStatsResponse } from "@/lib/api/admin";
import { LoadingState } from "@/components/common/loading-state";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      const res = await adminApi.getStats();
      setData(res);
      if (isManual) toast.success("Telemetry refreshed from database.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch platform telemetry.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingState message="Connecting to database telemetry..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-rose-400">Failed to load admin statistics.</p>
        <Button onClick={() => fetchStats(true)} variant="primary" className="mt-4 font-semibold shadow-md shadow-emerald-500/15">
          Retry Connection
        </Button>
      </div>
    );
  }

  const { stats, recentUsers, recentSkills } = data;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#1E2433] pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Platform Telemetry &amp; System Overview
            </h1>
            <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-[11px]">
              Live Postgres DB
            </Badge>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Real-time aggregate platform metrics, engagement counters, and moderation queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : "text-[#64748B]"}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="border-[#1E2433] bg-[#0F1219] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
              User Accounts
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-[#F8FAFC]">{stats.totalUsers}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1E2433] pt-2 text-[11px] text-[#94A3B8] font-mono">
            <span className="text-emerald-400 font-semibold">{stats.totalCreators} creators</span>
            <span>•</span>
            <span className="text-[#64748B]">{stats.totalAdmins} admins</span>
            {stats.suspendedUsers > 0 && (
              <>
                <span>•</span>
                <span className="text-rose-400 font-semibold">{stats.suspendedUsers} suspended</span>
              </>
            )}
          </div>
        </Card>

        {/* Total Skills */}
        <Card className="border-[#1E2433] bg-[#0F1219] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
              Agent Skills
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <FileCode className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-[#F8FAFC]">{stats.totalSkills}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1E2433] pt-2 text-[11px] text-[#94A3B8] font-mono">
            <span className="text-emerald-400 font-semibold">{stats.publishedSkills} published</span>
            <span>•</span>
            <span className="text-[#64748B]">{stats.draftSkills} drafts</span>
            <span>•</span>
            <span className="text-[#64748B]">{stats.archivedSkills} archived</span>
          </div>
        </Card>

        {/* Total Installs & Downloads */}
        <Card className="border-[#1E2433] bg-[#0F1219] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
              Skill Downloads
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Download className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-[#F8FAFC]">{stats.totalDownloads}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1E2433] pt-2 text-[11px] text-[#94A3B8] font-mono">
            <span className="text-emerald-400">Active agent executions</span>
          </div>
        </Card>

        {/* Engagement Summary */}
        <Card className="border-[#1E2433] bg-[#0F1219] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
              Community Engagement
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <ThumbsUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold font-mono text-[#F8FAFC]">
              {stats.totalUpvotes + stats.totalReviews}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1E2433] pt-2 text-[11px] text-[#94A3B8] font-mono">
            <span className="text-emerald-400 font-semibold">{stats.totalUpvotes} upvotes</span>
            <span>•</span>
            <span className="text-[#64748B]">{stats.totalReviews} reviews</span>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/users"
          className="flex items-center justify-between rounded-[10px] border border-[#1E2433] bg-[#0F1219] p-4 transition-all hover:border-emerald-500/40 hover:bg-[#161B26] shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">Users Moderation</p>
              <p className="text-xs text-[#64748B]">Manage roles, suspend, or remove users</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </Link>

        <Link
          href="/admin/skills"
          className="flex items-center justify-between rounded-[10px] border border-[#1E2433] bg-[#0F1219] p-4 transition-all hover:border-emerald-500/40 hover:bg-[#161B26] shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">Skills Moderation</p>
              <p className="text-xs text-[#64748B]">Inspect, unpublish, or delete skills</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </Link>

        <Link
          href="/admin/reviews"
          className="flex items-center justify-between rounded-[10px] border border-[#1E2433] bg-[#0F1219] p-4 transition-all hover:border-emerald-500/40 hover:bg-[#161B26] shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">Reviews Moderation</p>
              <p className="text-xs text-[#64748B]">Clean up feedback &amp; spam ratings</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[#64748B]" />
        </Link>
      </div>

      {/* Activity Streams Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="space-y-3 rounded-[10px] border border-[#1E2433] bg-[#0F1219] p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E2433] pb-3">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>Recent Registrations</span>
            </h2>
            <Link
              href="/admin/users"
              className="text-xs text-emerald-400 hover:underline"
            >
              View all users
            </Link>
          </div>

          <div className="divide-y divide-[#1E2433]">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-7 w-7 border border-[#1E2433] bg-[#161B26]">
                    <AvatarImage src={u.avatar || undefined} alt={u.username} />
                    <AvatarFallback className="text-[10px] text-emerald-400 font-mono">{getInitials(u.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-[#F8FAFC] font-mono">@{u.username}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1 py-0.2 font-mono ${
                          u.role === "ADMIN"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : u.role === "CREATOR"
                            ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
                            : "bg-[#161B26] text-[#64748B]"
                        }`}
                      >
                        {u.role}
                      </Badge>
                      {u.isSuspended && (
                        <span className="rounded bg-rose-500/20 px-1 text-[9px] font-bold text-rose-300 font-mono">
                          SUSPENDED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#64748B]">{u.email}</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#64748B] font-mono">
                  <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                  <div className="text-[9px] text-[#94A3B8]">
                    {u._count?.skills || 0} skills • {u._count?.reviews || 0} reviews
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Skills */}
        <div className="space-y-3 rounded-[10px] border border-[#1E2433] bg-[#0F1219] p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E2433] pb-3">
            <h2 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
              <FileCode className="h-4 w-4 text-emerald-400" />
              <span>Recent Skills Created</span>
            </h2>
            <Link
              href="/admin/skills"
              className="text-xs text-emerald-400 hover:underline"
            >
              View all skills
            </Link>
          </div>

          <div className="divide-y divide-[#1E2433]">
            {recentSkills.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-[#F8FAFC]">{s.name}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1 py-0.2 font-mono ${
                          s.status === "PUBLISHED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : s.status === "DRAFT"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-[#64748B]/20 text-[#64748B]"
                        }`}
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono">
                      by @{s.author.username} • {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#64748B] font-mono">
                  <span className="text-emerald-400 font-semibold">{s._count?.downloads || 0}</span> installs
                  <span className="mx-1">•</span>
                  <span className="text-sky-400 font-semibold">{s._count?.upvotes || 0}</span> upvotes
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
