import { useEffect, useRef, lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getAccessToken } from "@/lib/auth";
import { RouteFallback } from "@/components/layout/route-fallback";

const Home = lazy(() => import("@/pages/home"));
const AuthPage = lazy(() => import("@/pages/auth"));
const Events = lazy(() => import("@/pages/events"));
const EventMap = lazy(() => import("@/pages/event-map"));
const EventNew = lazy(() => import("@/pages/event-new"));
const EventDetail = lazy(() => import("@/pages/event-detail"));
const Matches = lazy(() => import("@/pages/matches"));
const Chat = lazy(() => import("@/pages/chat"));
const Profile = lazy(() => import("@/pages/profile"));
const UserProfile = lazy(() => import("@/pages/user-profile"));
const NotFound = lazy(() => import("@/pages/not-found"));

setAuthTokenGetter(getAccessToken);

function AuthQueryClientCacheInvalidator() {
  const { data } = authClient.useSession();
  const queryClientInstance = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const userId = data?.user?.id ?? null;
    const previous = prevUserIdRef.current;
    prevUserIdRef.current = userId;
    // First hydrate (undefined → id) must not wipe in-flight queries.
    // Clear only when a signed-in user signs out or switches accounts.
    if (previous && previous !== userId) {
      queryClientInstance.clear();
    }
  }, [data?.user?.id, queryClientInstance]);

  return null;
}

export function AuthProviderWithRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryClientCacheInvalidator />
      <TooltipProvider>
        <Suspense fallback={<RouteFallback withLayout />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/auth/:pathname" component={AuthPage} />
            <Route path="/sign-in">{() => <Redirect to="/auth/sign-in" />}</Route>
            <Route path="/sign-up">{() => <Redirect to="/auth/sign-up" />}</Route>
            <Route path="/events" component={Events} />
            <Route path="/events/map" component={EventMap} />
            <Route path="/events/new" component={EventNew} />
            <Route path="/events/:id" component={EventDetail} />
            <Route path="/matches" component={Matches} />
            <Route path="/matches/:matchId" component={Chat} />
            <Route path="/profile" component={Profile} />
            <Route path="/profile/:userId" component={UserProfile} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
