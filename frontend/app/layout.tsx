import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "evo - Your AI Companion",
  description: "Advanced AI companion for learning and mentoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen relative overflow-x-hidden`}
      >
        {/* Space background effect is handled in globals.css */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
