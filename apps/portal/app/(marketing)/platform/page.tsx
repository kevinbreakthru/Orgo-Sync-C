import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { HubSpokeBg } from "../../../components/marketing/hub-spoke-bg";

export const metadata: Metadata = {
  title: "Orgo Sync for Platforms — Replace Your ICS Link",
};

export default function PlatformsPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar">
        <HubSpokeBg centerX={0.75} centerY={0.55} scale={0.38} overlay={false} />
        <div className="mkt-hero-eyebrow" style={{ color: "#39FF6A", background: "rgba(57,255,106,0.1)", borderColor: "rgba(57,255,106,0.22)", "--m-accent": "#39FF6A" } as React.CSSProperties}>For Scheduling Platforms</div>
        <h1 className="mkt-hero-headline" style={{ maxWidth: 860 }}>
          Three lines of code.<br />
          <span>Three value chains unlocked.</span>
        </h1>
        <p className="mkt-hero-sub">
          Replace your ICS link with a{" "}
          <strong>secure, real-time, white-labeled API.</strong> Your brand. Your
          data.
        </p>
        <div className="mkt-hero-actions">
          <Link href="/getstarted" className="mkt-btn-primary">
            Connect Your Platform →
          </Link>
          <a href="#how" className="mkt-btn-secondary">
            See How It Works ↓
          </a>
        </div>
      </section>

      {/* ASK STRIP */}
      <div className="mkt-band">
        <div className="mkt-band-label">The ask</div>
        <div className="mkt-band-divider" />
        <div className="mkt-band-text">
          Replace your ICS link with the Orgo Sync white-labeled API. Everything else follows.
        </div>
      </div>

      {/* THREE VALUE CHAINS */}
      <section className="mkt-section" id="value" style={{ background: "var(--m-gray-light)" }}>
        <div className="mkt-section-eyebrow">What you unlock</div>
        <h2 className="mkt-section-h1">
          One integration.<br />
          <span>Three value chains.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          One afternoon unlocks three things your platform has never had simultaneously.
        </p>
        <div className="mkt-value-grid">
          <div className="mkt-value-card">
            <div className="mkt-value-num">01</div>
            <div className="mkt-value-title">
              Better family experience. Immediately.
            </div>
            <div className="mkt-value-body">
              Real-time updates reach family calendars directly. No app. Your
              platform gets the credit.
            </div>
            <ul className="mkt-value-items">
              <li>Field changes in seconds, not hours.</li>
              <li>No more missed games from stale invites.</li>
              <li>Support tickets drop. NPS goes up.</li>
              <li>Your brand on every update.</li>
            </ul>
          </div>
          <div className="mkt-value-card">
            <div className="mkt-value-num">02</div>
            <div className="mkt-value-title">
              New revenue stream. Zero build.
            </div>
            <div className="mkt-value-body">
              Builders apply to access your data. You approve. You earn.
            </div>
            <ul className="mkt-value-items">
              <li>You control who gets in.</li>
              <li>20% of every usage fee, back to you.</li>
              <li>Passive. Recurring. From data you already own.</li>
              <li>No build. No maintenance. No effort.</li>
            </ul>
          </div>
          {/* <div className="mkt-value-card">
            <div className="mkt-value-num">03</div>
            <div className="mkt-value-title">
              Your operators stop churning.
            </div>
            <div className="mkt-value-body">
              Operators running your platform alongside others can connect
              everything. Friction gone.
            </div>
            <ul className="mkt-value-items">
              <li>Their systems talk to each other automatically.</li>
              <li>No manual reconciliation. No data conflicts.</li>
              <li>They stay on your platform because it works.</li>
              <li>Retention revenue you were quietly losing.</li>
            </ul>
          </div> */}
        </div>
      </section>

      {/* ICS COMPARISON */}
      <section className="mkt-section" id="comparison" style={{ background: "var(--m-black)" }}>
        <div className="mkt-section-eyebrow">The standard you&apos;re replacing</div>
        <h2 className="mkt-section-h1" style={{ color: "var(--m-white)" }}>
          Your ICS link today<br />
          <span>vs. your Orgo Sync API.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          ICS was built for machines, not security or monetization. Every platform still runs on it.
        </p>
        <div className="mkt-compare-asym">
          <div className="mkt-card bad mkt-compare-bad">
            <div className="mkt-card-label">Your ICS link today</div>
            <div className="mkt-card-title">
              Public. Stale. Unprotected. Unmonetized.
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Public URL. Anyone can scrape it.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Static. Refreshes every 4–12 hours.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Zero access control. No visibility.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                No audit trail. No permissioning. No security layer of any kind.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Zero monetization. Accessed constantly. Earns nothing.
              </span>
            </div>
          </div>
          <div className="mkt-card good mkt-compare-good">
            <div className="mkt-card-label">
              Your Orgo Sync white-labeled API
            </div>
            <div className="mkt-card-title">
              Secure. Real-time. Permissioned. Earning.
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Authenticated. Only approved parties. Complete control.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Real-time. Changes propagate in seconds.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Full permissioning. You approve every request.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Complete audit trail. Every call logged.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                20% from every builder who uses your data.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mkt-section" id="how" style={{ background: "var(--m-white)" }}>
        <div className="mkt-section-eyebrow">How it works</div>
        <h2 className="mkt-section-h1">
          Three lines of code.<br />
          <span>One afternoon. Never again.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          Your developer replaces the ICS endpoint with your white-labeled Orgo
          Sync API. Everything after that is automatic.
        </p>
        <div className="mkt-how-grid">
          <div className="mkt-how-card">
            <div className="mkt-how-num">01</div>
            <div className="mkt-how-title">We scan your schema</div>
            <div className="mkt-how-body">
              AI maps your data to the Orgo Sync standard.{" "}
              <strong>You approve once. Never again.</strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">02</div>
            <div className="mkt-how-title">
              Your developer adds three lines
            </div>
            <div className="mkt-how-body">
              Replace the ICS endpoint with your white-labeled API.{" "}
              <strong>Your brand. Your URL. Orgo Sync invisible underneath.</strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">03</div>
            <div className="mkt-how-title">
              Everything flows automatically
            </div>
            <div className="mkt-how-body">
              Real-time updates. Builder requests routed to you.{" "}
              <strong>Revenue deposited monthly. Zero ongoing work.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* REVENUE STREAMS */}
      <section className="mkt-section" style={{ background: "var(--m-gray-light)" }}>
        <div className="mkt-section-eyebrow">Your two revenue streams</div>
        <h2 className="mkt-section-h1">
          Data you already own.<br />
          <span>Now earning for you.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          You are not paying for Orgo Sync. Orgo Sync pays you.
        </p>
        <div className="mkt-revenue-grid-v2">
          <div className="mkt-revenue-card-v2">
            <div className="mkt-revenue-tag">Revenue Stream 01</div>
            <div className="mkt-revenue-title">
              Builder access fees — you approve, you earn
            </div>
            <div className="mkt-revenue-body">
              Builders apply to access your data via the developer portal. You
              approve or deny. 20% of every usage fee deposited monthly.
              Automatic.
            </div>
            <div className="mkt-revenue-pill">
              Passive. Recurring. From data you already own.
            </div>
            <div className="mkt-revenue-mini-chart">
              {[28, 35, 32, 48, 44, 56, 52, 68, 64, 78, 72, 88].map((h, i) => (
                <div
                  key={i}
                  className="mkt-revenue-bar"
                  style={{
                    height: `${h}%`,
                    background: i >= 9
                      ? "var(--m-orange)"
                      : `rgba(255,77,0,${0.15 + i * 0.06})`,
                  }}
                />
              ))}
            </div>
          </div>
          {/* <div className="mkt-revenue-card-v2">
            <div className="mkt-revenue-tag">Revenue Stream 02</div>
            <div className="mkt-revenue-title">
              Operator retention — stop losing customers to friction
            </div>
            <div className="mkt-revenue-body">
              Operators running your platform alongside others can now connect
              everything via Orgo Sync. Friction drops. Churn drops.
            </div>
            <div className="mkt-revenue-pill">
              Retention is revenue you were already losing.
            </div>
            <div className="mkt-retention-graph">
              <div
                className="mkt-retention-node"
                style={{ background: "var(--m-gray-light)", color: "var(--m-dark)" }}
              >
                LA
              </div>
              <div className="mkt-retention-edge" />
              <div className="mkt-retention-hub">SYNC</div>
              <div className="mkt-retention-edge" />
              <div
                className="mkt-retention-node"
                style={{ background: "var(--m-gray-light)", color: "var(--m-dark)" }}
              >
                TS
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* UNLOCK / PRIVACY */}
      <section className="mkt-section" style={{ background: "var(--m-black)" }}>
        <div className="mkt-section-eyebrow">The bigger picture</div>
        <h2
          className="mkt-section-h1"
          style={{ color: "var(--m-white)" }}
        >
          Ready to unlock<br />
          <span>the true power of your data?</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          Your scheduling data is your most valuable asset. Right now it sits
          unmonetized, unprotected and underutilized.
        </p>
        <div className="mkt-unlock-grid">
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Monetized</span>
            </div>
            <div className="mkt-unlock-body">
              Every builder that accesses your data earns you passive revenue.
              No build. No effort.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Protected</span>
            </div>
            <div className="mkt-unlock-body">
              Every access permissioned. Every call audited. Your data stays
              yours. ICS gave you zero control. Orgo Sync gives you complete control.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Interoperable</span>
            </div>
            <div className="mkt-unlock-body">
              Your data joins a growing ecosystem. More platforms connecting
              means more value for yours — automatically.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mkt-cta-orange">
        <h2 className="mkt-cta-h1">
          Ready to unlock the<br />true power of your data?
        </h2>
        <p className="mkt-cta-h2">
          Free to connect. Three lines of code.
        </p>
        <Link href="/getstarted" className="mkt-btn-white">
          Connect Your Platform →
        </Link>
      </section>
    </>
  );
}
