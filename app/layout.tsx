// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Chronicle - Digital Magazine",
  description:
    "Cutting-edge industry news, technology trends, lifestyle insights, and authoritative opinions.",
  // ✅ Add favicon metadata
  icons: {
    icon: [
      {
        url: "/chronicles-40px.png",
        sizes: "40x40",
        type: "image/png",
      },
      {
        url: "/chronicles-128px.ico",
        sizes: "128x128",
        type: "image/x-icon",
      },
    ],
    shortcut: "/chronicles-40px.png",
    apple: "/chronicles-128px.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${quicksand.variable}`}>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
