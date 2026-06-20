import type { Metadata } from "next";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizzy AI - Learn Smarter",
  description: "Turn your notes into focused flashcards, quizzes, and review sessions with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="text-on-background font-body-md min-h-screen flex flex-col overflow-x-hidden relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
