"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/operator", label: "Operators" },
  { href: "/platform", label: "Platforms" },
  { href: "/builder", label: "Builders" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`mkt-nav${scrolled ? " mkt-nav--scrolled" : ""}`}>
        <Link href="/" className="mkt-nav-logo">
          <Image
            src="/orgosynclogo.svg"
            alt="Orgo Sync"
            width={152}
            height={38}
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="mkt-nav-links mkt-nav-desktop">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <Link href="/getstarted" className="mkt-nav-cta">Get Started →</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mkt-nav-burger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`mkt-burger-line ${open ? "open" : ""}`} />
          <span className={`mkt-burger-line ${open ? "open" : ""}`} />
          <span className={`mkt-burger-line ${open ? "open" : ""}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="mkt-mobile-menu" onClick={() => setOpen(false)}>
          <div className="mkt-mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="mkt-mobile-link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/getstarted"
              className="mkt-mobile-cta"
              onClick={() => setOpen(false)}
            >
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
