"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatSegment(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => !UUID_RE.test(s));

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-body-sm">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home size={14} strokeWidth={2} />
      </Link>

      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const isMiddle = !isLast && i > 0;

        return (
          <span key={href} className={isMiddle ? "hidden sm:flex items-center gap-1" : "flex items-center gap-1"}>
            <ChevronRight size={12} className="text-muted-foreground/50" />
            {isLast ? (
              <span className="text-foreground font-medium truncate max-w-[160px] sm:max-w-[200px]">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
