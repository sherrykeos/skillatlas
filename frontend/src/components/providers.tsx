"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query/query-client";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0F1219",
              border: "1px solid #1E2433",
              color: "#F8FAFC",
              fontFamily: "var(--font-sans)",
            },
            className: "border border-[#1E2433] bg-[#0F1219] text-[#F8FAFC] shadow-2xl",
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
