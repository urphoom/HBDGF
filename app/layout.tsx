import type { Metadata, Viewport } from "next";
import { Charm, Great_Vibes, Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sarabun",
});

const charm = Charm({
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
  variable: "--font-charm",
});

const vibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vibes",
});

export const metadata: Metadata = {
  title: "Happy Birthday",
  description: "สุขสันต์วันเกิดนะ",
};

export const viewport: Viewport = {
  themeColor: "#ffd6e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${sarabun.variable} ${charm.variable} ${vibes.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
