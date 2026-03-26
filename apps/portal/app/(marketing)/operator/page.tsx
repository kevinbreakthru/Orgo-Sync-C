import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Orgo Sync for Operators — Make Your Systems Talk",
};

export default function OperatorsPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero">
        <div className="mkt-hero-eyebrow">For Operators</div>
        <h1 className="mkt-hero-headline">
          Your systems don&apos;t talk.<br />
          <span>Your team pays for it every day.</span>
        </h1>
        <p className="mkt-hero-sub">
          Orgo Sync connects every scheduling system you run into{" "}
          <strong>one real-time automated workflow.</strong> Sign in. Select your
          systems. We handle everything else. No switching. No rebuilding. No
          manual reconciliation. Ever again.
        </p>
        <div className="mkt-hero-actions">
          <Link href="/getstarted" className="mkt-btn-primary">
            Get Started →
          </Link>
          <a href="#how" className="mkt-btn-secondary">
            See How It Works ↓
          </a>
        </div>
      </section>

      {/* COST BAND */}
      <div className="mkt-band">
        <div className="mkt-band-label">The hidden cost</div>
        <div className="mkt-band-divider" />
        <div className="mkt-band-text">
          Manual data reconciliation between scheduling systems costs the average
          operator 10 to 20 hours per week in staff time. At $25/hr that is up
          to $26,000 per year in pure waste — for a problem that is entirely
          unnecessary.
        </div>
      </div>

      {/* ROI STRIP */}
      <div className="mkt-roi-strip">
        <div className="mkt-roi-item">
          <div className="mkt-roi-num">20hrs</div>
          <div className="mkt-roi-label">
            Staff hours saved<br />per week
          </div>
        </div>
        <div className="mkt-roi-item">
          <div className="mkt-roi-num">$26K</div>
          <div className="mkt-roi-label">
            Annual labor cost<br />recovered
          </div>
        </div>
        <div className="mkt-roi-item">
          <div className="mkt-roi-num">Zero</div>
          <div className="mkt-roi-label">
            Scheduling conflicts<br />undetected
          </div>
        </div>
        <div className="mkt-roi-item">
          <div className="mkt-roi-num">3min</div>
          <div className="mkt-roi-label">
            To connect<br />a new system
          </div>
        </div>
      </div>

      {/* BEFORE AFTER */}
      <section className="mkt-section" style={{ background: "var(--m-black)" }}>
        <div className="mkt-section-eyebrow">
          Your operation today vs. with Orgo Sync
        </div>
        <h2 className="mkt-section-h1" style={{ color: "var(--m-white)" }}>
          Every system is an island.<br />
          <span>Until now.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          When scheduling systems don&apos;t talk to each other someone on your
          team pays the price. Every single day. That is the problem Orgo Sync
          eliminates completely.
        </p>
        <div className="mkt-ba-grid">
          <div className="mkt-card bad" style={{ borderRadius: 4 }}>
            <div className="mkt-card-label">Without Orgo Sync</div>
            <div className="mkt-card-title">
              Manual. Delayed. Error-prone. Every week.
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                An event changes in one system. Every other system has to be
                manually updated. Every single time it happens.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Your master calendar is only as good as the last manual update.
                Which is never good enough.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Marketing and ops run on outdated information. Decisions made on
                data that is already wrong.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Venue double bookings. Roster mismatches. Conflicts that could
                have been caught automatically.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✕</div>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Wasted manpower. Lags. Misinformation. Every week. Indefinitely.
                Until you fix the infrastructure.
              </span>
            </div>
          </div>
          <div className="mkt-vs-col">VS</div>
          <div className="mkt-card good" style={{ borderRadius: 4 }}>
            <div className="mkt-card-label">With Orgo Sync</div>
            <div className="mkt-card-title">
              One change. Every system updates. Instantly.
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Update anything in any system. Every connected system reflects it
                automatically in seconds.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Your master calendar is always current. Everyone works from one
                live source of truth.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Marketing and ops make decisions on real-time data. Always
                accurate. Always current.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Conflicts detected automatically before they cause real world
                problems.
              </span>
            </div>
            <div className="mkt-ba-item">
              <div className="mkt-dot">✓</div>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                Your team stops reconciling data and starts running your
                operation.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS AN OPERATOR */}
      <section className="mkt-section" style={{ background: "var(--m-gray-light)" }}>
        <div className="mkt-section-eyebrow">Who this is built for</div>
        <h2 className="mkt-section-h1">
          Any organization running<br />
          <span>multiple scheduling systems.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          If your operation depends on more than one scheduling platform and
          those platforms don&apos;t talk to each other — Orgo Sync was built for
          you.
        </p>
        <div className="mkt-who-grid">
          <div className="mkt-who-grid-card">
            <div className="mkt-who-tag">Sports Academies</div>
            <div className="mkt-who-grid-title">
              Elite programs running academic, athletic and facility systems
              simultaneously.
            </div>
            <div className="mkt-who-grid-body">
              Academic schedules, practice schedules, venue bookings and
              attendance tracking across separate systems that have never
              communicated automatically.
            </div>
            <div className="mkt-who-systems">
              <div className="mkt-who-system">Student information systems</div>
              <div className="mkt-who-system">
                Facility management platforms
              </div>
              <div className="mkt-who-system">
                Registration and scheduling tools
              </div>
            </div>
          </div>
          <div className="mkt-who-grid-card">
            <div className="mkt-who-tag">School Districts and Education</div>
            <div className="mkt-who-grid-title">
              Districts managing academic calendars, facility bookings and
              extracurricular scheduling.
            </div>
            <div className="mkt-who-grid-body">
              When a class time changes it should automatically update the
              facility booking, the attendance system and every downstream
              calendar. It never does. Until now.
            </div>
            <div className="mkt-who-systems">
              <div className="mkt-who-system">
                Academic scheduling platforms
              </div>
              <div className="mkt-who-system">
                Facility and room booking systems
              </div>
              <div className="mkt-who-system">Attendance and tracking tools</div>
            </div>
          </div>
          <div className="mkt-who-grid-card">
            <div className="mkt-who-tag">Multi-System Organizations</div>
            <div className="mkt-who-grid-title">
              Any organization where scheduling data lives across more than one
              platform.
            </div>
            <div className="mkt-who-grid-body">
              Healthcare, hospitality, corporate facilities, event venues — if
              your systems don&apos;t talk to each other and someone is manually
              reconciling them every day, that is your sign.
            </div>
            <div className="mkt-who-systems">
              <div className="mkt-who-system">Event management platforms</div>
              <div className="mkt-who-system">
                Operations and logistics tools
              </div>
              <div className="mkt-who-system">
                Communication and coordination systems
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mkt-section" id="how" style={{ background: "var(--m-white)" }}>
        <div className="mkt-section-eyebrow">How it works</div>
        <h2 className="mkt-section-h1">
          Sign in. Select your systems.<br />
          <span>We handle everything else.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "var(--m-gray)" }}>
          Your entire technical responsibility is telling us which systems you
          run. Everything after that — scanning, mapping, connecting, syncing —
          is on us.
        </p>
        <div className="mkt-how-grid">
          <div className="mkt-how-card">
            <div className="mkt-how-num">01</div>
            <div className="mkt-how-title">
              Sign in and select your systems
            </div>
            <div className="mkt-how-body">
              Visit sync.orgohq.com. Tell us which platforms you run.{" "}
              <strong>
                That is your entire technical responsibility. Full stop.
              </strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">02</div>
            <div className="mkt-how-title">We scan, map and connect</div>
            <div className="mkt-how-body">
              Our AI scans each system&apos;s data schema automatically and maps
              it to the Orgo Sync standard. We implement the connections.{" "}
              <strong>Zero technical lift on your end. Zero.</strong>
            </div>
          </div>
          <div className="mkt-how-card">
            <div className="mkt-how-num">03</div>
            <div className="mkt-how-title">Your operation runs itself</div>
            <div className="mkt-how-body">
              Real-time bidirectional sync. Automatic conflict detection. Full
              audit trail.{" "}
              <strong>
                Your systems talk. Your team operates. The reconciliation
                disappears.
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="mkt-section mkt-pricing-section">
        <div className="mkt-section-eyebrow">Pricing</div>
        <h2 className="mkt-section-h1" style={{ color: "var(--m-white)" }}>
          Simple flat fee.<br />
          <span>No usage surprises. Ever.</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          Pay a predictable monthly fee based on how many systems you connect. No
          per-event charges. No consumption billing. No surprises at the end of
          the month.
        </p>
        <div className="mkt-pricing-grid">
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Starter</div>
            <div className="mkt-pricing-price">$499</div>
            <div className="mkt-pricing-unit">per month</div>
            <div className="mkt-pricing-volume">2 system connections</div>
            <div className="mkt-pricing-desc">
              Two platforms finally talking automatically in real time.
            </div>
            <div className="mkt-pricing-roi">
              Pays for itself in 2 staff hours saved
            </div>
          </div>
          <div className="mkt-pricing-card highlight">
            <div className="mkt-pricing-name">Growth</div>
            <div className="mkt-pricing-price">$899</div>
            <div className="mkt-pricing-unit">per month</div>
            <div className="mkt-pricing-volume">3 to 5 connections</div>
            <div className="mkt-pricing-desc">
              Academies, school programs and multi-system operators.
            </div>
            <div className="mkt-pricing-roi">
              Replaces 1 part-time admin role
            </div>
          </div>
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Pro</div>
            <div className="mkt-pricing-price">$1,499</div>
            <div className="mkt-pricing-unit">per month</div>
            <div className="mkt-pricing-volume">5 to 7 connections</div>
            <div className="mkt-pricing-desc">
              Complex multi-venue, multi-system operations at scale.
            </div>
            <div className="mkt-pricing-roi">
              Eliminates a full-time data role
            </div>
          </div>
          <div className="mkt-pricing-card">
            <div className="mkt-pricing-name">Enterprise</div>
            <div className="mkt-pricing-price">$2,499</div>
            <div className="mkt-pricing-unit">per month</div>
            <div className="mkt-pricing-volume">Unlimited connections</div>
            <div className="mkt-pricing-desc">
              Full stack. Intelligence layer included. White glove onboarding.
            </div>
            <div className="mkt-pricing-roi">
              Transforms your entire operation
            </div>
          </div>
        </div>
        <div className="mkt-pricing-note">
          Every tier includes real-time sync, conflict detection, full audit
          trail and dedicated onboarding support.
        </div>
      </section>

      {/* COMING SOON */}
      <div className="mkt-coming">
        <div className="mkt-coming-tag">Coming soon</div>
        <div>
          <div className="mkt-coming-title">
            Orgo Sync <span>Intelligence.</span>
          </div>
          <div className="mkt-coming-body">
            Ask your scheduling data anything.{" "}
            <strong>
              Which system creates the most conflicts? Where are we losing staff
              hours? What does next Tuesday look like across my entire operation?
            </strong>{" "}
            Your data has always known the answers. Now it can tell you.
          </div>
        </div>
      </div>

      {/* UNLOCK */}
      <section className="mkt-section" style={{ background: "var(--m-black)" }}>
        <div className="mkt-section-eyebrow">The bigger picture</div>
        <h2 className="mkt-section-h1" style={{ color: "var(--m-white)" }}>
          Ready to make your<br />
          <span>systems talk?</span>
        </h2>
        <p className="mkt-section-h2" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 56 }}>
          Manual reconciliation is not a people problem. It is an infrastructure
          problem. Orgo Sync is the infrastructure fix that makes it disappear
          permanently.
        </p>
        <div className="mkt-unlock-grid">
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Your team</span> gets their time back.
            </div>
            <div className="mkt-unlock-body">
              Every hour spent manually reconciling data between systems is an
              hour not spent on what actually matters — running your organization.
              Orgo Sync gives that time back permanently from the day you
              connect.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Your data</span> becomes reliable.
            </div>
            <div className="mkt-unlock-body">
              When every system reflects the same information in real time your
              entire organization operates from one source of truth. No more
              decisions made on stale data. No more conflicts that could have
              been caught automatically.
            </div>
          </div>
          <div className="mkt-unlock-card">
            <div className="mkt-unlock-title">
              <span>Your operation</span> scales without friction.
            </div>
            <div className="mkt-unlock-body">
              Adding a new system to your stack used to mean adding new manual
              reconciliation work. With Orgo Sync adding a new system means
              three minutes of setup and one more source of truth flowing into
              your unified workflow.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mkt-cta-orange">
        <h2 className="mkt-cta-h1">
          Ready to make your<br />systems talk?
        </h2>
        <p className="mkt-cta-h2">
          Sign in. Select your systems. We handle everything else. Your
          operation runs itself from day one.
        </p>
        <Link href="/getstarted" className="mkt-btn-white">
          Get Started →
        </Link>
      </section>
    </>
  );
}
