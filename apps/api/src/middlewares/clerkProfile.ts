import { clerkClient } from "@clerk/express";

export async function resolveClerkProfile(
  clerkId: string,
  auth: any
): Promise<{ name: string; avatarUrl: string | null }> {
  try {
    const u = await clerkClient.users.getUser(clerkId);
    const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
    const email = u.emailAddresses?.[0]?.emailAddress ?? null;
    const name = fullName || u.username || (email ? email.split("@")[0] : "") || "Usuario";
    return { name, avatarUrl: u.imageUrl ?? null };
  } catch {
    const claimName =
      auth?.sessionClaims?.name ||
      auth?.sessionClaims?.email ||
      "Usuario";
    return {
      name: String(claimName),
      avatarUrl: auth?.sessionClaims?.image_url || null,
    };
  }
}
