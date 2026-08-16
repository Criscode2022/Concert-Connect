import type { Request, Response, NextFunction } from "express";
import { readBearerToken, verifyNeonToken } from "../lib/neonAuth";
import { provisionUser } from "../lib/provisionUser";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = readBearerToken(req);
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const profile = await verifyNeonToken(token);
    if (!profile.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const user = await provisionUser(profile);
    (req as any).authId = profile.id;
    (req as any).dbUser = user;
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    if (message.includes("DATABASE_URL")) {
      res.status(500).json({ error: message });
      return;
    }
    res.status(401).json({ error: "Unauthorized" });
  }
}
