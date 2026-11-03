"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  Bookmark,
  FolderHeart,
  User,
  Settings,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  LogOut,
  Sparkles,
  Users,
  MessageSquare,
  FileCode,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/auth-context";
import { getInitials } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  Github: GithubIcon,
  Bookmark,
  FolderHeart,
  User,
  Settings,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  Sparkles,
  Users,
  MessageSquare,
  FileCode,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isCreator, isAdmin, logout } = useAuth();

  const userItems = [
    ...(isCreator
      ? [{ title: "Dashboard", href: "/dashboard", iconName: "LayoutDashboard" }]
      : [{ title: "My Profile", href: "/profile", iconName: "User" }]),
    ...(!isCreator
      ? [{ title: "Become a Creator", href: "/become-creator", iconName: "Sparkles", highlight: true }]
      : []),
    ...(isCreator
      ? [
          { title: "My Skills", href: "/skills", iconName: "Boxes" },
          { title: "Create Skill", href: "/skills/new", iconName: "PlusCircle" },
          { title: "Import from GitHub", href: "/github-import", iconName: "Github" },
        ]
      : []),
    { title: "Saved", href: "/saved", iconName: "Bookmark" },
    { title: "Collections", href: "/collections", iconName: "FolderHeart" },
    ...(isCreator
      ? [{ title: "Public Profile", href: user?.username ? `/users/${user.username}` : "/profile", iconName: "User" }]
      : []),
    { title: "Settings", href: "/settings", iconName: "Settings" },
  ];

  const adminItems = [
    { title: "Admin Overview", href: "/admin", iconName: "ShieldCheck" },
    { title: "Users Moderation", href: "/admin/users", iconName: "Users" },
    { title: "Skills Moderation", href: "/admin/skills", iconName: "FileCode" },
    { title: "Reviews Moderation", href: "/admin/reviews", iconName: "MessageSquare" },
  ];

  const footerItems = [
    { title: "Documentation", href: "/docs", iconName: "BookOpen" },
    { title: "Help & Community", href: "https://github.com", isExternal: true, iconName: "HelpCircle" },
  ];

  return (
    <aside className="w-64 border-r border-[#1E2433] bg-[#0F1219] flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-14 px-6 border-b border-[#1E2433] flex items-center justify-between">
        <Logo size="sm" />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
          {isCreator ? "Creator Studio" : "Workspace"}
        </div>
        {userItems.map((item) => {
          const Icon = ICONS[item.iconName] || Boxes;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium transition-all ${
                item.highlight
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-semibold"
                  : isActive
                  ? "bg-[#161B26] text-emerald-400 border border-[#1E2433] shadow-sm font-semibold"
                  : "text-[#94A3B8] hover:bg-[#161B26]/60 hover:text-[#F8FAFC]"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  item.highlight
                    ? "text-emerald-400"
                    : isActive
                    ? "text-emerald-400"
                    : "text-[#64748B]"
                }`}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* Dedicated Admin Section */}
        {isAdmin && (
          <>
            <div className="pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">
              Admin Console
            </div>
            {adminItems.map((item) => {
              const Icon = ICONS[item.iconName] || ShieldCheck;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm font-semibold"
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
          </>
        )}

        <div className="pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
          Resources
        </div>
        {footerItems.map((item) => {
          const Icon = ICONS[item.iconName] || BookOpen;

          return (
            <Link
              key={item.href}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-xs font-medium text-[#94A3B8] hover:bg-[#161B26]/60 hover:text-[#F8FAFC] transition-all"
            >
              <Icon className="h-4 w-4 shrink-0 text-[#64748B]" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile Card */}
      {user && (
        <div className="p-3 border-t border-[#1E2433] bg-[#090A0F]/60">
          <div className="flex items-center justify-between gap-2 p-2 rounded-[8px] bg-[#161B26] border border-[#1E2433]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Avatar className="h-7 w-7 border border-[#1E2433]">
                <AvatarImage src={user.avatar || undefined} alt={user.username} />
                <AvatarFallback className="text-[10px]">{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-[#F8FAFC] truncate">{user.username}</p>
                  {user.role && user.role !== "USER" && (
                    <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-semibold text-emerald-400">
                      {user.role}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#64748B] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1 text-[#64748B] hover:text-rose-400 transition-colors rounded hover:bg-rose-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
