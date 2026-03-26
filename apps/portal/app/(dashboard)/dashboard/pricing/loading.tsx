import { Skeleton, SkeletonCard } from "../../../../components/shared/skeleton";

export default function PricingLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-7 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        <SkeletonCard className="h-[340px]" />
        <SkeletonCard className="h-[340px]" />
        <SkeletonCard className="h-[340px]" />
      </div>
      <SkeletonCard className="h-[120px]" />
    </div>
  );
}
