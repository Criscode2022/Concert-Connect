import { createAuthClient } from "@neondatabase/neon-js/auth";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

const neonAuthUrl =
  (import.meta.env.VITE_NEON_AUTH_URL as string | undefined) ||
  "https://ep-wispy-scene-afocdyvb.neonauth.c-2.us-west-2.aws.neon.tech/neondb/auth";

export const authClient = createAuthClient(neonAuthUrl, {
  adapter: BetterAuthReactAdapter(),
});

export async function getAccessToken(): Promise<string | null> {
  const result = await authClient.token();
  if ("data" in result && result.data && "token" in result.data) {
    return (result.data as { token?: string }).token ?? null;
  }
  return null;
}
