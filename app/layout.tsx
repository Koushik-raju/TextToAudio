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

export const metadata: Metadata = {
  title: "Meditation Audio Studio",
  description:
    "Create guided meditation audio with custom voices, pacing, and background music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,156,255,0.12)_0%,_transparent_55%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-studio-accent/5 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl"
            aria-hidden
          />
          <main className="relative">{children}</main>
        </div>
      </body>
    </html>
  );
}
