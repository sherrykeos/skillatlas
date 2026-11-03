"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredToken } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google authentication failed. Please try again.");
      router.replace("/login");
      return;
    }

    if (token) {
      setStoredToken(token);
      refreshUser()
        .then(() => {
          toast.success("Successfully signed in with Google!");
          router.replace("/");
        })
        .catch(() => {
          toast.error("Failed to load user profile.");
          router.replace("/login");
        });
    } else {
      router.replace("/login");
    }
  }, [router, searchParams, refreshUser]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 border-2 border-[#CCD7C5] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#A9B1AA]">Completing Google authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#CCD7C5] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#A9B1AA]">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}

