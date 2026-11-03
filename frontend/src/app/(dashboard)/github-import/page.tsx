"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCode,
  Folder,
  AlertTriangle,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/constants/categories";
import { githubApi } from "@/lib/api/github";
import { GitHubInspectResult, GitHubTreeItem } from "@/types/engagement";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

export default function GitHubImportPage() {
  const router = useRouter();
  const { user, isCreator, refreshUser } = useAuth();

  // Wizard Steps (1: Connect, 2: Select Files, 3: Configure, 4: Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Connect State
  const [repoUrl, setRepoUrl] = useState("https://github.com/");
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectData, setInspectData] = useState<GitHubInspectResult | null>(null);
  const [selectedBranch, setSelectedBranch] = useState("main");

  // Step 2: Tree Files State
  const [treeFiles, setTreeFiles] = useState<GitHubTreeItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // Step 3: Configure State
  const [skillName, setSkillName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("development");
  const [tags, setTags] = useState<string[]>(["github-import"]);
  const [tagInput, setTagInput] = useState("");

  // Step 4: Import State
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Inspect Handler
  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!repoUrl.trim() || repoUrl.trim() === "https://github.com/") {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    setIsInspecting(true);
    try {
      const data = await githubApi.inspect(repoUrl.trim());
      setInspectData(data);
      setSelectedBranch(data.repository.defaultBranch || data.branches[0]?.name || "main");
      setSkillName(data.repository.name || "Imported Skill");
      setDescription(data.repository.description || `Imported agent skill from ${data.repository.fullName}`);

      // Fetch Tree
      setIsLoadingTree(true);
      const tree = await githubApi.getTree(
        repoUrl.trim(),
        data.repository.defaultBranch || "main"
      );
      const files = tree.files || [];
      setTreeFiles(files);

      // Auto-select standard entry files if present, or first few files
      const allPaths = files.map((f) => f.path);
      const defaultSelected = allPaths.filter(
        (p) =>
          p === "SKILL.md" ||
          p.toLowerCase() === "readme.md" ||
          p === "package.json" ||
          p === "requirements.txt" ||
          p === "pyproject.toml" ||
          p === "index.js" ||
          p === "index.ts" ||
          p === "main.py" ||
          p.startsWith("scripts/") ||
          p.startsWith("src/")
      );
      const initialSelection =
        defaultSelected.length > 0 ? defaultSelected.slice(0, 20) : allPaths.slice(0, 5);
      setSelectedFiles(initialSelection);

      setCurrentStep(2);
      toast.success("Repository inspected successfully!");
    } catch (err: any) {
      const msg = err.message || "Failed to inspect GitHub repository.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsInspecting(false);
      setIsLoadingTree(false);
    }
  };

  // Branch change reload tree
  const handleBranchChange = async (branch: string) => {
    setSelectedBranch(branch);
    setIsLoadingTree(true);
    try {
      const tree = await githubApi.getTree(repoUrl.trim(), branch);
      setTreeFiles(tree.files || []);
    } catch (err: any) {
      toast.error("Failed to load file tree for branch: " + branch);
    } finally {
      setIsLoadingTree(false);
    }
  };

  // Toggle file selection
  const handleToggleFile = (path: string) => {
    if (selectedFiles.includes(path)) {
      setSelectedFiles(selectedFiles.filter((p) => p !== path));
    } else {
      if (selectedFiles.length >= 50) {
        toast.error("You can select up to 50 files.");
        return;
      }
      setSelectedFiles([...selectedFiles, path]);
    }
  };

  // Step 4: Confirm Import Handler
  const handleImport = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to import.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const result = await githubApi.importRepo({
        url: repoUrl.trim(),
        branch: selectedBranch,
        files: selectedFiles,
      });

      await refreshUser();
      toast.success(`Imported "${skillName}" as draft! Opening studio...`);
      const target = result.skill.slug || result.skill.id;
      router.push(`/skills/${target}/edit`);
    } catch (err: any) {
      const msg = err.message || "Failed to import GitHub repository.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsImporting(false);
    }
  };

  const hasSkillMd = selectedFiles.includes("SKILL.md");
  const repoHasSkillMd = treeFiles.some((f) => f.path === "SKILL.md");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2433] pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-emerald-400 transition-colors font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-mono text-emerald-400">GitHub Import Wizard</span>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
        {[
          { step: 1, label: "1. Connect" },
          { step: 2, label: "2. Select Files" },
          { step: 3, label: "3. Configure" },
          { step: 4, label: "4. Review" },
        ].map((item) => (
          <div
            key={item.step}
            className={`py-2 px-3 rounded-[6px] border transition-colors ${
              currentStep === item.step
                ? "bg-[#161B26] text-emerald-400 border-emerald-500/40 font-bold"
                : currentStep > item.step
                ? "bg-[#0F1219] text-emerald-300 border-emerald-500/20"
                : "bg-[#0F1219] text-[#64748B] border-[#1E2433]"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-[8px] border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Connect */}
      {currentStep === 1 && (
        <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2">
              <GithubIcon className="h-5 w-5 text-emerald-400" />
              <span>Connect Public GitHub Repository</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Enter the full HTTPS URL of a public repository containing your skill specification.
            </p>
          </div>

          <form onSubmit={handleInspect} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F8FAFC]">Repository URL</label>
              <Input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/skill-repository"
                required
                className="text-xs font-mono"
              />
              <p className="text-[10px] text-[#64748B]">
                Public repositories only. Private repository tokens are not required.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isInspecting}
                variant="primary"
                size="default"
                className="gap-2 font-semibold shadow-md shadow-emerald-500/15"
              >
                {isInspecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Inspecting Repository...</span>
                  </>
                ) : (
                  <>
                    <span>Inspect Repository</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: Select Files */}
      {currentStep === 2 && inspectData && (
        <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2433] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC]">
                Select Skill Files ({selectedFiles.length} selected)
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Choose up to 50 files to import into your SkillAtlas draft.
              </p>
            </div>

            <div className="w-[180px]">
              <Select value={selectedBranch} onValueChange={handleBranchChange}>
                <SelectTrigger className="h-8 bg-[#161B26] border-[#1E2433] text-xs">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1219] border-[#1E2433]">
                  {inspectData.branches.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!repoHasSkillMd ? (
            <div className="p-3.5 rounded-[8px] border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong className="text-emerald-200">Public Repository Auto-Synthesis:</strong> No{" "}
                <code className="bg-[#090A0F] px-1 py-0.5 rounded text-emerald-400 font-mono text-[11px]">SKILL.md</code>{" "}
                found. SkillAtlas will automatically generate a standard agent skill specification from your repository README and code structure on import.
              </div>
            </div>
          ) : !hasSkillMd ? (
            <div className="p-3 rounded-[8px] border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                <strong>Note:</strong> <code className="font-mono">SKILL.md</code> exists in this repository but is not selected. If unselected, a synthesized specification will be generated.
              </span>
            </div>
          ) : null}

          {/* Tree Files Picker */}
          <div className="border border-[#1E2433] rounded-[8px] bg-[#090A0F] max-h-80 overflow-y-auto divide-y divide-[#1E2433]">
            {treeFiles.map((file) => {
              const isChecked = selectedFiles.includes(file.path);
              const isSkillMd = file.path === "SKILL.md";

              return (
                <label
                  key={file.path}
                  className="flex items-center justify-between p-2.5 px-3 hover:bg-[#161B26]/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleFile(file.path)}
                    />
                    <span className="text-xs font-mono text-[#F8FAFC]">
                      {file.path}
                    </span>
                    {isSkillMd && (
                      <Badge variant="brand" className="text-[10px]">
                        Specification
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B]">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="ghost"
              size="sm"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={selectedFiles.length === 0}
              variant="primary"
              size="default"
              className="gap-1.5 font-semibold shadow-md shadow-emerald-500/15"
            >
              <span>Next: Configure Metadata</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Configure Metadata */}
      {currentStep === 3 && (
        <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              Configure Skill Details
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Review the imported name, description, category, and tags.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F8FAFC]">Skill Name</label>
              <Input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F8FAFC]">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px] text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#F8FAFC]">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 bg-[#0F1219] border-[#1E2433] text-xs">
                    <SelectValue placeholder="Category" />
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
                <label className="text-xs font-medium text-[#F8FAFC]">Branch</label>
                <Input
                  type="text"
                  value={selectedBranch}
                  disabled
                  className="text-xs font-mono bg-[#161B26]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="ghost"
              size="sm"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              disabled={!skillName.trim()}
              variant="primary"
              size="default"
              className="gap-1.5 font-semibold shadow-md shadow-emerald-500/15"
            >
              <span>Next: Review &amp; Import</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Final Import */}
      {currentStep === 4 && (
        <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              Review &amp; Import Snapshot
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Verify your snapshot configuration before creating the draft.
            </p>
          </div>

          <div className="border border-[#1E2433] rounded-[8px] bg-[#090A0F] p-5 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[#64748B] block">Repository:</span>
                <span className="text-[#F8FAFC] truncate block">{repoUrl}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Branch:</span>
                <span className="text-emerald-400">{selectedBranch}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Skill Name:</span>
                <span className="text-[#F8FAFC]">{skillName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Category:</span>
                <span className="text-emerald-400 capitalize">{category}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2433]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#64748B]">
                  Selected Files ({selectedFiles.length}):
                </span>
                {!hasSkillMd && (
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 font-sans">
                    <Sparkles className="h-3 w-3" />
                    Auto-synthesizes SKILL.md
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded bg-[#161B26] border border-[#1E2433]">
                {selectedFiles.map((file) => (
                  <span
                    key={file}
                    className="px-2 py-0.5 rounded text-[11px] bg-[#090A0F] border border-[#1E2433] text-[#94A3B8]"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="ghost"
              size="sm"
            >
              Back
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              variant="primary"
              size="default"
              className="gap-2 font-semibold shadow-md shadow-emerald-500/15"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Importing Snapshot...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Import as Draft</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
