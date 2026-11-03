"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  CheckCircle2,
  GitBranch,
  ArrowLeft,
  FileCode,
  Layers,
  Settings as SettingsIcon,
  Eye,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MultiFileTree } from "@/components/editor/multi-file-tree";
import { MonacoCodeEditor } from "@/components/editor/monaco-code-editor";
import { MarkdownLivePreview } from "@/components/editor/markdown-live-preview";
import { NewVersionDialog } from "@/components/editor/new-version-dialog";
import { PublishConfirmDialog } from "@/components/editor/publish-confirm-dialog";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import { skillsApi } from "@/lib/api/skills";
import { SkillFile } from "@/types/skill";
import { toast } from "sonner";

export default function SkillEditStudioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const skillId = resolvedParams.slug;
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch skill
  const {
    data: skill,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["creator-skill", skillId],
    queryFn: () => skillsApi.getById(skillId),
  });

  // Local editing state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<SkillFile[]>([]);
  const [selectedPath, setSelectedPath] = useState("SKILL.md");
  const [showPreview, setShowPreview] = useState(true);

  // Dialogs
  const [newVersionOpen, setNewVersionOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const activeVersion = skill?.versions?.[0];
  const activeVersionNumber = activeVersion?.version || "1.0.0";
  const isPublished = skill?.status === "PUBLISHED";

  // Synchronize state when skill data loads
  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setDescription(skill.description);
      const initialFiles =
        skill.versions?.[0]?.files && skill.versions[0].files.length > 0
          ? skill.versions[0].files
          : [
              {
                path: "SKILL.md",
                content: `# ${skill.name}\n\n${skill.description}\n`,
                mimeType: "text/markdown",
              },
            ];
      setFiles(initialFiles);
      if (!initialFiles.some((f) => f.path === selectedPath)) {
        setSelectedPath(initialFiles[0]?.path || "SKILL.md");
      }
    }
  }, [skill]);

  // Selected file object
  const selectedFile = files.find((f) => f.path === selectedPath) || files[0];

  // File Handlers
  const handleContentChange = (newContent: string) => {
    if (!selectedFile) return;
    setFiles((prev) =>
      prev.map((f) => (f.path === selectedPath ? { ...f, content: newContent } : f))
    );
  };

  const handleAddFile = (newPath: string) => {
    const isMarkdown = newPath.endsWith(".md");
    const newFile: SkillFile = {
      path: newPath,
      content: isMarkdown ? `# ${newPath}\n\n` : "",
      mimeType: isMarkdown ? "text/markdown" : "text/plain",
    };
    setFiles((prev) => [...prev, newFile]);
    setSelectedPath(newPath);
  };

  const handleRenameFile = (oldPath: string, newPath: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === oldPath ? { ...f, path: newPath } : f))
    );
    if (selectedPath === oldPath) {
      setSelectedPath(newPath);
    }
  };

  const handleDeleteFile = (pathToDelete: string) => {
    setFiles((prev) => prev.filter((f) => f.path !== pathToDelete));
    if (selectedPath === pathToDelete) {
      setSelectedPath("SKILL.md");
    }
  };

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      if (!skill) return;
      await skillsApi.update(skill.id, {
        name,
        description,
      });

      if (activeVersion) {
        await skillsApi.updateVersion(skill.id, activeVersion.id, { files });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-skill", skillId] });
      toast.success("Draft saved successfully.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save draft.");
    },
  });

  // Create Version Mutation
  const handleCreateVersion = async (versionStr: string, changelog: string) => {
    if (!skill) return;
    try {
      await skillsApi.createVersion(skill.id, {
        version: versionStr,
        changelog,
        files,
      });
      queryClient.invalidateQueries({ queryKey: ["creator-skill", skillId] });
      toast.success(`Version ${versionStr} created!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create version.");
      throw err;
    }
  };

  // Publish Mutation
  const handlePublish = async () => {
    if (!skill) return;
    try {
      await saveDraftMutation.mutateAsync();
      await skillsApi.publish(skill.id, activeVersion?.id);
      queryClient.invalidateQueries({ queryKey: ["creator-skill", skillId] });
      toast.success(`"${name}" is now live on SkillAtlas!`);
      router.push(`/skills/${skill.slug}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to publish skill.");
      throw err;
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading skill studio..." />;
  }

  if (isError || !skill) {
    return (
      <ErrorState
        title="Could not load skill studio"
        message="The skill might not exist or you might not have creator permissions."
        actionLabel="Back to My Skills"
        onAction={() => router.push("/skills")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2433] pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="iconSm" title="Back to My Skills">
            <Link href="/skills">
              <ArrowLeft className="h-4 w-4 text-[#64748B]" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#F8FAFC] truncate max-w-sm sm:max-w-md">
                {name || skill.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                v{activeVersionNumber}
              </span>
              {skill.status === "PUBLISHED" ? (
                <Badge variant="success" className="text-[10px]">
                  Published
                </Badge>
              ) : (
                <Badge variant="warning" className="text-[10px]">
                  Draft
                </Badge>
              )}
            </div>
            <p className="text-[11px] font-mono text-[#64748B]">
              Slug: {skill.slug} • {files.length} files
            </p>
          </div>
        </div>

        {/* Studio Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isPublished && (
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href={`/skills/${skill.slug}`}>
                <Eye className="h-3.5 w-3.5 text-emerald-400" />
                <span>View Public</span>
              </Link>
            </Button>
          )}

          <Button
            onClick={() => saveDraftMutation.mutate()}
            disabled={saveDraftMutation.isPending}
            variant="secondary"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saveDraftMutation.isPending ? "Saving..." : "Save Draft"}</span>
          </Button>

          <Button
            onClick={() => setNewVersionOpen(true)}
            variant="secondary"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
            <span>Create Version</span>
          </Button>

          <Button
            onClick={() => setPublishOpen(true)}
            variant="primary"
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-md shadow-emerald-500/15"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Publish</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Tabs */}
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="bg-[#0F1219] border border-[#1E2433] mb-4">
          <TabsTrigger value="files" className="text-xs gap-1.5">
            <FileCode className="h-3.5 w-3.5" />
            <span>Files &amp; Code Editor</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="text-xs gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="text-xs gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            <span>Version Releases ({skill.versions?.length || 1})</span>
          </TabsTrigger>
        </TabsList>

        {/* 3-Pane Code Editor Tab */}
        <TabsContent value="files" className="mt-0">
          <div className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] flex flex-col lg:flex-row h-[600px] overflow-hidden shadow-2xl">
            {/* Left: Multi-File Tree */}
            <MultiFileTree
              files={files}
              selectedPath={selectedPath}
              onSelectFile={setSelectedPath}
              onAddFile={handleAddFile}
              onRenameFile={handleRenameFile}
              onDeleteFile={handleDeleteFile}
            />

            {/* Center: Monaco Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0F1219]">
              <div className="h-10 px-4 border-b border-[#1E2433] bg-[#090A0F] flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Editing: {selectedPath}
                </span>

                {selectedPath.endsWith(".md") && (
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="ghost"
                    size="xs"
                    className="text-[11px] text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                )}
              </div>

              <div className="flex-1 min-h-0">
                <MonacoCodeEditor
                  value={selectedFile?.content || ""}
                  onChange={handleContentChange}
                  language={
                    selectedPath.endsWith(".md")
                      ? "markdown"
                      : selectedPath.endsWith(".py")
                      ? "python"
                      : selectedPath.endsWith(".json")
                      ? "json"
                      : selectedPath.endsWith(".ts") || selectedPath.endsWith(".tsx")
                      ? "typescript"
                      : selectedPath.endsWith(".js") || selectedPath.endsWith(".jsx")
                      ? "javascript"
                      : "plaintext"
                  }
                />
              </div>
            </div>

            {/* Right: Live Markdown Preview (Collapsible) */}
            {showPreview && selectedPath.endsWith(".md") && (
              <div className="hidden lg:block w-80 shrink-0">
                <MarkdownLivePreview content={selectedFile?.content || ""} />
              </div>
            )}
          </div>
        </TabsContent>

        {/* Basic Info Tab */}
        <TabsContent value="info" className="mt-0 space-y-4">
          <div className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] p-6 max-w-2xl space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F8FAFC]">Skill Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F8FAFC]">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] text-xs"
              />
            </div>

            <Button
              onClick={() => saveDraftMutation.mutate()}
              disabled={saveDraftMutation.isPending}
              variant="primary"
              size="sm"
              className="shadow-md shadow-emerald-500/15"
            >
              {saveDraftMutation.isPending ? "Saving..." : "Save Metadata"}
            </Button>
          </div>
        </TabsContent>

        {/* Version Releases Tab */}
        <TabsContent value="versions" className="mt-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">
              Published versions are locked and immutable. Create a new release to publish updates.
            </span>
            <Button
              onClick={() => setNewVersionOpen(true)}
              variant="secondary"
              size="sm"
              className="text-xs gap-1.5"
            >
              <GitBranch className="h-3.5 w-3.5 text-emerald-400" />
              <span>New Version</span>
            </Button>
          </div>

          <div className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] divide-y divide-[#1E2433] shadow-xl">
            {skill.versions?.map((v) => (
              <div key={v.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#F8FAFC]">
                      v{v.version}
                    </span>
                    {v.publishedAt ? (
                      <Badge variant="success" className="text-[10px]">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">
                        Draft
                      </Badge>
                    )}
                  </div>
                  {v.changelog && (
                    <p className="text-xs text-[#94A3B8] mt-1 font-mono">{v.changelog}</p>
                  )}
                </div>
                <div className="text-xs font-mono text-[#64748B]">
                  {v.files?.length || 0} files
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Version & Publish Dialogs */}
      <NewVersionDialog
        open={newVersionOpen}
        onOpenChange={setNewVersionOpen}
        latestVersion={activeVersionNumber}
        onConfirm={handleCreateVersion}
      />

      <PublishConfirmDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        skillName={name}
        versionNumber={activeVersionNumber}
        onConfirm={handlePublish}
      />
    </div>
  );
}
