import type { Metadata } from "next";
import { MarketingNav } from "../../components/marketing/marketing-nav";
import { MarketingFooter } from "../../components/marketing/marketing-footer";
import { MarketingAnimations } from "../../components/marketing/marketing-animations";
import "./marketing.css";

export const metadata: Metadata = {
  title: "Orgo Sync — The Scheduling Data Standard",
  description:
    "One API that makes scheduling data intelligent, interoperable, and secure.",
  openGraph: {
    title: "Orgo Sync — The Scheduling Data Standard",
    description:
      "One API that makes scheduling data intelligent, interoperable, and secure.",
    images: [{ url: "/home-og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orgo Sync — The Scheduling Data Standard",
    description:
      "One API that makes scheduling data intelligent, interoperable, and secure.",
    images: ["/home-og.png"],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mkt">
      <MarketingAnimations />
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
