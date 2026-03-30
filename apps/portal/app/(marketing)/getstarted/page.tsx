"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "platform" | /* "operator" | */ "builder";

const ROLES: { id: Role; title: string; desc: string; tags: string[]; icon: React.ReactNode }[] = [
  {
    id: "platform",
    title: "Platform",
    desc: "I run a scheduling platform that publishes data for organizations or leagues.",
    tags: ["Youth sports platforms", "League management software", "Registration platforms"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#FF4D00" />
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#FF4D00" opacity="0.5" />
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#FF4D00" opacity="0.5" />
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#FF4D00" opacity="0.3" />
      </svg>
    ),
  },
  // {
  //   id: "operator",
  //   title: "Operator",
  //   desc: "I run multiple scheduling systems that don't talk to each other.",
  //   tags: ["Sports academies", "School districts", "Multi-system orgs"],
  //   icon: (
  //     <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
  //       <circle cx="6" cy="6" r="3" fill="#FF4D00" />
  //       <circle cx="12" cy="12" r="3" fill="#FF4D00" opacity="0.5" />
  //       <line x1="6" y1="6" x2="12" y2="12" stroke="#FF4D00" strokeWidth="1.5" opacity="0.6" />
  //     </svg>
  //   ),
  // },
  {
    id: "builder",
    title: "Builder",
    desc: "I'm building a product that needs access to scheduling data.",
    tags: ["AI scheduling tools", "Fan engagement apps", "Participant platforms"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="8" width="14" height="8" rx="2" fill="#FF4D00" opacity="0.4" />
        <rect x="5" y="2" width="8" height="8" rx="2" fill="#FF4D00" />
        <rect x="7" y="5" width="4" height="2" rx="1" fill="#0D0D0D" opacity="0.5" />
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
            How are you using<br /><span>Orgo Sync?</span>
          </h1>
          <p className="mkt-getstarted-sub">
            Select the option that best describes you.
          </p>
        </div>

        <div className="mkt-getstarted-roles">
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`mkt-role-card ${isSelected ? "mkt-role-card--active" : ""}`}
              >
                <div className="mkt-role-icon">{role.icon}</div>
                <div className="mkt-role-content">
                  <div className="mkt-role-title">{role.title}</div>
                  <div className="mkt-role-desc">{role.desc}</div>
                  <div className="mkt-role-tags">
                    {role.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`mkt-role-tag ${isSelected ? "mkt-role-tag--active" : ""}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`mkt-role-radio ${isSelected ? "mkt-role-radio--active" : ""}`}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
