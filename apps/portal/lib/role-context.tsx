"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Role = "platform" | "builder" | "operator";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  isLoading: boolean;
}

const DEMO_MODE = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === "true";
const STORAGE_KEY = "orgo_sync_role";
const DEFAULT_ROLE: Role = "platform";

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(DEFAULT_ROLE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      const stored = localStorage.getItem(STORAGE_KEY) as Role | null;
      if (stored && ["platform", "builder", "operator"].includes(stored)) {
        setRoleState(stored);
      }
    }
    // Future: read from Supabase JWT claims here when DEMO_MODE is false
    setIsLoading(false);
  }, []);

  function setRole(next: Role) {
    setRoleState(next);
    if (DEMO_MODE) {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// RoleGate — renders children only when the active role is in `allow`.
// While the role is still loading it renders nothing (or a fallback).
// ---------------------------------------------------------------------------
interface RoleGateProps {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role, isLoading } = useRole();
  if (isLoading) return null;
  if (!allow.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
