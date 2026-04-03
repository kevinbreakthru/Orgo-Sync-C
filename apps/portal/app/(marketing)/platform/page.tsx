import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { HubSpokeBg } from "../../../components/marketing/hub-spoke-bg";

export const metadata: Metadata = {
  title: "Orgo Sync for Platforms — Own Your Data. Earn From It.",
};

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains),'JetBrains Mono',monospace",
};
const BG = "#07080c";
const BG2 = "#0c0e18";
const W90 = "rgba(255,255,255,0.90)";
const W75 = "rgba(255,255,255,0.75)";
const W40 = "rgba(255,255,255,0.40)";
const GREEN = "#00ff7f";
const GREEN_T = "#00e070";
const GREEN_G = "rgba(0,255,127,0.35)";
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
  color: GREEN_T,
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

export default function PlatformsPage() {
  return (
    <>
      {/* HERO */}
      <section className="mkt-hero mkt-hero--pillar">
        <HubSpokeBg
          centerX={0.75}
          centerY={0.55}
          scale={0.38}
          overlay={false}
          color={{ r: 0, g: 255, b: 127 }}
        />
        <div
          className="mkt-hero-eyebrow"
          style={
            {
              color: GREEN_T,
              background: "rgba(0,255,127,0.1)",
              borderColor: "rgba(0,255,127,0.22)",
            } as React.CSSProperties
          }
        >
          For Scheduling Platforms
        </div>
        <h1 className="mkt-hero-headline">
          Three lines of code.
          <br />
          <span style={{ color: GREEN, textShadow: `0 0 40px ${GREEN_G}` }}>
            One API.
          </span>
        </h1>
        <p className="mkt-hero-sub">
          Connect your platform to Orgo Sync once and make your scheduling data
          interoperable, authenticated, and revenue-generating — without
          changing anything your customers already use.
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

      {/* THE OPPORTUNITY */}
      <section className="mkt-wrap" style={{ background: BG }}>
        <div style={inner}>
          <div style={eyebrow}>The Opportunity</div>
          <h2 style={h2}>
            Your scheduling data is your
            <br />
            <span style={{ color: GREEN }}>most valuable untapped asset.</span>
          </h2>
          <p style={{ ...body, maxWidth: 680, marginBottom: 48 }}>
            You have built something valuable — a platform your customers depend
            on every day. Orgo Sync gives you a new way to make that asset work
            harder: for your operators, for your builders, and for your bottom
            line.
          </p>
          <div className="mkt-g2" style={{ gap: 20 }}>
            {[
              {
                tag: "Earn",
                title: "Passive revenue from day one",
                body: "Every builder who accesses your data pays a usage fee. Revenue share flows to you automatically every month. No ongoing work. The data you already own starts earning.",
              },
              {
                tag: "Protect",
                title: "Full control over your data",
                body: "You approve every builder who accesses your data. You set the terms. You revoke at any time. Every request is authenticated, logged, and fully visible to you.",
              },
              {
                tag: "Retain",
                title: "Become the platform they can't leave",
                body: "When your platform connects, your operators get unified intelligence across every system they run — including yours. You didn't build a new feature. You became indispensable.",
              },
              {
                tag: "Grow",
                title: "Join the ecosystem that compounds",
                body: "Every builder that connects to your data makes your platform more valuable. Every operator that connects deepens the network. First movers own the builder relationships.",
              },
            ].map((c) => (
              <div
                key={c.tag}
                style={{
                  background: "rgba(0,255,127,0.05)",
                  border: "1px solid rgba(0,255,127,0.2)",
                  borderRadius: 12,
                  padding: 32,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: GREEN_T,
                    marginBottom: 12,
                  }}
                >
                  {c.tag}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 10,
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 16, color: W90, lineHeight: 1.7 }}>
                  {c.body}
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
            Three lines of code.
            <br />
            <span style={{ color: GREEN }}>Zero technical lift.</span>
          </h2>
          <p style={{ ...body, maxWidth: 640, marginBottom: 48 }}>
            Our AI scans, maps, and connects your system automatically.{" "}
            <strong style={{ color: "#fff" }}>
              Everything after that is automatic.
            </strong>
          </p>
          <div className="mkt-g3" style={{ gap: 20 }}>
            {[
              {
                n: "01",
                t: "We scan your schema",
                d: "Our AI maps your data structure to the Orgo Sync standard automatically. You approve once. We handle the normalization, the mapping, and the ongoing maintenance.",
              },
              {
                n: "02",
                t: "Your developer adds three lines",
                d: "Your developer adds three lines of code. Your brand. Your URL. Orgo Sync is invisible underneath. One afternoon of work.",
              },
              {
                n: "03",
                t: "Everything flows automatically",
                d: "Real-time updates propagate instantly. Builder access requests route to you for approval. Revenue share deposited monthly. Zero ongoing work from your team.",
              },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  padding: 36,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 12,
                    fontWeight: 500,
                    color: ORANGE,
                    letterSpacing: "0.1em",
                    marginBottom: 16,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 12,
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

      {/* REVENUE */}
      <section
        className="mkt-wrap"
        style={{
          background: "rgba(0,255,127,0.02)",
          borderTop: "1px solid rgba(0,255,127,0.1)",
          borderBottom: "1px solid rgba(0,255,127,0.1)",
        }}
      >
        <div style={inner}>
          <div style={eyebrow}>The Revenue Model</div>
          <h2 style={h2}>
            You are not paying for Orgo Sync.
            <br />
            <span style={{ color: GREEN }}>Orgo Sync pays you.</span>
          </h2>
          <div style={{ maxWidth: 720 }}>
            <p style={{ ...body, marginBottom: 18 }}>
              Every builder who accesses your data through Orgo Sync pays a
              subscription fee. You receive revenue share on that automatically,
              deposited monthly. No invoicing. No ongoing work. No contracts to
              manage.
            </p>
            <p style={{ ...body, marginBottom: 18 }}>
              The number starts small and compounds as the builder ecosystem
              around your data grows. The platforms that connect first build the
              deepest builder relationships — and earn from them the longest.
            </p>
            <p style={body}>
              <strong style={{ color: "#fff" }}>
                Revenue share is one part of the return. Retention and
                defensibility are the bigger ones.
              </strong>{" "}
              We will walk you through what the full picture looks like for your
              platform on your onboarding call.
            </p>
          </div>
        </div>
      </section>

      {/* WHITE LABEL */}
      <section
        className="mkt-wrap"
        style={{
          background: BG2,
          borderTop: `1px solid ${BORDER_L}`,
          borderBottom: `1px solid ${BORDER_L}`,
        }}
      >
        <div style={inner}>
          <div style={eyebrow}>White Labeling</div>
          <h2 style={h2}>
            Your brand. Your API.
            <br />
            <span style={{ color: GREEN }}>
              Orgo Sync invisible underneath.
            </span>
          </h2>
          <div className="mkt-split" style={{ gap: 56, alignItems: "start" }}>
            <div>
              <p style={{ ...body, marginBottom: 18 }}>
                Orgo Sync operates entirely behind the scenes. Builders who
                access your data do so through an API that carries your brand,
                your URL structure, and your identity. Orgo Sync is the
                infrastructure underneath — never the face of it.
              </p>
              <p style={{ ...body, marginBottom: 18 }}>
                This matters for two reasons. First, your brand stays front and
                center with every developer who builds on your data. Second, you
                retain full commercial and reputational ownership of the data
                relationship.
              </p>
              <p style={body}>
                <strong style={{ color: "#fff" }}>
                  You do not become an Orgo Sync customer in the eyes of your
                  builders. You become a platform with a professional,
                  authenticated data API that happens to be powered by Orgo Sync
                  infrastructure.
                </strong>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  t: "Your URL, your subdomain",
                  d: "The API endpoint builders connect to reflects your platform's domain. api.yourplatform.com, not orgosync.com.",
                },
                {
                  t: "Your brand in the marketplace",
                  d: "When builders browse Orgo Sync they see your platform name, logo, and description — not generic infrastructure branding.",
                },
                {
                  t: "Your approval workflow",
                  d: "Builder access requests come to you for approval. You review, approve, or deny. The decision is entirely yours.",
                },
                {
                  t: "Your dashboard",
                  d: "Full visibility into who is accessing your data, how often, and what they are querying. Your data. Your control.",
                },
              ].map((f) => (
                <div
                  key={f.t}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "18px 20px",
                    borderRadius: 12,
                    background: "rgba(0,255,127,0.04)",
                    border: "1px solid rgba(0,255,127,0.15)",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: GREEN,
                      boxShadow: `0 0 6px ${GREEN_G}`,
                      flexShrink: 0,
                      marginTop: 8,
                      display: "block",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: GREEN_T,
                        marginBottom: 4,
                      }}
                    >
                      {f.t}
                    </div>
                    <div style={{ fontSize: 16, color: W75, lineHeight: 1.65 }}>
                      {f.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DATA OWNERSHIP */}
      <section className="mkt-wrap" style={{ background: BG }}>
        <div style={inner}>
          <div style={eyebrow}>Data Ownership and Security</div>
          <h2 style={h2}>
            Your data stays yours.
            <br />
            <span style={{ color: GREEN }}>Always.</span>
          </h2>
          <p style={{ ...body, maxWidth: 620, marginBottom: 48 }}>
            We know the questions your legal and product team will ask. Here are
            the answers upfront.
          </p>
          <div className="mkt-g2" style={{ gap: 20 }}>
            {[
              {
                t: "You own the data. We just route it.",
                d: "Orgo Sync is the infrastructure layer — not the data owner. Your data is never sold, stored beyond real-time routing, or used for any purpose you haven't approved.",
                dim: false,
              },
              {
                t: "No public endpoints. Ever.",
                d: "Every request is authenticated. Builders apply, you approve, and every call requires valid credentials. Nothing is accessible without your explicit permission.",
                dim: false,
              },
              {
                t: "You approve every builder. Revoke instantly.",
                d: "Access is granted by you and revocable by you at any time with immediate effect. No process. No delay. Full control stays with your platform.",
                dim: false,
              },
              {
                t: "Complete audit trail on every call.",
                d: "Timestamp, builder identity, data requested, volume — every interaction logged and visible in your dashboard whenever you need it.",
                dim: false,
              },
              {
                t: "Encrypted end to end.",
                d: "All data moves via TLS. No plain text. Every connection authenticated and encrypted in transit.",
                dim: false,
              },
              {
                t: "GDPR and compliance ready",
                d: "Data processing agreements available for platforms that require them. Your legal team will have what they need before you connect.",
                dim: true,
              },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  borderRadius: 12,
                  padding: 28,
                  background: BG2,
                  border: `1px solid ${BORDER}`,
                  opacity: c.dim ? 0.45 : 1,
                  position: "relative",
                }}
              >
                {c.dim && (
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      ...MONO,
                      fontSize: 10,
                      color: W40,
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid rgba(255,255,255,0.1)`,
                      padding: "3px 8px",
                      borderRadius: 4,
                    }}
                  >
                    Coming soon
                  </div>
                )}
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

      {/* PRECEDENT */}
      <section className="mkt-wrap" style={{ background: BG }}>
        <div style={inner}>
          <div style={eyebrow}>This Is a Proven Playbook</div>
          <h2 style={h2}>
            This has happened before.
            <br />
            Every time it did,{" "}
            <span style={{ color: GREEN }}>an ecosystem was born.</span>
          </h2>
          <p style={{ ...body, maxWidth: 620, marginBottom: 48 }}>
            The infrastructure layer that unlocks a data category defines the
            standard for an entire industry. Platforms that move first own the
            ecosystem.
          </p>
          <div className="mkt-g4" style={{ gap: 2 }}>
            {[
              {
                co: "Stripe",
                unlocked: "Unlocked payments",
                result:
                  "Banks that connected became infrastructure. Banks that waited became legacy.",
                active: false,
              },
              {
                co: "Plaid",
                unlocked: "Unlocked banking data",
                result:
                  "Institutions that opened their data became the foundation. Those that stayed closed became irrelevant.",
                active: false,
              },
              {
                co: "Twilio",
                unlocked: "Unlocked communications",
                result:
                  "Carriers that participated became essential. The ones that didn't became dumb pipes.",
                active: false,
              },
              {
                co: "Orgo Sync",
                unlocked: "Unlocking scheduling data",
                result:
                  "The platforms that connect now will own the builder relationships and the ecosystem built on top of their data.",
                active: true,
              },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  background: p.active ? "rgba(0,255,127,0.05)" : BG2,
                  border: `1px solid ${p.active ? "rgba(0,255,127,0.25)" : BORDER}`,
                  borderRadius:
                    i === 0 ? "14px 0 0 14px" : i === 3 ? "0 14px 14px 0" : 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    ...MONO,
                    fontSize: 12,
                    fontWeight: 500,
                    color: p.active ? GREEN_T : W40,
                  }}
                >
                  {p.co}
                </div>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: p.active ? "#fff" : W75,
                  }}
                >
                  {p.unlocked}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: p.active ? W75 : W40,
                    lineHeight: 1.6,
                  }}
                >
                  {p.result}
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
          background: "rgba(0,255,127,0.03)",
          borderTop: "1px solid rgba(0,255,127,0.12)",
          textAlign: "center",
        }}
        id="getstarted"
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ ...h2, marginBottom: 18 }}>
            Ready to unlock the{" "}
            <span style={{ color: GREEN }}>true value of your data?</span>
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
            Free to connect. Book a 30-minute call and we will walk you through
            the integration, your revenue potential, and answer any questions
            your team has.
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
              background: "rgba(0,255,127,0.12)",
              color: GREEN,
              border: "1.5px solid rgba(0,255,127,0.4)",
            }}
          >
            Connect Your Platform →
          </Link>
        </div>
      </section>
    </>
  );
}
