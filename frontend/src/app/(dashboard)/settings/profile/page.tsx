"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Globe, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";
import { usersApi } from "@/lib/api/users";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const { user, refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await usersApi.updateMe({
        username: username.trim() || undefined,
        avatar: avatar.trim() || null,
      });
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-[#1E2433] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
          Profile Settings
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage your public creator identity and profile attributes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 space-y-5 shadow-xl">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4 pb-4 border-b border-[#1E2433]">
          <Avatar className="h-14 w-14 border border-[#1E2433] bg-[#161B26]">
            <AvatarImage src={avatar || undefined} alt={username} />
            <AvatarFallback className="text-sm font-semibold text-emerald-400">{getInitials(username)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-[#F8FAFC]">Avatar Preview</h3>
            <p className="text-[11px] text-[#64748B]">
              Set an image URL below to update your public avatar across SkillAtlas.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F8FAFC]">Username</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-xs font-mono"
          />
          <p className="text-[10px] text-[#64748B]">
            Your public URL handle: skillatlas.dev/users/{username || "username"}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#F8FAFC]">Avatar Image URL</label>
          <Input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.png"
            className="text-xs font-mono"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            variant="primary"
            size="sm"
            className="font-semibold shadow-md shadow-emerald-500/15"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
