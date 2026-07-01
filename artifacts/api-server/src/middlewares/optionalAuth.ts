import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (clerkId) {
    let user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, clerkId) });
    if (!user) {
      const name = (auth as any)?.sessionClaims?.name || (auth as any)?.sessionClaims?.email || "Anonymous";
      const avatarUrl = (auth as any)?.sessionClaims?.image_url || null;
      [user] = await db.insert(usersTable).values({
        clerkId,
        name: String(name),
        avatarUrl,
        musicGenres: [],
      }).returning();
    }
    (req as any).clerkId = clerkId;
    (req as any).dbUser = user;
  }
  next();
}
