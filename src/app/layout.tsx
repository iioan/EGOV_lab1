import type {Metadata} from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import {Theme} from "@radix-ui/themes";
import {StoreProvider} from "@/lib/redux/StoreProvider";

export const metadata: Metadata = {
  title: "Formular plată taxe universitate",
  description: "Aplicație pentru plata taxelor universitare. Tema 1 EGOV",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="min-h-screen bg-gradient-to-b from-slate-100 to-white text-slate-900 antialiased">
    <Theme appearance="light" accentColor="amber" scaling="95%">
      <StoreProvider>
        {children}
      </StoreProvider>
    </Theme>
    </body>
    </html>
  );
}