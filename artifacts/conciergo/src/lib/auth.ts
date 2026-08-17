import { createAuthClient } from "@neondatabase/neon-js/auth";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

const neonAuthUrl =
  (import.meta.env.VITE_NEON_AUTH_URL as string | undefined) ||
  "https://ep-wispy-scene-afocdyvb.neonauth.c-2.us-west-2.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(neonAuthUrl, {
  adapter: BetterAuthReactAdapter({
    fetchOptions: {
      credentials: "include",
    },
  }),
});

function isJwt(value: unknown): value is string {
  return typeof value === "string" && value.split(".").length === 3 && value.startsWith("eyJ");
}

function extractJwt(value: unknown): string | null {
  if (isJwt(value)) return value;
  if (!value || typeof value !== "object") return null;
  const obj = value as { data?: unknown; token?: unknown };
  if (isJwt(obj.token)) return obj.token;
  if (obj.data !== undefined && obj.data !== value) return extractJwt(obj.data);
  return null;
}

function sessionFromResult(result: unknown): {
  session?: { token?: string | null };
  user?: { name?: string | null; image?: string | null };
} | null {
  if (!result || typeof result !== "object") return null;
  const data = "data" in result ? (result as { data?: unknown }).data : result;
  if (!data || typeof data !== "object") return null;
  return data as { session?: { token?: string | null }; user?: { name?: string | null; image?: string | null } };
}

export async function getAccessToken(): Promise<string | null> {
  try {
    let headerJwt: string | null = null;
    const sessionResult = await authClient.getSession({
      fetchOptions: {
        onSuccess: (ctx: { response?: { headers?: { get?: (name: string) => string | null } } }) => {
          headerJwt = ctx.response?.headers?.get?.("set-auth-jwt") ?? null;
        },
      },
    });
    if (isJwt(headerJwt)) return headerJwt;

    const session = sessionFromResult(sessionResult);
    const sessionJwt = extractJwt(session?.session?.token);
    if (sessionJwt) return sessionJwt;
    if (!session?.session && !session?.user) return null;

    const fromClient = extractJwt(await authClient.token());
    if (fromClient) return fromClient;

    const response = await fetch(`${neonAuthUrl}/token`, { credentials: "include" });
    if (!response.ok) return null;
    return extractJwt(await response.json());
  } catch {
    // Stay signed-in in the UI even if the JWT endpoint is briefly unavailable.
  }
  return null;
}
