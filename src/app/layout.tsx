import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EGOV Lab Application",
  description: "A simple Next.js application with TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
