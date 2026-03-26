import { Skeleton } from "../../../../components/shared/skeleton";

export default function PlaygroundLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg mb-4" />
      <div className="dark-card rounded-2xl border border-neutral-800/60 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-neutral-800/60 flex items-center gap-3">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-40 ml-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800/60">
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
        </div>
      </div>
    </div>
  );
}
