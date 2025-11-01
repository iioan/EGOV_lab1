import type { Metadata } from "next";
import "./globals.css";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "EGOV Lab Application",
  description: "A simple Next.js application with TypeScript",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="min-h-screen bg-gradient-to-b from-slate-100 to-white text-slate-900 antialiased">
    <Theme appearance="light" accentColor="indigo" scaling="95%">
      {children}
    </Theme>
    </body>
    </html>
  );
}