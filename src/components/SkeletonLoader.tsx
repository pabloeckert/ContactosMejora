import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header skeleton */}
      <div className="flex gap-4 px-4 py-3 bg-muted/50 rounded-md">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse flex-1" />
        ))}
      </div>
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b">
          {Array.from({ length: 6 }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-muted/60 rounded animate-pulse flex-1"
              style={{ animationDelay: `${(i * 6 + j) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted/60 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-3" />
            <div className="h-8 w-16 bg-muted/60 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
      <div className="md:col-span-2 lg:col-span-4">
        <Card>
          <CardContent className="p-6">
            <div className="h-48 bg-muted/40 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
