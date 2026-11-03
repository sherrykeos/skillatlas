"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Boxes, Download, ThumbsUp, ArrowRight, Sparkles, Terminal } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreatorStatsGrid } from "@/components/dashboard/creator-stats-grid";
import { DownloadsChart } from "@/components/dashboard/downloads-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { LoadingState } from "@/components/common/loading-state";
import { useAuth } from "@/lib/auth/auth-context";
import { skillsApi } from "@/lib/api/skills";
import { formatNumber, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isCreator, isLoading: isLoadingAuth } = useAuth();

  useEffect(() => {
    if (!isLoadingAuth && user && !isCreator) {
      router.replace("/profile");
    }
  }, [user, isCreator, isLoadingAuth, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["my-skills"],
    queryFn: () => skillsApi.getMine(),
  });

  const skills = data?.skills || [];
  const publishedSkills = skills.filter((s) => s.status === "PUBLISHED");
  const draftSkills = skills.filter((s) => s.status === "DRAFT");

  const totalDownloads = skills.reduce(
    (acc, s) => acc + (s.downloadCount ?? s._count?.downloads ?? 0),
    0
  );
  const totalUpvotes = skills.reduce(
    (acc, s) => acc + (s.upvoteCount ?? s._count?.upvotes ?? 0),
    0
  );

  if (isLoading) {
    return <LoadingState message="Loading your creator dashboard metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2433] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              Welcome back{user?.username ? `, ${user.username}` : ""}
            </h1>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs text-[#94A3B8]">
            Here&apos;s a summary of your published skills and community usage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="secondary" size="sm" className="gap-1.5 text-xs">
            <Link href="/github-import">
              <GithubIcon className="h-3.5 w-3.5 text-[#94A3B8]" />
              <span>Import GitHub</span>
            </Link>
          </Button>

          <Button asChild variant="primary" size="sm" className="gap-1.5 text-xs font-semibold shadow-sm">
            <Link href="/skills/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Create Skill</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <CreatorStatsGrid
        publishedCount={publishedSkills.length}
        draftCount={draftSkills.length}
        totalDownloads={totalDownloads}
        totalUpvotes={totalUpvotes}
      />

      {/* Chart & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <DownloadsChart skills={skills} />
        </div>
        <div className="lg:col-span-5">
          <ActivityFeed skills={skills} />
        </div>
      </div>

      {/* Recent Skills Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
              <Boxes className="h-4 w-4 text-emerald-400" />
              <span>My Skills ({skills.length})</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              {publishedSkills.length} published • {draftSkills.length} drafts
            </p>
          </div>

          <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300">
            <Link href="/skills">Manage all skills →</Link>
          </Button>
        </div>

        {skills.length === 0 ? (
          <Card className="p-8 text-center border-[#1E2433] bg-[#0F1219] space-y-3 shadow-sm">
            <p className="text-xs text-[#94A3B8]">
              You haven&apos;t created any skills yet. Build your first reusable AI capability now!
            </p>
            <Button asChild variant="primary" size="sm">
              <Link href="/skills/new">Create Your First Skill</Link>
            </Button>
          </Card>
        ) : (
          <div className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090A0F] border-b border-[#1E2433] text-[#64748B] font-mono">
                <tr>
                  <th className="p-3.5 pl-4">Skill</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Version</th>
                  <th className="p-3.5">Downloads</th>
                  <th className="p-3.5">Upvotes</th>
                  <th className="p-3.5">Updated</th>
                  <th className="p-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2433]/70">
                {skills.slice(0, 5).map((skill) => {
                  const latestVersion = skill.versions?.[0]?.version || "1.0.0";
                  const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
                  const upvotes = skill.upvoteCount ?? skill._count?.upvotes ?? 0;

                  return (
                    <tr key={skill.id} className="hover:bg-[#161B26]/40 transition-colors">
                      <td className="p-3.5 pl-4 font-semibold text-[#F8FAFC]">
                        <Link
                          href={`/skills/${skill.slug}`}
                          className="hover:text-emerald-400 transition-colors"
                        >
                          {skill.name}
                        </Link>
                      </td>
                      <td className="p-3.5">
                        {skill.status === "PUBLISHED" && (
                          <Badge variant="success" className="text-[10px]">
                            Published
                          </Badge>
                        )}
                        {skill.status === "DRAFT" && (
                          <Badge variant="warning" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                        {skill.status === "ARCHIVED" && (
                          <Badge variant="outline" className="text-[10px]">
                            Archived
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[#94A3B8]">v{latestVersion}</td>
                      <td className="p-3.5 font-mono text-[#94A3B8]">{formatNumber(downloads)}</td>
                      <td className="p-3.5 font-mono text-[#94A3B8]">{formatNumber(upvotes)}</td>
                      <td className="p-3.5 font-mono text-[#64748B]">{formatDate(skill.updatedAt)}</td>
                      <td className="p-3.5 pr-4 text-right">
                        <Button asChild variant="ghost" size="xs">
                          <Link href={`/skills/${skill.id}/edit`}>Edit Studio</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
