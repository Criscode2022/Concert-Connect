import { EventsPageFallback, EventsPageSkeleton } from "@/components/events/events-skeleton";
import { PageLoader } from "@/components/layout/page-loader";

export function isEventsIndexPath(pathname: string): boolean {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  let path = pathname.replace(/\/+$/, "") || "/";
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }
  return path === "/events";
}

export function RouteFallback({ withLayout = false }: { withLayout?: boolean }) {
  if (typeof window !== "undefined" && isEventsIndexPath(window.location.pathname)) {
    return withLayout ? <EventsPageSkeleton /> : <EventsPageFallback />;
  }
  return <PageLoader />;
}
