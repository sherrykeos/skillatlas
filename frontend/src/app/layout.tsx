import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const viewport: Viewport = {
  themeColor: "#090A0F",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "SkillAtlas — The Premier Agentic Skills Marketplace",
    template: "%s | SkillAtlas",
  },
  description:
    "Discover, verify, and integrate production-grade skills and tools for autonomous AI agents. Built for builders.",
  keywords: ["AI skills", "agentic workflows", "AI agents", "SKILL.md", "developer tools", "marketplace"],
  authors: [{ name: "SkillAtlas Team" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "SkillAtlas — The Premier Agentic Skills Marketplace",
    description: "Discover, verify, and integrate production-grade skills and tools for autonomous AI agents.",
    type: "website",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <body className="min-h-screen bg-[#090A0F] text-[#F8FAFC] selection:bg-[#10B981] selection:text-[#090A0F] flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
