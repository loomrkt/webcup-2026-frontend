import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64 bg-white/10" />
        <Skeleton className="h-3.5 w-96 bg-white/10" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl bg-white/10" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-40 rounded-2xl bg-white/10" />
        <Skeleton className="h-52 rounded-2xl bg-white/10" />
      </div>
      <Skeleton className="h-64 rounded-2xl bg-white/10" />
    </div>
  );
}