import { Skeleton } from "@/components/ui/skeleton";

type LoadingSkeletonProps = {
  variant: "card" | "list" | "detail" | "table";
  count?: number;
};

function CardSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b py-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  switch (variant) {
    case "card":
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );

    case "list":
      return (
        <div className="divide-y">
          {items.map((i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      );

    case "detail":
      return <DetailSkeleton />;

    case "table":
      return (
        <div>
          {/* Table header skeleton */}
          <div className="flex items-center gap-4 border-b py-3">
            <Skeleton className="h-4 w-1/4 font-medium" />
            <Skeleton className="h-4 w-1/4 font-medium" />
            <Skeleton className="h-4 w-1/4 font-medium" />
            <Skeleton className="h-4 w-1/4 font-medium" />
          </div>
          {items.map((i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      );
  }
}
