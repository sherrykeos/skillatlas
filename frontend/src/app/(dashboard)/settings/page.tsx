"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, AlertTriangle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/auth-context";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password. Verify current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="border-b border-[#1E2433] pb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
          Account &amp; Security Settings
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage your login credentials, security preferences, and account controls.
        </p>
      </div>

      {/* Email Overview */}
      <div className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Account Email</h3>
            <p className="text-xs text-[#94A3B8]">Primary email for notifications and login.</p>
          </div>
          <Badge variant="success" className="text-[10px] gap-1">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </Badge>
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <Input
            type="email"
            value={user?.email || ""}
            disabled
            className="pl-9 text-xs bg-[#161B26] text-[#94A3B8]"
          />
        </div>
      </div>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordChange} className="border border-[#1E2433] rounded-[12px] bg-[#0F1219] p-6 space-y-5 shadow-xl">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-emerald-400" />
            <span>Change Password</span>
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Update your password to keep your creator studio secure.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isChangingPassword}
            variant="primary"
            size="sm"
            className="font-semibold shadow-md shadow-emerald-500/15"
          >
            {isChangingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
