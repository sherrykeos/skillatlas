"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  FileCode,
  MessageSquare,
  ArrowLeft,
  LogOut,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { LoadingState } from "@/components/common/loading-state";
import { Logo } from "@/components/layout/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0F]">
        <LoadingState message="Verifying administrative credentials..." />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const navItems = [
    { title: "Platform Overview", href: "/admin", icon: ShieldCheck },
    { title: "Users Moderation", href: "/admin/users", icon: Users },
    { title: "Skills Moderation", href: "/admin/skills", icon: FileCode },
    { title: "Reviews Moderation", href: "/admin/reviews", icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-[#090A0F]">
      {/* Admin Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#1E2433] bg-[#0F1219] md:flex shadow-lg">
        {/* Brand Header */}
        <div className="flex h-15 items-center justify-between border-b border-[#1E2433] px-6 bg-[#090A0F]">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
            Moderation &amp; Control
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-[8px] px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "border border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-400 shadow-sm"
                    : "text-[#94A3B8] hover:bg-[#161B26]/60 hover:text-[#F8FAFC]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? "text-emerald-400" : "text-[#64748B]"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="px-3 pb-2 pt-6 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
            Navigation
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2 text-xs font-medium text-[#94A3B8] transition-all hover:bg-[#161B26]/60 hover:text-[#F8FAFC]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-[#64748B]" />
            <span>Back to SkillAtlas</span>
          </Link>
        </div>

        {/* Admin User Footer */}
        {user && (
          <div className="border-t border-[#1E2433] bg-[#090A0F]/60 p-3">
            <div className="flex items-center justify-between gap-2 rounded-[8px] border border-[#1E2433] bg-[#161B26] p-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Avatar className="h-7 w-7 border border-emerald-500/40">
                  <AvatarImage src={user.avatar || undefined} alt={user.username} />
                  <AvatarFallback className="text-[10px] text-emerald-400 font-semibold">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-semibold text-[#F8FAFC]">
                      {user.username}
                    </p>
                    <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-400 font-mono">
                      SUPERADMIN
                    </span>
                  </div>
                  <p className="truncate text-[10px] text-[#64748B]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="rounded p-1 text-[#64748B] transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Admin Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#1E2433] bg-[#0F1219] px-4 md:hidden">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-400 font-mono">
              Admin
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Exit</span>
          </Link>
        </div>

        {/* Mobile Sub-Nav */}
        <div className="flex gap-2 overflow-x-auto border-b border-[#1E2433] bg-[#090A0F] p-2 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                  isActive
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "text-[#64748B]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.title.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 pb-20 sm:p-6 md:pb-8 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
