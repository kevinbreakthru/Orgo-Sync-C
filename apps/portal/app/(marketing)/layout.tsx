import type { Metadata } from "next";
import { MarketingNav } from "../../components/marketing/marketing-nav";
import { MarketingFooter } from "../../components/marketing/marketing-footer";
import "./marketing.css";

export const metadata: Metadata = {
  title: "Orgo Sync — The Scheduling Data Standard",
  description:
    "The first universal API that makes every scheduling platform interoperable, secure and real-time.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mkt">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
