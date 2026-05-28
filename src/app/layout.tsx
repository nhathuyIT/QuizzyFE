import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quizzy — Learn Smarter",
  description:
    "AI-powered flashcards and quizzes that adapt to you. Study less, remember more, and ace every exam.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://quizzy.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className={`${inter.variable} ${syne.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
