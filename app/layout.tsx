import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔥 THE MISSION: Upgraded to our premium SaaS identity
export const metadata: Metadata = {
  title: "CoachingWala OS | The Future of Coaching",
  description: "The premium operating system to manage admissions, fees, tests, and students for modern coaching institutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning prevents extension injection errors (like Grammarly)
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-slate-900 selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}