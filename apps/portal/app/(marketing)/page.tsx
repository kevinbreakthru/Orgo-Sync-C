import React from "react";
import Link from "next/link";
import { HeroRoutingShowcase } from "../../components/marketing/hero-routing-showcase";
import { NetworkNodesBg } from "../../components/marketing/network-nodes-bg";
import { PulseRingsBg } from "../../components/marketing/pulse-rings-bg";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar mkt-hero--split">
        <NetworkNodesBg />
        <div className="mkt-hero-content">
          <h1 className="mkt-hero-headline">
            The API<br />for <span>scheduling data.</span>
          </h1>
          <p className="mkt-hero-sub">
            A scheduling data API that makes every platform{" "}
            <strong>interoperable, secure and real-time.</strong>
          </p>
          <div className="mkt-hero-actions">
            <Link href="/getstarted" className="mkt-btn-primary">
              Apply for Access →
            </Link>
            <a href="#who" className="mkt-btn-secondary">
              See Who It&apos;s For ↓
            </a>
          </div>
        </div>
        <HeroRoutingShowcase />
      </section>

      {/* WHO IT'S FOR */}
      <div className="mkt-who-strip" id="who">
        <Link href="/platform" className="mkt-who-card" style={{ "--m-accent": "#39FF6A", "--m-accent-glow": "rgba(57,255,106,0.1)", "--m-accent-border": "rgba(57,255,106,0.22)" } as React.CSSProperties}>
          <div className="mkt-who-tag">Scheduling Platforms</div>
          <div className="mkt-who-title">You own the scheduling data.</div>
          <div className="mkt-who-desc">
            Replace your ICS link with a{" "}
            <strong>secure, real-time, white-labeled API.</strong> Lock down your
            data. Earn passive revenue. Free to connect.
          </div>
          <div className="mkt-who-link">Learn more →</div>
        </Link>
        {/* <Link href="/operator" className="mkt-who-card">
          <div className="mkt-who-tag">Operators</div>
          <div className="mkt-who-title">
            You run multiple scheduling systems.
          </div>
          <div className="mkt-who-desc">
            Connect every platform you run into{" "}
            <strong>one real-time automated workflow.</strong> Sign in. Select
            your systems. Done.
          </div>
          <div className="mkt-who-link">Learn more →</div>
        </Link> */}
        <Link href="/builder" className="mkt-who-card" style={{ "--m-accent": "#7C3AFF", "--m-accent-glow": "rgba(124,58,255,0.1)", "--m-accent-border": "rgba(124,58,255,0.22)" } as React.CSSProperties}>
          <div className="mkt-who-tag">Builders</div>
          <div className="mkt-who-title">
            You need scheduling data to build on.
          </div>
          <div className="mkt-who-desc">
            One authenticated API. Real-time access to{" "}
            <strong>standardized scheduling data</strong> from every connected
            platform. Apply once. Build anything.
          </div>
          <div className="mkt-who-link">Apply for access →</div>
        </Link>
      </div>

      {/* PROBLEM */}
      <section className="mkt-problem-section" id="problem">
        <div className="mkt-section-eyebrow">The problem</div>
        <h2
          className="mkt-section-h1"
          style={{ color: "var(--m-white)" }}
        >
          ICS was built in 1993.<br />
          <span>The industry never moved on.</span>
        </h2>
        <p
          className="mkt-section-h2"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Every scheduling platform still exports ICS — a standard built for
          machines, not people. Not secure. Not real-time.{" "}
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>
            Orgo Sync replaces it.
          </strong>
        </p>
        <div className="mkt-compare-asym">
          <div className="mkt-card bad mkt-compare-bad">
            <div className="mkt-card-label">
              ICS today — the open broadcast
            </div>
            <div className="mkt-card-title">
              Public. Stale. Unprotected. Unmonetized.
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>A public URL anyone can scrape. Zero access control.</span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>Stale. Refreshes every 4–12 hours. Families miss changes.</span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>No permissioning. No audit trail. No visibility.</span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              {/* <span>Every platform is a silo. Operators reconcile manually.</span> */}
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>Zero monetization. You own the data. It earns nothing.</span>
            </div>
          </div>
          <div className="mkt-card good mkt-compare-good">
            <div className="mkt-card-label">
              Orgo Sync — the authenticated standard
            </div>
            <div className="mkt-card-title">
              Secure. Real-time. Interoperable. Yours.
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>Authenticated only. Every request permissioned by the platform.</span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>Real-time webhooks. Changes propagate in seconds.</span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>Full audit trail. Every API call logged.</span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              {/* <span>Universal standard. Operators get one live source of truth.</span> */}
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>20% revenue share on every builder access. Passive income.</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mkt-how-section" id="how">
        <div className="mkt-section-eyebrow">How it works</div>
        <h2 className="mkt-section-h1">
          Three lines of code.<br />
          <span>Zero technical lift.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          Our AI scans, maps and connects your systems automatically.{" "}
          <strong>The hard part is invisible to you.</strong>
        </p>
        <div className="mkt-how-grid">
          <div className="mkt-how-card">
            <div className="mkt-how-num">01</div>
            <div className="mkt-how-title">Connect your system</div>
            <div className="mkt-how-body">
              AI scans and maps your schema automatically.{" "}
              <strong>Three lines of code. One afternoon.</strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">02</div>
            <div className="mkt-how-title">Data flows in real time</div>
            <div className="mkt-how-body">
              Changes propagate instantly via authenticated webhooks.{" "}
              <strong>Real-time. Bidirectional. Permissioned.</strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">03</div>
            <div className="mkt-how-title">
              Everyone benefits automatically
            </div>
            <div className="mkt-how-body">
              Families get live updates. Builders get
              structured data.{" "}
              <strong>The ecosystem becomes interoperable.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mkt-cta-section mkt-cta--pillar">
        <PulseRingsBg />
        <h2 className="mkt-cta-h1">
          The new<br />
          <span>Orgo Sync standard</span>
          <br />
          is being set.
        </h2>
        <p className="mkt-cta-h2">
          Developer portal is live.{" "}
          <strong>Platforms join free.</strong>
        </p>
        <div className="mkt-cta-pills">
          <div className="mkt-cta-pill">
            <span>Platforms</span> — Free to connect
          </div>
          {/* <div className="mkt-cta-pill">
            <span>Operators</span> — Sign in and go
          </div> */}
          <div className="mkt-cta-pill">
            <span>Builders</span> — Apply for access
          </div>
        </div>
        <Link href="/getstarted" className="mkt-btn-cta-primary">
          Apply for Access →
        </Link>
      </section>
    </>
  );
}
