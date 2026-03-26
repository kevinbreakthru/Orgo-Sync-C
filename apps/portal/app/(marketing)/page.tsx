import Link from "next/link";
import { MarketingPillar } from "../../components/marketing/marketing-pillar";
import { HeroRoutingShowcase } from "../../components/marketing/hero-routing-showcase";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar mkt-hero--split" style={{ minHeight: "100vh" }}>
        <MarketingPillar opacity={0.55} />
        <div className="mkt-hero-content">
          <h1 className="mkt-hero-headline">
            The API<br />for <span>scheduling data.</span>
          </h1>
          <p className="mkt-hero-sub">
            Orgo Sync is the first universal API that makes every scheduling
            platform <strong>interoperable, secure and real-time.</strong>
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
        <Link href="/platform" className="mkt-who-card">
          <div className="mkt-who-tag">Scheduling Platforms</div>
          <div className="mkt-who-title">You own the scheduling data.</div>
          <div className="mkt-who-desc">
            Replace your ICS link with a{" "}
            <strong>secure white-labeled real-time API.</strong> Lock down your
            data. Earn passive revenue from builder access. Free to connect.
          </div>
          <div className="mkt-who-link">Learn more →</div>
        </Link>
        <Link href="/operator" className="mkt-who-card">
          <div className="mkt-who-tag">Operators</div>
          <div className="mkt-who-title">
            You run multiple scheduling systems.
          </div>
          <div className="mkt-who-desc">
            Connect every scheduling platform you run into{" "}
            <strong>one real-time automated workflow.</strong> Sign in. Select
            your systems. We handle everything else.
          </div>
          <div className="mkt-who-link">Learn more →</div>
        </Link>
        <Link href="/builder" className="mkt-who-card">
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
          Every scheduling platform — from youth sports to healthcare to
          hospitality — still uses ICS to push events to your calendar. A
          standard built for machines. Not families. Not builders. Not security.{" "}
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
              <span>
                A public URL anyone can scrape. Field locations, game times and
                roster details exposed with zero access control.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>
                Static data that refreshes every 4 to 12 hours. Families miss
                updates. Schedules are always slightly wrong.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>
                No permissioning. No audit trail. No way to know who has your
                data or what they are doing with it.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>
                Systems cannot talk to each other. Every platform is a silo.
                Every operator reconciles data manually.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✕</div>
              <span>
                Zero monetization. Platforms own valuable scheduling data and
                earn nothing from it.
              </span>
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
              <span>
                Authenticated access only. Every request permissioned by the
                platform that owns the data. Nothing is public.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>
                Real-time webhooks. Changes propagate in seconds across every
                connected system and every family&apos;s calendar.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>
                Full audit trail. Every API call logged. Complete visibility into
                who accessed what data and when.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>
                Universal standard. Any platform talks to any other. Operators
                get one source of truth automatically.
              </span>
            </div>
            <div className="mkt-card-item">
              <div className="mkt-dot">✓</div>
              <span>
                20% revenue share on every builder access. Data platforms already
                own starts earning passively.
              </span>
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
              Our AI scans your data schema and maps it to the Orgo Sync
              standard automatically. <strong>Three lines of code.</strong> One
              afternoon. Never again.
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">02</div>
            <div className="mkt-how-title">Data flows in real time</div>
            <div className="mkt-how-body">
              Every scheduling change propagates instantly via authenticated
              webhooks.{" "}
              <strong>
                Real time. Bidirectional. Permissioned. Always current.
              </strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">03</div>
            <div className="mkt-how-title">
              Everyone benefits automatically
            </div>
            <div className="mkt-how-body">
              Families get live updates. Operators get one source of truth.
              Builders get structured data.{" "}
              <strong>The ecosystem becomes interoperable.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mkt-cta-section mkt-cta--pillar">
        <MarketingPillar opacity={0.45} />
        <h2 className="mkt-cta-h1">
          The new<br />
          <span>Orgo Sync standard</span>
          <br />
          is being set.
        </h2>
        <p className="mkt-cta-h2">
          Developer portal is live.{" "}
          <strong>Platforms join free.</strong> Three lines of code and we handle
          the rest.
        </p>
        <div className="mkt-cta-pills">
          <div className="mkt-cta-pill">
            <span>Platforms</span> — Free to connect
          </div>
          <div className="mkt-cta-pill">
            <span>Operators</span> — Sign in and go
          </div>
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
