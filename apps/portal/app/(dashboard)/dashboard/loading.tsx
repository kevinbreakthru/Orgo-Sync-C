import { Skeleton, SkeletonCard } from "../../../components/shared/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
