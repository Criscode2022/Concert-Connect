import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { resolveClerkProfile } from "./clerkProfile";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let user = await db.query.usersTable.findFirst({ where: eq(usersTable.clerkId, clerkId) });
  if (!user) {
    const { name, avatarUrl } = await resolveClerkProfile(clerkId, auth);
    [user] = await db.insert(usersTable).values({
      clerkId,
      name,
      avatarUrl,
      musicGenres: [],
    }).returning();
  } else if (!user.name || user.name === "Anonymous") {
    const { name, avatarUrl } = await resolveClerkProfile(clerkId, auth);
    if (name !== "Anonymous") {
      [user] = await db
        .update(usersTable)
        .set({ name, avatarUrl: user.avatarUrl ?? avatarUrl })
        .where(eq(usersTable.id, user.id))
        .returning();
    }
  }

  (req as any).clerkId = clerkId;
  (req as any).dbUser = user;
  next();
}
