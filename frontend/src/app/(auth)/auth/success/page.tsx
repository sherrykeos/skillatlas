"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

export default function AuthSuccessPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    refreshUser()
      .then(() => {
        toast.success("Successfully logged in!");
        router.replace("/");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router, refreshUser]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#94A3B8]">Signing you in...</p>
    </div>
  );
}
