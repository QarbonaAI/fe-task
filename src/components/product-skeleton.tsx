import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="p-4">
          <div className="space-y-3">
            {/* Table header */}
            <div className="grid grid-cols-9 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
            
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-9 gap-4 py-3">
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className="h-4" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
} 