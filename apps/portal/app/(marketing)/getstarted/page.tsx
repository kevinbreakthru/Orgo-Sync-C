"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "operator" | "platform" | "builder";

const BLUE = "#4d9fff";
const GREEN = "#00ff7f";
const PURPLE = "#b04dff";

const ROLES: {
  id: Role;
  title: string;
  desc: string;
  tags: string[];
  color: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "operator",
    title: "Operator",
    desc: "I run multiple scheduling systems that don't talk to each other.",
    tags: ["Sports academies", "School districts", "Multi-system orgs"],
    color: BLUE,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="6" cy="6" r="3" fill={BLUE} />
        <circle cx="12" cy="12" r="3" fill={BLUE} opacity="0.5" />
        <line
          x1="6"
          y1="6"
          x2="12"
          y2="12"
          stroke={BLUE}
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    id: "platform",
    title: "Platform",
    desc: "I run a scheduling platform that publishes data for organizations or leagues.",
    tags: [
      "Youth sports platforms",
      "League management software",
      "Registration platforms",
    ],
    color: GREEN,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill={GREEN} />
        <rect
          x="10"
          y="2"
          width="6"
          height="6"
          rx="1.5"
          fill={GREEN}
          opacity="0.5"
        />
        <rect
          x="2"
          y="10"
          width="6"
          height="6"
          rx="1.5"
          fill={GREEN}
          opacity="0.5"
        />
        <rect
          x="10"
          y="10"
          width="6"
          height="6"
          rx="1.5"
          fill={GREEN}
          opacity="0.3"
        />
      </svg>
    ),
  },
  {
    id: "builder",
    title: "Builder",
    desc: "I'm building a product that needs access to scheduling data.",
    tags: [
      "AI scheduling tools",
      "Fan engagement apps",
      "Participant platforms",
    ],
    color: PURPLE,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="2"
          y="8"
          width="14"
          height="8"
          rx="2"
          fill={PURPLE}
          opacity="0.4"
        />
        <rect x="5" y="2" width="8" height="8" rx="2" fill={PURPLE} />
        <rect
          x="7"
          y="5"
          width="4"
          height="2"
          rx="1"
          fill="#0D0D0D"
          opacity="0.5"
        />
      </svg>
    ),
  },
];

export default function GetStartedPage() {
  const [selected, setSelected] = useState<Role | null>(null);
  const router = useRouter();

  function proceed() {
    if (!selected) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("orgo_sync_role", selected);
    }
    router.push("/login");
  }

  return (
    <div className="mkt-getstarted">
      <div className="mkt-getstarted-inner">
        <div className="mkt-getstarted-header">
          <div className="mkt-section-eyebrow" style={{ textAlign: "center" }}>
            Get started
          </div>
          <h1 className="mkt-getstarted-title">
            How are you using
            <br />
            <span>Orgo Sync?</span>
          </h1>
          <p className="mkt-getstarted-sub">
            Select the option that best describes you.
          </p>
        </div>

        <div className="mkt-getstarted-roles">
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            const c = role.color;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className="mkt-role-card"
                style={
                  isSelected ? { background: `${c}0f`, borderColor: c } : {}
                }
              >
                <div className="mkt-role-content">
                  <div className="mkt-role-top">
                    <div
                      className="mkt-role-icon"
                      style={{ background: `${c}1a`, borderColor: `${c}40` }}
                    >
                      {role.icon}
                    </div>
                    <div
                      className="mkt-role-title"
                      style={isSelected ? { color: c } : {}}
                    >
                      {role.title}
                    </div>
                  </div>
                  <div className="mkt-role-desc">{role.desc}</div>
                  <div className="mkt-role-tags">
                    {role.tags.map((tag) => (
                      <span
                        key={tag}
                        className="mkt-role-tag"
                        style={
                          isSelected
                            ? { color: `${c}cc`, background: `${c}15` }
                            : {}
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="mkt-role-radio"
                  style={{ borderColor: isSelected ? c : undefined }}
                >
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <circle cx="7" cy="7" r="6" fill={c} />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={proceed}
          disabled={!selected}
          className="mkt-getstarted-submit"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
