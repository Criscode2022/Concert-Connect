import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(15 75% 55%)",
    colorForeground: "hsl(20 15% 15%)",
    colorMutedForeground: "hsl(20 10% 45%)",
    colorDanger: "hsl(0 70% 50%)",
    colorBackground: "hsl(40 20% 97%)",
    colorInput: "hsl(30 15% 90%)",
    colorInputForeground: "hsl(20 15% 15%)",
    colorNeutral: "hsl(30 15% 90%)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden border-2 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-foreground font-serif text-3xl font-bold tracking-tight uppercase",
    headerSubtitle: "text-muted-foreground font-sans font-medium",
    socialButtonsBlockButtonText: "text-foreground font-bold uppercase tracking-wide",
    formFieldLabel: "text-foreground font-bold uppercase tracking-wider text-xs",
    footerActionLink: "text-primary hover:text-primary/90 font-bold uppercase tracking-wider text-sm border-b-2 border-primary/30 hover:border-primary transition-colors",
    footerActionText: "text-muted-foreground font-medium",
    dividerText: "text-muted-foreground font-bold text-xs uppercase tracking-wider",
    identityPreviewEditButton: "text-primary hover:text-primary/90",
    formFieldSuccessText: "text-primary font-bold",
    alertText: "text-destructive font-bold",
    logoBox: "mb-8 flex justify-center",
    logoImage: "h-12 w-auto",
    socialButtonsBlockButton: "bg-background border-2 border-border hover:border-foreground hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 transition-all rounded-xl",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-transparent hover:border-foreground hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 hover:-translate-x-1 transition-all rounded-xl font-bold uppercase tracking-wide",
    formFieldInput: "bg-background border-2 border-border text-foreground focus:ring-0 focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all rounded-xl font-medium",
    footerAction: "mt-6",
    dividerLine: "bg-border h-0.5",
    alert: "bg-destructive/10 border-2 border-destructive text-destructive rounded-xl font-medium",
    otpCodeFieldInput: "bg-background border-2 border-border text-foreground focus:ring-0 focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] rounded-xl font-bold text-xl",
    formFieldRow: "mb-5",
    main: "w-full",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)"/></svg>
      </div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-chart-4/20 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-[440px]">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)"/></svg>
      </div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-chart-3/20 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-[440px]">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Bienvenido de nuevo",
            subtitle: "Inicia sesión para conectar con otros fans",
          },
        },
        signUp: {
          start: {
            title: "Únete a ConcierGo",
            subtitle: "Encuentra tu grupo para el próximo concierto",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
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
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
