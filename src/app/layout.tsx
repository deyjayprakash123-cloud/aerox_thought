import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neural Thought Space — Visualize Your Mind",
  description:
    "Transform your thoughts into a living visual network. Neural Thought Space uses AI-powered graph visualization to turn messy thinking into structured clarity.",
  keywords: ["mind map", "thought visualization", "neural network", "AI", "graph"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
