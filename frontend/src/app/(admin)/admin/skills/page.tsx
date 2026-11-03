"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileCode,
  Search,
  Filter,
  Eye,
  Trash2,
  Undo2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Layers,
  Download,
  ThumbsUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApi, AdminSkillsResponse } from "@/lib/api/admin";
import { LoadingState } from "@/components/common/loading-state";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminSkillsPage() {
  const [data, setData] = useState<AdminSkillsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal actions
  const [skillToUnpublish, setSkillToUnpublish] = useState<any | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getSkills({
        q: searchQuery,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: currentPage,
        limit: 20,
      });
      setData(res);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load skills list.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, currentPage]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleUnpublish = async () => {
    if (!skillToUnpublish) return;
    try {
      setActionLoading(true);
      await adminApi.unpublishSkill(skillToUnpublish.id);
      toast.success(`Skill "${skillToUnpublish.name}" reverted to Draft.`);
      setSkillToUnpublish(null);
      fetchSkills();
    } catch (err: any) {
      toast.error(err?.message || "Failed to unpublish skill.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    try {
      setActionLoading(true);
      await adminApi.deleteSkill(skillToDelete.id);
      toast.success(`Skill "${skillToDelete.name}" deleted.`);
      setSkillToDelete(null);
      fetchSkills();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete skill.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#1E2433] pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2">
            <FileCode className="h-6 w-6 text-emerald-400" />
            <span>Skills Moderation &amp; Content Control</span>
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Review all skills across drafts, published, and archived states. Unpublish or delete non-compliant submissions.
          </p>
        </div>

        <Button
          onClick={() => fetchSkills()}
          variant="secondary"
          size="sm"
          className="text-xs"
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5 text-[#64748B]" />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-[10px] border border-[#1E2433] bg-[#0F1219] p-4 sm:flex-row sm:items-center shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#64748B]" />
          <Input
            type="text"
            placeholder="Search by skill name, slug, or keywords..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] bg-[#0F1219] border-[#1E2433] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-[#1E2433] bg-[#0F1219] text-xs">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-[#1E2433] bg-[#0F1219] shadow-xl">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingState message="Loading skills repository..." />
          </div>
        ) : !data || data.skills.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            No skills match the selected query or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1E2433] bg-[#090A0F] font-mono uppercase text-[#64748B]">
                <tr>
                  <th className="px-4 py-3">Skill</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Telemetry</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2433]">
                {data.skills.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-[#161B26]/50">
                    {/* Skill Info */}
                    <td className="px-4 py-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/skills/${s.slug}`}
                            target="_blank"
                            className="font-semibold text-[#F8FAFC] hover:text-emerald-400 hover:underline"
                          >
                            {s.name}
                          </Link>
                          <ExternalLink className="h-3 w-3 text-[#64748B]" />
                        </div>
                        <p className="max-w-xs truncate text-[11px] text-[#64748B]">
                          {s.description}
                        </p>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-[#1E2433] bg-[#161B26]">
                          <AvatarImage src={s.author.avatar || undefined} alt={s.author.username} />
                          <AvatarFallback className="text-[9px] text-emerald-400 font-mono">{getInitials(s.author.username)}</AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/users/${s.author.username}`}
                          target="_blank"
                          className="text-xs text-emerald-400 hover:underline font-mono"
                        >
                          @{s.author.username}
                        </Link>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold font-mono ${
                          s.status === "PUBLISHED"
                            ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : s.status === "DRAFT"
                            ? "border border-amber-500/40 bg-amber-500/10 text-amber-300"
                            : "border border-[#1E2433] bg-[#161B26] text-[#64748B]"
                        }`}
                      >
                        {s.status}
                      </Badge>
                    </td>

                    {/* Telemetry */}
                    <td className="px-4 py-3 text-[#94A3B8]">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span title="Downloads">
                          <Download className="mr-1 inline h-3 w-3 text-[#64748B]" />
                          {s._count.downloads}
                        </span>
                        <span>•</span>
                        <span title="Upvotes">
                          <ThumbsUp className="mr-1 inline h-3 w-3 text-emerald-400" />
                          {s._count.upvotes}
                        </span>
                        <span>•</span>
                        <span title="Versions">
                          <Layers className="mr-1 inline h-3 w-3 text-[#64748B]" />
                          {s._count.versions}v
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-[11px] text-[#64748B]">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === "PUBLISHED" && (
                          <Button
                            onClick={() => setSkillToUnpublish(s)}
                            variant="secondary"
                            size="sm"
                            className="h-7 px-2 text-[11px] text-amber-300 hover:bg-amber-500/10"
                            title="Revert skill to draft status"
                          >
                            <Undo2 className="mr-1 h-3 w-3" />
                            Unpublish
                          </Button>
                        )}

                        <Button
                          onClick={() => setSkillToDelete(s)}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] text-[#64748B] hover:bg-rose-500/10 hover:text-rose-400"
                          title="Force delete skill"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#1E2433] px-4 py-3 text-xs text-[#64748B] font-mono">
            <span>
              Showing Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} skills)
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={data.pagination.page <= 1}
                variant="secondary"
                size="sm"
                className="h-7 text-xs"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={data.pagination.page >= data.pagination.totalPages}
                variant="secondary"
                size="sm"
                className="h-7 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Unpublish Confirmation Modal */}
      <Dialog open={!!skillToUnpublish} onOpenChange={(open) => !open && setSkillToUnpublish(null)}>
        <DialogContent className="border-[#1E2433] bg-[#0F1219] p-6 text-[#F8FAFC] sm:max-w-md">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300">
              <Undo2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Unpublish Skill &quot;{skillToUnpublish?.name}&quot;?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#94A3B8]">
              This will unpublish the skill and revert its status to <strong>DRAFT</strong>. It will no longer appear on the public marketplace until republished by the author.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setSkillToUnpublish(null)}
              disabled={actionLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnpublish}
              disabled={actionLoading}
              variant="primary"
              className="text-xs font-semibold shadow-md shadow-emerald-500/15"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Unpublish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Delete Confirmation Modal */}
      <Dialog open={!!skillToDelete} onOpenChange={(open) => !open && setSkillToDelete(null)}>
        <DialogContent className="border-rose-500/40 bg-[#0F1219] p-6 text-[#F8FAFC] sm:max-w-md">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-rose-500/60 bg-rose-500/15 text-rose-400">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-rose-300">
              Permanently Delete Skill &quot;{skillToDelete?.name}&quot;?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#94A3B8]">
              This will permanently delete this skill and all associated versions, files, and ratings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setSkillToDelete(null)}
              disabled={actionLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={actionLoading}
              variant="danger"
              className="text-xs font-semibold"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
