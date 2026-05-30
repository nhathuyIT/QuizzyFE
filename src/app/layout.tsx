import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono, Hanken_Grotesk, JetBrains_Mono, Outfit } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`text-on-background font-body-md min-h-screen flex flex-col overflow-x-hidden relative ${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} ${outfit.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
