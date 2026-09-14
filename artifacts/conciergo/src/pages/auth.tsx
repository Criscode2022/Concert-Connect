import { AuthView, NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { Link, useLocation, useParams } from "wouter";
import { authClient } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
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

export default function AuthPage() {
  const params = useParams<{ pathname?: string }>();
  const [, setLocation] = useLocation();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      social={{ providers: ["google"] }}
      credentials={{ forgotPassword: true }}
      signUp={{ fields: ["name"] }}
      nameRequired
      basePath="/auth"
      redirectTo="/events"
      navigate={(href) => setLocation(stripBase(href))}
      replace={(href) => setLocation(stripBase(href), { replace: true })}
      Link={Link}
      onSessionChange={() => {
        queryClient.invalidateQueries();
      }}
    >
      <AuthShell>
        <AuthView path={params.pathname} />
      </AuthShell>
    </NeonAuthUIProvider>
  );
}
