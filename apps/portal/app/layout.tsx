import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Bebas_Neue, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const sans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orgo Sync — Scheduling Interoperability API",
  description:
    "Real-time scheduling data routing and webhook delivery for sports platforms and builders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${mono.variable} ${bebas.variable} ${dmSans.variable} font-sans min-h-screen antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
