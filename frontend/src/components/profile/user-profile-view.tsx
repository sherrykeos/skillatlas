"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Heart,
  Download,
  FolderHeart,
  Boxes,
  Sparkles,
  LayoutDashboard,
  Settings,
  Share2,
  Calendar,
  Globe,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  Compass,
  User,
  Camera,
  Loader2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { LoadingState } from "@/components/common/loading-state";
import { useAuth } from "@/lib/auth/auth-context";
import { engagementApi } from "@/lib/api/engagement";
import { usersApi } from "@/lib/api/users";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { Skill } from "@/types/skill";

interface UserProfileViewProps {
  profile: {
    id: string;
    username: string;
    avatar?: string | null;
    role?: string;
    bio?: string | null;
    website?: string | null;
    github?: string | null;
    createdAt?: string;
    skills?: Skill[];
    _count?: {
      skills?: number;
      downloads?: number;
      upvotes?: number;
    };
  };
  isOwner?: boolean;
}

export function UserProfileView({ profile, isOwner = false }: UserProfileViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: authUser, isCreator, becomeCreator, refreshUser } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editAvatar, setEditAvatar] = useState(profile.avatar || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const openEditModal = () => {
    setEditUsername(profile.username);
    setEditAvatar(profile.avatar || "");
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editUsername.trim().length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    try {
      setIsSavingProfile(true);
      const updated = await usersApi.updateMe({
        username: editUsername.trim() || undefined,
        avatar: editAvatar.trim() || null,
      });
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully!");
      setEditModalOpen(false);

      if (updated?.username && updated.username !== profile.username) {
        router.replace(`/users/${updated.username}`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Default tab: if owner and not creator, default to "saved". If creator, default to "published" or "saved"
  const isProfileCreator = profile.role === "CREATOR" || profile.role === "ADMIN" || (isOwner && isCreator);
  const [activeTab, setActiveTab] = useState<string>(
    isOwner ? (isProfileCreator ? "published" : "saved") : "published"
  );

  // Stats queries for owner (saved, liked, downloads, collections)
  const { data: libraryStats } = useQuery({
    queryKey: ["user-library-stats"],
    queryFn: () => engagementApi.getLibraryStats(),
    enabled: isOwner,
  });

  // Queries for owner tabs
  const { data: savedData, isLoading: isLoadingSaved } = useQuery({
    queryKey: ["user-saved-skills"],
    queryFn: () => engagementApi.getSavedSkills(),
    enabled: isOwner && activeTab === "saved",
  });

  const { data: likedData, isLoading: isLoadingLiked } = useQuery({
    queryKey: ["user-liked-skills"],
    queryFn: () => engagementApi.getLikedSkills(),
    enabled: isOwner && activeTab === "liked",
  });

  const { data: downloadedData, isLoading: isLoadingDownloaded } = useQuery({
    queryKey: ["user-downloaded-skills"],
    queryFn: () => engagementApi.getDownloadedSkills(),
    enabled: isOwner && activeTab === "downloads",
  });

  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["user-collections"],
    queryFn: () => engagementApi.getCollections(),
    enabled: isOwner && activeTab === "collections",
  });

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const handleBecomeCreator = async () => {
    try {
      setIsUpgrading(true);
      await becomeCreator();
      toast.success("Congratulations! Creator status activated. Welcome to Creator Studio!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-skills"] });
    } catch (err: any) {
      toast.error(err?.message || "Failed to activate creator mode. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const savedSkills: Skill[] =
    savedData?.savedSkills?.map((item) => ({
      ...item.skill,
      hasSaved: true,
    })) || [];

  const likedSkills: Skill[] =
    likedData?.likedSkills?.map((item) => ({
      ...item.skill,
      hasUpvoted: true,
    })) || [];

  const downloadedSkills: Skill[] =
    downloadedData?.downloadedSkills?.map((item) => item.skill) || [];

  const collections = collectionsData?.collections || [];
  const publishedSkills = profile.skills || [];

  // Counts
  const savedCount = libraryStats?.savedCount ?? (savedSkills.length || 0);
  const likedCount = libraryStats?.likedCount ?? (likedSkills.length || 0);
  const downloadedCount = libraryStats?.downloadedCount ?? (downloadedSkills.length || 0);
  const publishedCount = profile._count?.skills ?? publishedSkills.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header Profile Section (Instagram Style) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 border-b border-[#252D28] pb-8">
        {/* Avatar with gradient accent ring */}
        <div className="relative shrink-0">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#252D28] via-[#30E87F]/30 to-[#30E87F]/60">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-[#080B0A] bg-[#0E1210]">
              <AvatarImage src={profile.avatar || undefined} alt={profile.username} />
              <AvatarFallback className="text-2xl font-bold bg-[#141A17] text-[#CCD7C5]">
                {getInitials(profile.username)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Top Line: Username, Role, Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-between">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F1F4EF] tracking-tight">
                @{profile.username}
              </h1>
              {isProfileCreator ? (
                <Badge className="bg-[#30E87F]/10 text-[#30E87F] border-[#30E87F]/30 text-xs gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Creator</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-[#A9B1AA] border-[#252D28] bg-[#141916]">
                  Visitor
                </Badge>
              )}
            </div>

            {/* Action Buttons for Owner */}
            {isOwner && (
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 pt-1 sm:pt-0">
                {!isCreator ? (
                  <Button
                    onClick={handleBecomeCreator}
                    disabled={isUpgrading}
                    className="bg-[#30E87F] hover:bg-[#28C76D] text-[#080B0A] font-semibold text-xs gap-1.5 shadow-md shadow-[#30E87F]/10"
                    size="sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isUpgrading ? "Activating..." : "Become a Creator"}</span>
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="sm" className="border-[#30E87F]/40 text-[#30E87F] hover:bg-[#30E87F]/10 text-xs gap-1.5 font-medium">
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      <span>Creator Dashboard</span>
                    </Link>
                  </Button>
                )}

                <Button
                  onClick={openEditModal}
                  variant="secondary"
                  size="sm"
                  className="text-xs gap-1.5 cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Edit Profile</span>
                </Button>

                <Button onClick={handleShare} variant="ghost" size="sm" className="text-xs text-[#707A72] hover:text-[#F1F4EF] p-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {!isOwner && (
              <Button onClick={handleShare} variant="secondary" size="sm" className="text-xs gap-1.5 mx-auto sm:mx-0">
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Profile</span>
              </Button>
            )}
          </div>

          {/* Stats Row (Instagram Style: counts | labels) */}
          <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 text-sm font-mono pt-1">
            {isProfileCreator && (
              <button
                onClick={() => setActiveTab("published")}
                className="text-left hover:opacity-80 transition-opacity"
              >
                <span className="font-bold text-[#F1F4EF] text-base">{publishedCount}</span>{" "}
                <span className="text-xs text-[#707A72]">skills</span>
              </button>
            )}
            {isOwner && (
              <>
                <button
                  onClick={() => setActiveTab("saved")}
                  className="text-left hover:opacity-80 transition-opacity"
                >
                  <span className="font-bold text-[#F1F4EF] text-base">{savedCount}</span>{" "}
                  <span className="text-xs text-[#707A72]">saved</span>
                </button>
                <button
                  onClick={() => setActiveTab("liked")}
                  className="text-left hover:opacity-80 transition-opacity"
                >
                  <span className="font-bold text-[#F1F4EF] text-base">{likedCount}</span>{" "}
                  <span className="text-xs text-[#707A72]">liked</span>
                </button>
                <button
                  onClick={() => setActiveTab("downloads")}
                  className="text-left hover:opacity-80 transition-opacity"
                >
                  <span className="font-bold text-[#F1F4EF] text-base">{downloadedCount}</span>{" "}
                  <span className="text-xs text-[#707A72]">downloads</span>
                </button>
              </>
            )}
            {!isOwner && isProfileCreator && (
              <>
                <div>
                  <span className="font-bold text-[#CCD7C5] text-base">
                    {formatNumber(profile._count?.downloads ?? 0)}
                  </span>{" "}
                  <span className="text-xs text-[#707A72]">downloads</span>
                </div>
                <div>
                  <span className="font-bold text-[#9FB8B2] text-base">
                    {formatNumber(profile._count?.upvotes ?? 0)}
                  </span>{" "}
                  <span className="text-xs text-[#707A72]">upvotes</span>
                </div>
              </>
            )}
          </div>

          {/* Bio & Details */}
          <div className="space-y-2 text-xs">
            <p className="text-[#A9B1AA] max-w-xl leading-relaxed">
              {profile.bio ||
                (isOwner
                  ? "Exploring autonomous agent skills & toolkits on SkillAtlas."
                  : "SkillAtlas community developer.")}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[#707A72] font-mono text-[11px] pt-1">
              {profile.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(profile.createdAt)}</span>
                </div>
              )}
              {profile.github && (
                <a
                  href={profile.github.startsWith("http") ? profile.github : `https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#CCD7C5] transition-colors"
                >
                  <GithubIcon className="h-3 w-3" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#CCD7C5] transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Become a Creator Banner for Visitors */}
      {isOwner && !isCreator && (
        <div className="rounded-xl border border-[#30E87F]/25 bg-gradient-to-r from-[#141A17] via-[#0E1210] to-[#141A17] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#30E87F]/10 border border-[#30E87F]/30 text-[#30E87F]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#F1F4EF]">
                Want to publish and share your own skills?
              </h3>
              <p className="text-xs text-[#A9B1AA]">
                Become a Creator in 1 click to unlock skill publishing, GitHub sync, and the Creator Analytics Dashboard.
              </p>
            </div>
          </div>
          <Button
            onClick={handleBecomeCreator}
            disabled={isUpgrading}
            className="w-full sm:w-auto shrink-0 bg-[#30E87F] hover:bg-[#28C76D] text-[#080B0A] font-semibold text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isUpgrading ? "Activating..." : "Become a Creator"}</span>
          </Button>
        </div>
      )}

      {/* Instagram-Style Centered Icon Tab Bar */}
      <div className="space-y-6">
        <div className="border-t border-[#252D28] flex items-center justify-center gap-2 sm:gap-8">
          {/* Published Skills Tab (for creators) */}
          {(isProfileCreator || !isOwner) && (
            <button
              onClick={() => setActiveTab("published")}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-all border-t-2 -mt-px ${
                activeTab === "published"
                  ? "border-[#30E87F] text-[#F1F4EF]"
                  : "border-transparent text-[#707A72] hover:text-[#A9B1AA]"
              }`}
            >
              <Boxes className="h-4 w-4" />
              <span>Skills ({publishedCount})</span>
            </button>
          )}

          {/* Owner Tabs */}
          {isOwner && (
            <>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-all border-t-2 -mt-px ${
                  activeTab === "saved"
                    ? "border-[#30E87F] text-[#F1F4EF]"
                    : "border-transparent text-[#707A72] hover:text-[#A9B1AA]"
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>Saved ({savedCount})</span>
              </button>

              <button
                onClick={() => setActiveTab("liked")}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-all border-t-2 -mt-px ${
                  activeTab === "liked"
                    ? "border-[#30E87F] text-[#F1F4EF]"
                    : "border-transparent text-[#707A72] hover:text-[#A9B1AA]"
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Liked ({likedCount})</span>
              </button>

              <button
                onClick={() => setActiveTab("downloads")}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-all border-t-2 -mt-px ${
                  activeTab === "downloads"
                    ? "border-[#30E87F] text-[#F1F4EF]"
                    : "border-transparent text-[#707A72] hover:text-[#A9B1AA]"
                }`}
              >
                <Download className="h-4 w-4" />
                <span>Downloads ({downloadedCount})</span>
              </button>

              <button
                onClick={() => setActiveTab("collections")}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider transition-all border-t-2 -mt-px ${
                  activeTab === "collections"
                    ? "border-[#30E87F] text-[#F1F4EF]"
                    : "border-transparent text-[#707A72] hover:text-[#A9B1AA]"
                }`}
              >
                <FolderHeart className="h-4 w-4" />
                <span>Collections ({collections.length})</span>
              </button>
            </>
          )}
        </div>

        {/* Tab Contents */}
        <div>
          {/* Published Tab */}
          {activeTab === "published" && (
            <SkillGrid
              skills={publishedSkills}
              emptyTitle={isOwner ? "You haven't published any skills yet" : "No published skills"}
              emptyDescription={
                isOwner
                  ? "Package your prompts, tools, and workflows into an agentic skill to share with the community."
                  : `@${profile.username} has not published any public agentic skills yet.`
              }
              actionLabel={isOwner ? (isCreator ? "Create Your First Skill" : "Become a Creator to Publish") : undefined}
              actionHref={isOwner ? (isCreator ? "/skills/new" : "/become-creator") : undefined}
            />
          )}

          {/* Saved Tab */}
          {isOwner && activeTab === "saved" && (
            isLoadingSaved ? (
              <LoadingState message="Loading your saved skills..." />
            ) : (
              <SkillGrid
                skills={savedSkills}
                emptyTitle="No saved skills yet"
                emptyDescription="When you bookmark skills in the marketplace, they will appear here so you can easily reference them."
                actionLabel="Explore Skills"
                actionHref="/explore"
                onSaveToggle={() => {
                  queryClient.invalidateQueries({ queryKey: ["user-saved-skills"] });
                  queryClient.invalidateQueries({ queryKey: ["user-library-stats"] });
                }}
              />
            )
          )}

          {/* Liked Tab */}
          {isOwner && activeTab === "liked" && (
            isLoadingLiked ? (
              <LoadingState message="Loading your liked skills..." />
            ) : (
              <SkillGrid
                skills={likedSkills}
                emptyTitle="No liked skills yet"
                emptyDescription="Skills you upvote in the marketplace and discovery feed will be saved here."
                actionLabel="Discover Skills"
                actionHref="/explore"
              />
            )
          )}

          {/* Downloads Tab */}
          {isOwner && activeTab === "downloads" && (
            isLoadingDownloaded ? (
              <LoadingState message="Loading your download history..." />
            ) : (
              <SkillGrid
                skills={downloadedSkills}
                emptyTitle="No downloaded skills yet"
                emptyDescription="When you download or install agent skills, they will appear here for fast re-downloading."
                actionLabel="Browse Marketplace"
                actionHref="/explore"
              />
            )
          )}

          {/* Collections Tab */}
          {isOwner && activeTab === "collections" && (
            isLoadingCollections ? (
              <LoadingState message="Loading your collections..." />
            ) : collections.length === 0 ? (
              <div className="border border-[#252D28] rounded-[10px] bg-[#0E1210] p-8 text-center space-y-4 max-w-md mx-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#141A17] border border-[#252D28] text-[#707A72] mx-auto">
                  <FolderHeart className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#F1F4EF]">No collections created yet</h3>
                  <p className="text-xs text-[#A9B1AA]">
                    Organize your favorite agent skills into curated bundles like "Research Suite" or "Coding Helpers".
                  </p>
                </div>
                <Button asChild variant="primary" size="sm" className="text-xs gap-1.5">
                  <Link href="/collections">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Create Collection</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {collections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.id}`}
                    className="group border border-[#252D28] rounded-[8px] bg-[#0E1210] p-5 space-y-3 hover:border-[#CCD7C5]/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FolderHeart className="h-5 w-5 text-[#30E87F]" />
                        <span className="text-[11px] font-mono text-[#707A72]">
                          {col.skills?.length || 0} skills
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#F1F4EF] group-hover:text-[#30E87F] transition-colors">
                        {col.name}
                      </h4>
                      {col.description && (
                        <p className="text-xs text-[#A9B1AA] line-clamp-2">
                          {col.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-2 border-t border-[#1A211D] flex items-center justify-between text-[11px] font-mono text-[#707A72]">
                      <span>View toolkit</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Inline Edit Profile Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#0E1210] border border-[#252D28] p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#F1F4EF]">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A9B1AA]">
              Update your public identity and profile avatar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4 p-3 rounded-[8px] border border-[#1A211D] bg-[#141A17]">
              <Avatar className="h-14 w-14 border border-[#252D28] shrink-0">
                <AvatarImage src={editAvatar || undefined} alt={editUsername} />
                <AvatarFallback className="text-sm font-bold bg-[#141916] text-[#CCD7C5]">
                  {getInitials(editUsername || profile.username)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-semibold text-[#F1F4EF] truncate">
                  @{editUsername || profile.username}
                </h4>
                <p className="text-[11px] text-[#707A72]">
                  Live preview of how others will see your avatar.
                </p>
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Username Handle</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-[#707A72] font-mono">@</span>
                <Input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="developer_handle"
                  required
                  className="pl-7 text-xs font-mono"
                />
              </div>
              <p className="text-[10px] text-[#707A72]">
                Letters, numbers, and underscores only. Must be at least 3 characters.
              </p>
            </div>

            {/* Avatar URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#F1F4EF]">Avatar Image URL</label>
              <Input
                type="url"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://github.com/..."
                className="text-xs font-mono"
              />
              <p className="text-[10px] text-[#707A72]">
                Direct image link (PNG, JPG, or WebP). Leave blank to use letter initials.
              </p>
            </div>

            <DialogFooter className="pt-2 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditModalOpen(false)}
                disabled={isSavingProfile}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSavingProfile}
                className="text-xs font-semibold"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

