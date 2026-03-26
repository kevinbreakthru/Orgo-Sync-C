import { Skeleton, SkeletonCard } from "../../../../components/shared/skeleton";

export default function MappingsLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} className="p-4" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Skeleton className="h-[600px] rounded-2xl" />
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
    </div>
  );
}
