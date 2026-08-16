import { db, usersTable, type User } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import type { NeonAuthUser } from "./neonAuth";

async function resolveProfile(profile: NeonAuthUser): Promise<{ name: string; avatarUrl: string | null }> {
  let name = profile.name;
  let avatarUrl = profile.avatarUrl;
  if (!name || name === "Usuario") {
    try {
      const result = await db.execute(
        sql`select name, image from neon_auth."user" where id = ${profile.id} limit 1`,
      );
      const row = (result as { rows?: Array<{ name?: string; image?: string | null }> }).rows?.[0];
      if (row?.name) name = row.name;
      if (row?.image) avatarUrl = row.image;
    } catch {
      // neon_auth lookup is best-effort
    }
  }
  return { name, avatarUrl };
}

export async function provisionUser(profile: NeonAuthUser): Promise<User> {
  const resolved = await resolveProfile(profile);

  let user = await db.query.usersTable.findFirst({
    where: eq(usersTable.authId, profile.id),
  });

  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({
        authId: profile.id,
        name: resolved.name,
        avatarUrl: resolved.avatarUrl,
        musicGenres: [],
      })
      .returning();
    return user;
  }

  if (
    (resolved.name && resolved.name !== "Usuario" && user.name !== resolved.name) ||
    (!user.avatarUrl && resolved.avatarUrl)
  ) {
    [user] = await db
      .update(usersTable)
      .set({
        name: resolved.name && resolved.name !== "Usuario" ? resolved.name : user.name,
        avatarUrl: user.avatarUrl ?? resolved.avatarUrl,
      })
      .where(eq(usersTable.id, user.id))
      .returning();
  }

  return user;
}
