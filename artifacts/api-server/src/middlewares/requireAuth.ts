import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { readBearerToken, verifyNeonToken } from "../lib/neonAuth";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = readBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let profile;
  try {
    profile = await verifyNeonToken(token);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!profile.id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let user = await db.query.usersTable.findFirst({
    where: eq(usersTable.authId, profile.id),
  });

  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({
        authId: profile.id,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        musicGenres: [],
      })
      .returning();
  } else if (!user.name || user.name === "Anonymous" || user.name === "Usuario") {
    if (profile.name && profile.name !== "Usuario") {
      [user] = await db
        .update(usersTable)
        .set({
          name: profile.name,
          avatarUrl: user.avatarUrl ?? profile.avatarUrl,
        })
        .where(eq(usersTable.id, user.id))
        .returning();
    }
  }

  (req as any).authId = profile.id;
  (req as any).dbUser = user;
  next();
}
