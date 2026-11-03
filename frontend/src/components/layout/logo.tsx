import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const iconDimensions = {
    sm: { width: 26, height: 26, className: "w-6.5 h-6.5" },
    md: { width: 34, height: 34, className: "w-8.5 h-8.5" },
    lg: { width: 44, height: 44, className: "w-11 h-11" },
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const dim = iconDimensions[size];

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 group select-none", className)}
    >
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
          dim.className
        )}
      >
        <Image
          src="/logo.png"
          alt="SkillAtlas Logo"
          width={dim.width}
          height={dim.height}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(52,211,153,0.35)]"
        />
      </div>

      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight text-[#F8FAFC] transition-colors group-hover:text-white flex items-center",
            textSizes[size]
          )}
        >
          <span>Skill</span>
          <span className="text-emerald-400 font-extrabold">Atlas</span>
        </span>
      )}
    </Link>
  );
}
