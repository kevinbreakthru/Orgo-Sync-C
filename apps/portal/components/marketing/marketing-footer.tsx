import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="mkt-footer">
      <div>
        <div className="mkt-footer-logo">
          <Image
            src="/orgosynclogo.svg"
            alt="Orgo Sync"
            width={110}
            height={28}
          />
        </div>
        <div className="mkt-footer-tagline">The scheduling data standard.</div>
      </div>
      <div className="mkt-footer-links">
        <Link href="/operator">Operators</Link>
        <Link href="/platform">Platforms</Link>
        <Link href="/builder">Builders</Link>
        <a href="mailto:zoya@orgohq.com">Contact</a>
      </div>
      <div className="mkt-footer-tm">
        © {new Date().getFullYear()} Orgo Inc. All rights reserved.
      </div>
    </footer>
  );
}
