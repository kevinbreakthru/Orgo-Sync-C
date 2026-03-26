"use client";

import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-neutral-800/50",
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "dark-card rounded-2xl border border-neutral-800/60 p-6",
        className
      )}
    >
      <Skeleton className="h-3 w-20 mb-4" />
      <Skeleton className="h-8 w-16 mb-3" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "dark-card rounded-2xl border border-neutral-800/60 p-5",
        className
      )}
    >
      <Skeleton className="h-4 w-40 mb-5" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }: SkeletonProps & { rows?: number }) {
  return (
    <div
      className={cn(
        "dark-card rounded-2xl border border-neutral-800/60 overflow-hidden",
        className
      )}
    >
      <div className="px-5 py-3 border-b border-neutral-800/60">
        <Skeleton className="h-3 w-48" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-5 py-3 border-b border-neutral-800/60 last:border-0 flex items-center gap-4"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32 ml-auto" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
