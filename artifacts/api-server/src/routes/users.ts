import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/users/me", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  res.json(userToJson(user));
});

router.put("/users/me", requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const { name, bio, avatarUrl, musicGenres, city } = req.body;

  const [updated] = await db
    .update(usersTable)
    .set({
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(musicGenres !== undefined && { musicGenres }),
      ...(city !== undefined && { city }),
    })
    .where(eq(usersTable.id, user.id))
    .returning();

  res.json(userToJson(updated));
});

router.get("/users/:userId", requireAuth, async (req, res) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, Number(req.params.userId)),
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(userToJson(user));
});

export function userToJson(u: any) {
  return {
    id: u.id,
    authId: u.authId,
    name: u.name,
    bio: u.bio ?? null,
    avatarUrl: u.avatarUrl ?? null,
    musicGenres: u.musicGenres ?? [],
    city: u.city ?? null,
    createdAt: u.createdAt?.toISOString(),
  };
}

export default router;
