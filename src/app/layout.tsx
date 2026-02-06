import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "DockyAI | Centralised AI Hub",
  description: "Access the best AI models in one place. Powered by Groq, Gemini & Puter.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-white bg-background`}>
        {children}
      </body>
    </html>
  );
}
