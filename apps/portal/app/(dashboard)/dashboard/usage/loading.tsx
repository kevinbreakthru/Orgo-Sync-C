import { Skeleton, SkeletonCard, SkeletonChart, SkeletonTable } from "../../../../components/shared/skeleton";

export default function UsageLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable rows={8} />
    </div>
  );
}
