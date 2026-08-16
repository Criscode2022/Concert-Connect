import { authClient } from "@/lib/auth";

export function useAuth() {
  const { data, isPending } = authClient.useSession();
  return {
    isSignedIn: Boolean(data?.session && data?.user),
    isPending,
    user: data?.user ?? null,
    session: data?.session ?? null,
  };
}
