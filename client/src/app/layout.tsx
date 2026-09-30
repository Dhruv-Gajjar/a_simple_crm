import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  DM_Sans,
  Roboto,
} from "next/font/google";
import "./globals.css";
import AuthContextProvider from "@/contexts/AuthContext";

const robotoHeading = Roboto({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-main",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Freelancer CRM",
  description: "A simple CRM or freelancers and small business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        notoSansHeading.variable,
        "font-sans",
        dmSans.variable,
        robotoHeading.variable,
      )}
    >
      <body
        className="min-h-full flex flex-col font-main"
        suppressHydrationWarning
      >
        <Providers>
          <TooltipProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
            <Toaster />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
