import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { readBearerToken, verifyNeonToken } from "../lib/neonAuth";

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = readBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    const profile = await verifyNeonToken(token);
    if (!profile.id) return next();

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
    }

    (req as any).authId = profile.id;
    (req as any).dbUser = user;
  } catch {
    // Unauthenticated guests can still hit public routes.
  }

  next();
}
