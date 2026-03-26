import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orgo Sync for Platforms — Replace Your ICS Link",
};

export default function PlatformsPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero">
        <div className="mkt-hero-eyebrow">For Scheduling Platforms</div>
        <h1 className="mkt-hero-headline" style={{ maxWidth: 860 }}>
          Three lines of code.<br />
          <span>Three value chains unlocked.</span>
        </h1>
        <p className="mkt-hero-sub">
          Replace your ICS calendar link with a{" "}
          <strong>secure, real-time, white-labeled API.</strong> Your brand. Your
          data. Your customers. Finally working for you.
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
          Replace your ICS link with the Orgo Sync white-labeled API. That is
          it. Everything below flows from that one decision.
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
          A single afternoon of your developer&apos;s time unlocks three things
          your platform has never had simultaneously.
        </p>
        <div className="mkt-value-grid">
          <div className="mkt-value-card">
            <div className="mkt-value-num">01</div>
            <div className="mkt-value-title">
              Better family experience. Immediately.
            </div>
            <div className="mkt-value-body">
              Real-time schedule updates reach families directly in their
              personal calendar. No app required. No manual refresh. Your
              platform gets the credit.
            </div>
            <ul className="mkt-value-items">
              <li>Field changes propagate in seconds. Not hours.</li>
              <li>No more missed games from stale calendar invites.</li>
              <li>Support tickets drop. NPS goes up.</li>
              <li>Your brand on every calendar update they receive.</li>
            </ul>
          </div>
          <div className="mkt-value-card">
            <div className="mkt-value-num">02</div>
            <div className="mkt-value-title">
              New revenue stream. Zero build.
            </div>
            <div className="mkt-value-body">
              Builders and AI apps apply to access your scheduling data. You
              approve who gets in. You earn every time they use it.
            </div>
            <ul className="mkt-value-items">
              <li>You set the permissions. You control the access.</li>
              <li>20% of every builder usage fee flows back to you.</li>
              <li>Passive. Recurring. From data you already own.</li>
              <li>No build. No maintenance. No effort.</li>
            </ul>
          </div>
          <div className="mkt-value-card">
            <div className="mkt-value-num">03</div>
            <div className="mkt-value-title">
              Your operators stop churning.
            </div>
            <div className="mkt-value-body">
              Organizations running your platform alongside other systems can now
              connect everything. Operational friction eliminated.
            </div>
            <ul className="mkt-value-items">
              <li>Their systems talk to each other automatically.</li>
              <li>No manual reconciliation. No data conflicts.</li>
              <li>They stay on your platform because it works.</li>
              <li>Retention revenue you were quietly losing.</li>
            </ul>
          </div>
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
          ICS was built in 1993 for machines to exchange calendar data. It was
          never designed for security, real-time updates or monetization. Every
          platform still runs on it.
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
                Public URL. Anyone can scrape it. Field locations, game times and
                roster details exposed to anyone who knows where to look.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Static data. Refreshes every 4 to 12 hours. Families are working
                from schedules that are already out of date.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Zero access control. You have no idea who has your calendar link
                or what they are doing with it.
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
                Zero monetization. Your scheduling data earns nothing despite
                being accessed constantly.
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
                Authenticated. Only approved parties access it. Zero public
                exposure. Complete control over your data.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Real time. Changes propagate in seconds via webhook. Families
                always have the current schedule.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Full permissioning. You approve every builder and partner before
                they access a single data point.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Complete audit trail. Every API call logged. You see exactly who
                accessed what and when.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                20% kickback from every builder who uses your data. Passive
                recurring revenue from day one.
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
          Sync API. Everything else is automatic from that moment forward.
        </p>
        <div className="mkt-how-grid">
          <div className="mkt-how-card">
            <div className="mkt-how-num">01</div>
            <div className="mkt-how-title">We scan your schema</div>
            <div className="mkt-how-body">
              Our AI maps your existing data structure to the Orgo Sync standard
              in minutes.{" "}
              <strong>You review and approve. One time. Never again.</strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">02</div>
            <div className="mkt-how-title">
              Your developer adds three lines
            </div>
            <div className="mkt-how-body">
              Replace your ICS endpoint with your white-labeled Orgo Sync API.{" "}
              <strong>
                Your brand. Your URL. Orgo Sync invisible underneath.
              </strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">03</div>
            <div className="mkt-how-title">
              Everything flows automatically
            </div>
            <div className="mkt-how-body">
              Real-time family updates. Builder access requests routed to you for
              approval.{" "}
              <strong>
                Revenue share deposited monthly. Zero ongoing work.
              </strong>
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
          You are not paying for Orgo Sync. Orgo Sync pays you — through two
          passive revenue streams that activate the moment you connect.
        </p>
        <div className="mkt-revenue-grid-v2">
          <div className="mkt-revenue-card-v2">
            <div className="mkt-revenue-tag">Revenue Stream 01</div>
            <div className="mkt-revenue-title">
              Builder access fees — you approve, you earn
            </div>
            <div className="mkt-revenue-body">
              AI apps, scheduling tools and builders apply to access your data
              via the Orgo Sync developer portal. You approve or deny each
              request. For every approved builder that uses your data you earn
              20% of their usage fee automatically. No invoicing. No billing.
              Deposited monthly.
            </div>
            <div className="mkt-revenue-pill">
              Passive. Recurring. From data you already own.
            </div>
            {/* Mini bar chart — passive income visualization */}
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
          <div className="mkt-revenue-card-v2">
            <div className="mkt-revenue-tag">Revenue Stream 02</div>
            <div className="mkt-revenue-title">
              Operator retention — stop losing customers to friction
            </div>
            <div className="mkt-revenue-body">
              Organizations running your platform alongside other systems can now
              connect everything via Orgo Sync. Your platform stays essential to
              their stack. Churn from integration friction drops. Operators who
              were quietly switching away have a reason to stay.
            </div>
            <div className="mkt-revenue-pill">
              Retention is revenue you were already losing.
            </div>
            {/* Connected graph — interoperability visualization */}
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
          </div>
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
          Your scheduling data is the most valuable asset your platform owns.
          Right now it sits locked inside your system — unmonetized, unprotected
          and underutilized. Orgo Sync changes all three.
        </p>
        <div className="mkt-unlock-grid">
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Monetized</span>
            </div>
            <div className="mkt-unlock-body">
              Every builder that accesses your data through Orgo Sync generates
              passive revenue for you. Data you already own starts earning the
              moment you connect. No build. No effort. No ongoing work.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Protected</span>
            </div>
            <div className="mkt-unlock-body">
              Every access permissioned. Every call audited. Every request
              approved by you before a single data point moves. Your data stays
              yours. ICS gave you zero control. Orgo Sync gives you complete
              control.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Interoperable</span>
            </div>
            <div className="mkt-unlock-body">
              Your data becomes part of a growing ecosystem of connected
              platforms, operators and builders. The more systems that connect to
              Orgo Sync the more valuable your data becomes — automatically and
              without any additional work on your end.
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
          Free to connect. Three lines of code. Your data stays yours. Revenue
          starts flowing from day one.
        </p>
        <Link href="/getstarted" className="mkt-btn-white">
          Connect Your Platform →
        </Link>
      </section>
    </>
  );
}
