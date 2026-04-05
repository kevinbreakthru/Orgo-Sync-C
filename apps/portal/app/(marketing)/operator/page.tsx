import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { HubSpokeBg } from "../../../components/marketing/hub-spoke-bg";

export const metadata: Metadata = {
  title: "Orgo Sync for Operators — One View. Every System. Total Intelligence.",
  description: "Unified scheduling intelligence across every platform you run. No migration, no new software. Connect once.",
  openGraph: {
    title: "Orgo Sync for Operators — One View. Every System. Total Intelligence.",
    description: "Unified scheduling intelligence across every platform you run. No migration, no new software. Connect once.",
    images: [{ url: "/operators-og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orgo Sync for Operators — One View. Every System. Total Intelligence.",
    description: "Unified scheduling intelligence across every platform you run.",
    images: ["/operators-og.png"],
  },
};

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains),'JetBrains Mono',monospace",
};
const BG = "#07080c";
const BG2 = "#0c0e18";
const W90 = "rgba(255,255,255,0.90)";
const W75 = "rgba(255,255,255,0.75)";
const W40 = "rgba(255,255,255,0.40)";
const BLUE = "#4d9fff";
const BLUE_T = "#70b8ff";
const BLUE_G = "rgba(77,159,255,0.35)";
const ORANGE = "#FF3E00";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_L = "rgba(255,255,255,0.05)";

const wrap: React.CSSProperties = {
  padding: "90px max(60px, calc((100% - 1200px) / 2))",
};
const inner: React.CSSProperties = { maxWidth: 1200, margin: "0 auto" };
const eyebrow: React.CSSProperties = {
  ...MONO,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: BLUE_T,
  marginBottom: 20,
};
const h2: React.CSSProperties = {
  fontFamily: "var(--font-bebas),'Bebas Neue',sans-serif",
  fontSize: "clamp(32px,4vw,52px)",
  fontWeight: 700,
  lineHeight: 1.05,
  color: "#fff",
  marginBottom: 20,
};
const body: React.CSSProperties = { fontSize: 17, color: W90, lineHeight: 1.8 };

export default function OperatorsPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar">
        <HubSpokeBg
          centerX={0.75}
          centerY={0.55}
          scale={0.38}
          overlay={false}
          color={{ r: 77, g: 159, b: 255 }}
        />
        <div
          className="mkt-hero-eyebrow"
          style={
            {
              color: BLUE_T,
              background: "rgba(77,159,255,0.1)",
              borderColor: "rgba(77,159,255,0.22)",
            } as React.CSSProperties
          }
        >
          For Operators and Organizations
        </div>
        <h1 className="mkt-hero-headline">
          Unified scheduling
          <br />
          <span style={{ color: BLUE, textShadow: `0 0 50px ${BLUE_G}` }}>
            intelligence.
          </span>
        </h1>
        <p className="mkt-hero-sub">
          You have invested in platforms that serve critical business functions.
          The problem is they do not talk to each other.{" "}
          <strong>
            Orgo Sync is the cross-platform layer that unifies scheduling across
            the tools you already use and empowers your entire organization with
            its intelligence.
          </strong>
        </p>
        <div
          className="mkt-g3 mkt-hero-strip"
          style={{ gap: 2, maxWidth: 600, marginTop: 8 }}
        >
          {[
            { n: "01. Protect", t: "Keep every tool you have" },
            { n: "02. Optimize", t: "Make them work as one" },
            { n: "03. Empower", t: "Tap into your intelligence" },
          ].map((p) => (
            <div
              key={p.n}
              style={{
                background: BG2,
                border: `1px solid ${BORDER}`,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  ...MONO,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: BLUE_T,
                  marginBottom: 6,
                }}
              >
                {p.n}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                {p.t}
              </div>
            </div>
          ))}
        </div>
        <div className="mkt-hero-actions" style={{ marginTop: 28 }}>
          <Link href="/getstarted" className="mkt-btn-primary">
            I want to unify my systems →
          </Link>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section
        className="mkt-wrap"
        style={{
          background: BG2,
          borderTop: `1px solid ${BORDER_L}`,
          borderBottom: `1px solid ${BORDER_L}`,
        }}
      >
        <div style={inner}>
          <div style={eyebrow}>Who It&apos;s For</div>
          <h2 style={h2}>
            Built for organizations that
            <br />
            <span style={{ color: BLUE }}>outgrew a single platform.</span>
          </h2>
          <p style={{ ...body, maxWidth: 640, marginBottom: 48 }}>
            If your organization manages scheduling complexity across more than
            one system, Orgo Sync was built for you.
          </p>
          <div className="mkt-g3" style={{ gap: 20 }}>
            {[
              {
                badge: "Multi-sport facilities",
                t: "Sports complexes and academies",
                d: "Multiple sports, multiple venues, multiple platforms. A single scheduling conflict across systems costs real money and real trust.",
              },
              {
                badge: "Higher education",
                t: "University athletic departments",
                d: "Athletic scheduling, academic calendars, facility management, and student life running on separate systems with zero interoperability between departments.",
              },
              {
                badge: "Youth sports",
                t: "Large club and league organizations",
                d: "Multiple scheduling platforms across leagues, tournaments, and communications — manually reconciled every week by staff who should be doing something more valuable.",
              },
              {
                badge: "Recreation",
                t: "Municipal parks and recreation",
                d: "City-managed facilities serving multiple sports, leagues, and programs across multiple scheduling systems, with staff hours going into data entry instead of community programs.",
              },
              {
                badge: "Fitness and wellness",
                t: "Multi-location fitness organizations",
                d: "Class schedules, facility bookings, trainer availability, and event calendars in separate systems with no unified operational view across locations.",
              },
              {
                badge: "Corporate",
                t: "Corporate campus operations",
                d: "Meeting rooms, athletic facilities, event spaces, and shared resources across multiple booking systems. Constant conflicts, constant manual reconciliation, no single source of truth.",
              },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  borderRadius: 12,
                  padding: 28,
                  background: BG,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: BLUE_T,
                    background: "rgba(77,159,255,0.08)",
                    border: "1px solid rgba(77,159,255,0.2)",
                    padding: "4px 10px",
                    borderRadius: 4,
                    display: "inline-block",
                    marginBottom: 14,
                  }}
                >
                  {c.badge}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 8,
                  }}
                >
                  {c.t}
                </div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>
                  {c.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE REALITY */}
      <section
        className="mkt-wrap"
        style={{
          background: BG2,
          borderTop: `1px solid ${BORDER_L}`,
          borderBottom: `1px solid ${BORDER_L}`,
        }}
      >
        <div style={inner}>
          <div style={eyebrow}>The Reality You Are Living</div>
          <h2 style={h2}>
            You built a great tech stack.
            <br />
            <span style={{ color: BLUE }}>
              Fragmentation is making it work against you.
            </span>
          </h2>
          <div className="mkt-split" style={{ gap: 56, alignItems: "start" }}>
            <div>
              <p style={{ ...body, marginBottom: 18 }}>
                You did not choose fragmentation. It happened as your
                organization grew. One platform for scheduling. Another for
                facilities. Another for events. Each one was the right choice at
                the time. Each one delivers real value in isolation.
              </p>
              <p style={{ ...body, marginBottom: 18 }}>
                But none of them know what the others know. When something
                changes in one system, the others do not know about it until a
                human being manually reconciles the difference. That gap between
                systems is where your staff hours go. It is where conflicts are
                born. It is where good decisions get made on incomplete
                information.
              </p>
              <p style={body}>
                The problem is not your tools.{" "}
                <span style={{ color: ORANGE, fontWeight: 600 }}>
                  The problem is that they were never designed to talk to each
                  other.
                </span>{" "}
                Orgo Sync is the layer that makes them.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "20 or more staff hours per week spent manually reconciling data across systems that should reconcile themselves.",
                "Conflicts between systems discovered by coaches, clients, or athletes on the day of the event — not by the people who could have prevented them.",
                "Key decisions made on incomplete, stale data because the full picture requires logging into four separate systems and building a spreadsheet.",
                "A master calendar, a shared spreadsheet, or a weekly staff meeting used to manually patch over the gaps between systems that should not exist.",
                "Every new platform added to your stack multiplies the reconciliation problem rather than solving it.",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "18px 20px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255,77,77,0.12)",
                      border: "1px solid rgba(255,77,77,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#ff6b6b",
                    }}
                  >
                    ✕
                  </div>
                  <div style={{ fontSize: 16, color: W90, lineHeight: 1.65 }}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE CORE PROMISE */}
      <section className="mkt-wrap" style={{ background: BG }}>
        <div style={inner}>
          <div style={eyebrow}>The Core Promise</div>
          <h2 style={h2}>
            Not a replacement.
            <br />
            <span style={{ color: BLUE }}>A multiplier.</span>
          </h2>
          <p style={{ ...body, maxWidth: 680, marginBottom: 48 }}>
            The all-in-one solutions want you to abandon what works and start
            over on their platform. Orgo Sync does the opposite.{" "}
            <strong style={{ color: "#fff" }}>
              We make the tools you already trust worth more.
            </strong>
          </p>
          <div className="mkt-g3" style={{ gap: 20 }}>
            {[
              {
                t: "Your investment stays protected",
                d: "The platforms your team knows, the workflows they trust, the data already in each system — all of it stays exactly as it is. Orgo Sync adds a layer. It does not replace one.",
              },
              {
                t: "Every system becomes more valuable",
                d: "When your systems share a common data layer, each one gets smarter. Every platform knows what the others know. The whole becomes greater than the sum of its parts.",
              },
              {
                t: "Add systems without adding complexity",
                d: "Every new platform you add connects to Orgo Sync once and joins the unified view automatically. Your stack can grow without the reconciliation cost growing with it.",
              },
              {
                t: "One view across everything",
                d: "Daily, weekly, and monthly views across every system your organization runs. Desktop and fully responsive on mobile. The single source of truth your organization has never had.",
              },
              {
                t: "Conflicts caught before they happen",
                d: "When a change in one system creates a conflict in another, Orgo Sync flags it immediately — not when a coach calls, not when a family shows up to the wrong field.",
              },
              {
                t: "Role-based access for your whole team",
                d: "Admins see everything. Coaches see their teams. Facility managers see their venues. Everyone gets the view they need without seeing what they do not.",
              },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  borderRadius: 12,
                  padding: 28,
                  background: "rgba(77,159,255,0.06)",
                  border: "1px solid rgba(77,159,255,0.22)",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 10,
                  }}
                >
                  {c.t}
                </div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>
                  {c.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="mkt-wrap"
        style={{
          background: BG2,
          borderTop: `1px solid ${BORDER_L}`,
          borderBottom: `1px solid ${BORDER_L}`,
        }}
        id="how"
      >
        <div style={inner}>
          <div style={eyebrow}>How It Works</div>
          <h2 style={h2}>
            One single, intelligent
            <br />
            <span style={{ color: BLUE }}>source of scheduling truth.</span>
          </h2>
          <p style={{ ...body, maxWidth: 680, marginBottom: 48 }}>
            No new software for your platforms to install. No migration. No IT
            project.{" "}
            <strong style={{ color: "#fff" }}>
              Zero technical development required.
            </strong>{" "}
            Your team never has to change how they work inside any platform.
          </p>
          <div className="mkt-g4" style={{ gap: 20 }}>
            {[
              {
                n: "01",
                t: "Sign in and select your systems",
                d: "Tell us which platforms you run. That's your entire technical responsibility.",
              },
              {
                n: "02",
                t: "We scan, map and connect",
                d: "AI scans and maps each system automatically. We implement the connections. Zero lift on your end.",
              },
              {
                n: "03",
                t: "Conflicts detected automatically",
                d: "When a change in one system creates a conflict in another, you are alerted immediately — before anyone else finds out.",
              },
              {
                n: "04",
                t: "Your operation runs itself",
                d: "Real-time sync. Full audit trail. The reconciliation disappears. Your team gets their time back.",
              },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 12,
                    color: ORANGE,
                    letterSpacing: "0.1em",
                    marginBottom: 14,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: "#fff",
                  }}
                >
                  {s.t}
                </div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>
                  {s.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        className="mkt-wrap"
        style={{
          background: "rgba(77,159,255,0.02)",
          borderTop: "1px solid rgba(77,159,255,0.1)",
          borderBottom: "1px solid rgba(77,159,255,0.1)",
        }}
        id="pricing"
      >
        <div style={inner}>
          <div style={eyebrow}>Pricing</div>
          <h2 style={h2}>
            Reclaim 20+ hours of staff productivity
            <br />
            <span style={{ color: BLUE }}>per week.</span>
          </h2>
          <p style={{ ...body, maxWidth: 640, marginBottom: 48 }}>
            Orgo Sync costs a fraction of the manual labor it replaces.
          </p>
          <div className="mkt-g4" style={{ gap: 16 }}>
            {[
              {
                tier: "Starter",
                price: "$499",
                unit: "/mo",
                volume: "Up to 3 platforms",
                features: [
                  "Unified calendar view",
                  "Real-time conflict detection",
                  "Daily, weekly, monthly views",
                  "Mobile responsive",
                  "Up to 5 user seats",
                ],
                featured: true,
              },
              {
                tier: "Growth",
                price: "$899",
                unit: "/mo",
                volume: "Up to 6 platforms",
                features: [
                  "Everything in Starter",
                  "Orgo Assist intelligence layer",
                  "Scenario planning and modeling",
                  "Role-based access controls",
                  "Up to 20 user seats",
                ],
                featured: false,
              },
              {
                tier: "Pro",
                price: "$1,499",
                unit: "/mo",
                volume: "Up to 12 platforms",
                features: [
                  "Everything in Growth",
                  "Unlimited user seats",
                  "Custom data exports and reporting",
                  "Priority support and onboarding",
                  "Advanced analytics",
                ],
                featured: false,
              },
              {
                tier: "Enterprise",
                price: "Custom",
                unit: "",
                volume: "Unlimited platforms",
                features: [
                  "Everything in Pro",
                  "Custom SLA and uptime guarantees",
                  "Dedicated implementation support",
                  "SSO and enterprise security",
                  "Multi-site and multi-org support",
                ],
                featured: false,
              },
            ].map((c) => (
              <div
                key={c.tier}
                style={{
                  borderRadius: 12,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: c.featured ? "rgba(77,159,255,0.06)" : BG2,
                  border: c.featured
                    ? "1.5px solid rgba(77,159,255,0.35)"
                    : `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: c.featured ? BLUE_T : W40,
                  }}
                >
                  {c.tier}
                </div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>
                  {c.price}
                  <span style={{ fontSize: 15, fontWeight: 400, color: W40 }}>
                    {c.unit}
                  </span>
                </div>
                <div style={{ fontSize: 15, color: W75 }}>{c.volume}</div>
                <div
                  style={{ height: 1, background: "rgba(255,255,255,0.07)" }}
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {c.features.map((f) => (
                    <div
                      key={f}
                      style={{
                        fontSize: 15,
                        color: W90,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: BLUE,
                          flexShrink: 0,
                          marginTop: 6,
                          display: "block",
                        }}
                      />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="mkt-wrap"
        style={{
          background: "rgba(77,159,255,0.03)",
          borderTop: "1px solid rgba(77,159,255,0.12)",
          textAlign: "center",
        }}
        id="getstarted"
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ ...h2, marginBottom: 18 }}>
            Level up your tech stack
            <br />
            with <span style={{ color: BLUE }}>intelligence.</span>
          </h2>
          <p
            style={{
              ...body,
              marginBottom: 40,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Book a 30-minute call. We will show you exactly what your
            organization looks like with one unified view across every system
            you run — and what Orgo Assist can do with it.
          </p>
          <Link
            href="/getstarted"
            className="mkt-btn-tint"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 36px",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              background: "rgba(77,159,255,0.12)",
              color: BLUE,
              border: "1.5px solid rgba(77,159,255,0.4)",
            }}
          >
            I want to unify my systems →
          </Link>
        </div>
      </section>
    </>
  );
}
