"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowLeft, Code2, Tag, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/constants/categories";
import { skillsApi } from "@/lib/api/skills";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

export default function CreateSkillPage() {
  const router = useRouter();
  const { isCreator, becomeCreator } = useAuth();
  const [activatingCreator, setActivatingCreator] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("development");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["agent", "tools"]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
        setTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      setError("Skill name must be at least 3 characters.");
      return;
    }

    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const skill = await skillsApi.create({
        name: name.trim(),
        description: description.trim(),
        tags,
      });

      toast.success(`Draft "${skill.name}" initialized! Opening studio...`);
      router.push(`/skills/${skill.id}/edit`);
    } catch (err: any) {
      const msg = err.message || "Failed to create skill draft.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateCreator = async () => {
    try {
      setActivatingCreator(true);
      await becomeCreator();
      toast.success("Creator access activated!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to activate creator mode.");
    } finally {
      setActivatingCreator(false);
    }
  };

  if (!isCreator) {
    return (
      <div className="mx-auto max-w-xl space-y-6 py-10">
        <div className="rounded-[12px] border border-[#1E2433] bg-[#0F1219] p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">
            Creator Access Required
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs text-[#94A3B8]">
            Publishing and editing agent skills requires Creator status. Activation is instant, free, and opens full authoring studio capabilities.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={handleActivateCreator}
              disabled={activatingCreator}
              variant="primary"
              className="w-full font-semibold sm:w-auto shadow-md shadow-emerald-500/15"
            >
              {activatingCreator ? "Activating..." : "Activate Creator Access (Instant)"}
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between border-b border-[#1E2433] pb-4">
        <Link
          href="/skills"
          className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-emerald-400 transition-colors font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to My Skills</span>
        </Link>
        <span className="text-xs font-mono text-emerald-400">New Skill Studio</span>
      </div>

      <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
            Create a New Agentic Skill
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Set up skill metadata and initialize your multi-file SKILL.md editor workspace.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-[8px] border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Skill Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React Performance Analyzer"
              required
              className="text-xs"
            />
            <p className="text-[10px] text-[#64748B]">
              A concise descriptive name for the capability.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this skill enables agents to do, what tools it orchestrates, and typical use cases..."
              required
              className="min-h-[100px] text-xs"
            />
            <p className="text-[10px] text-[#64748B]">
              Shown on marketplace search and cards (minimum 10 characters).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F8FAFC]">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 bg-[#0F1219] border-[#1E2433] text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1219] border-[#1E2433]">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F8FAFC]">Tags (up to 10)</label>
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press Enter"
                className="text-xs"
              />
            </div>
          </div>

          {/* Tag Pills */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-[#161B26] border border-[#1E2433] text-emerald-400 font-mono"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#64748B] hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-[#1E2433] flex items-center justify-end gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/skills">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="default"
              className="gap-2 font-semibold shadow-md shadow-emerald-500/15"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isSubmitting ? "Initializing..." : "Create Skill Draft"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
