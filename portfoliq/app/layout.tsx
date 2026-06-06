import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProtfoliQ – AI-Powered Portfolio Intelligence",
  description:
    "Build Projects. Prove Skills. Impress Recruiters. ProtfoliQ audits your GitHub portfolio from a recruiter's perspective and gives you actionable improvements.",
  keywords: [
    "portfolio reviewer",
    "GitHub analysis",
    "AI portfolio",
    "recruiter",
    "developer portfolio",
    "code quality",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--pq-bg-deep)] text-[var(--pq-text-primary)]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
