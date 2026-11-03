"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/lib/theme/theme-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  variant?: "icon" | "dropdown";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-8 w-8 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] ${className}`} />
    );
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Select theme"
            className={`inline-flex items-center justify-center h-8 w-8 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)]/40 transition-colors ${className}`}
          >
            {resolvedTheme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 bg-[var(--surface-elevated)] border-[var(--border)]">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={`text-xs flex items-center gap-2 cursor-pointer ${
              theme === "light" ? "text-[var(--primary)] font-semibold" : "text-[var(--text-primary)]"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={`text-xs flex items-center gap-2 cursor-pointer ${
              theme === "dark" ? "text-[var(--primary)] font-semibold" : "text-[var(--text-primary)]"
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className={`text-xs flex items-center gap-2 cursor-pointer ${
              theme === "system" ? "text-[var(--primary)] font-semibold" : "text-[var(--text-primary)]"
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)]/40 transition-colors ${className}`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

