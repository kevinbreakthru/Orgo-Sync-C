import { Skeleton, SkeletonCard, SkeletonTable } from "../../../../components/shared/skeleton";

export default function KeysLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <SkeletonCard className="mb-6" />
      <SkeletonCard className="mb-8" />
      <Skeleton className="h-5 w-28 mb-4" />
      <SkeletonTable rows={4} />
    </div>
  );
}
