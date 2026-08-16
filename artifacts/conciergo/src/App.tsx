import { useEffect, useRef } from "react";
import { NeonAuthUIProvider, AuthView } from "@neondatabase/auth-ui";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getAccessToken } from "@/lib/auth";

import Home from "@/pages/home";
import Events from "@/pages/events";
import EventMap from "@/pages/event-map";
import EventNew from "@/pages/event-new";
import EventDetail from "@/pages/event-detail";
import Matches from "@/pages/matches";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import UserProfile from "@/pages/user-profile";
import NotFound from "@/pages/not-found";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

setAuthTokenGetter(getAccessToken);

function AuthQueryClientCacheInvalidator() {
  const { data } = authClient.useSession();
  const queryClientInstance = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const userId = data?.user?.id ?? null;
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
      queryClientInstance.clear();
    }
    prevUserIdRef.current = userId;
  }, [data?.user?.id, queryClientInstance]);

  return null;
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-chart-4/20 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-[440px]">{children}</div>
    </div>
  );
}

function SignInPage() {
  return (
    <AuthShell>
      <AuthView pathname="sign-in" />
    </AuthShell>
  );
}

function SignUpPage() {
  return (
    <AuthShell>
      <AuthView pathname="sign-up" />
    </AuthShell>
  );
}

function AuthProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      social={{ providers: ["google"] }}
      credentials={{ forgotPassword: true }}
      redirectTo={`${basePath || ""}/events`}
      navigate={(href) => setLocation(stripBase(href))}
    >
      <QueryClientProvider client={queryClient}>
        <AuthQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/sign-in" component={SignInPage} />
            <Route path="/sign-up" component={SignUpPage} />
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
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </NeonAuthUIProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AuthProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
