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

function sessionFromResult(result: unknown): { session?: unknown; user?: { name?: string | null; image?: string | null } } | null {
  if (!result || typeof result !== "object") return null;
  const data = "data" in result ? (result as { data?: unknown }).data : result;
  if (!data || typeof data !== "object") return null;
  return data as { session?: unknown; user?: { name?: string | null; image?: string | null } };
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const sessionResult = await authClient.getSession();
    const session = sessionFromResult(sessionResult);
    if (!session?.session) return null;

    const tokenResult = await authClient.token();
    if (tokenResult && typeof tokenResult === "object" && "data" in tokenResult) {
      const token = (tokenResult.data as { token?: string } | null)?.token;
      if (token) return token;
    }
  } catch {
    // Stay signed-in in the UI even if the JWT endpoint is briefly unavailable.
  }
  return null;
}
