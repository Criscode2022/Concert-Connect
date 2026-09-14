import { StaticAppShell } from "@/components/layout/static-app-shell";
import { Skeleton } from "@/components/ui/skeleton";

function EventCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-foreground bg-card">
      <div className="relative h-32 w-full overflow-hidden border-b-2 border-foreground bg-muted md:h-48">
        <Skeleton className="absolute inset-0 rounded-none bg-foreground/8" />
        <Skeleton className="absolute top-3 left-3 h-7 w-16 -rotate-1 rounded-lg border-2 border-foreground/15 bg-primary/20" />
        <Skeleton className="absolute top-3 right-3 h-7 w-14 rotate-2 rounded-lg border-2 border-foreground/15 bg-background/80" />
      </div>
      <div className="flex flex-1 flex-col p-3 md:p-5">
        <Skeleton className="mb-2 h-7 w-3/4 md:h-8" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <Skeleton className="h-8 w-40 rounded-md border-2 border-transparent" />
        <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-border pt-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-10 w-28 rounded-xl border-2 border-foreground/15" />
        </div>
      </div>
    </div>
  );
}

export function EventsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      role="status"
      aria-label="Cargando cartelera"
    >
      {Array.from({ length: count }, (_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
}

function EventsSkeletonHeading() {
  return (
    <div className="mb-8">
      <h1 className="mb-5 text-4xl font-serif font-bold uppercase tracking-tighter text-foreground md:text-5xl">
        Cartelera
      </h1>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20 rounded-lg border-2 border-foreground/15" />
        <Skeleton className="h-8 w-24 rounded-lg border-2 border-foreground/15" />
        <Skeleton className="h-8 w-16 rounded-lg border-2 border-foreground/15" />
      </div>
    </div>
  );
}

function EventsSkeletonBody() {
  return (
    <div className="mx-auto max-w-5xl p-4 pb-32 md:p-10 md:pb-12">
      <EventsSkeletonHeading />
      <EventsListSkeleton />
    </div>
  );
}

export function EventsPageFallback() {
  return (
    <StaticAppShell title="Eventos">
      <EventsSkeletonBody />
    </StaticAppShell>
  );
}

export const EventsPageSkeleton = EventsPageFallback;
