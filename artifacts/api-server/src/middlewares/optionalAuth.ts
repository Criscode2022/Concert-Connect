import type { Request, Response, NextFunction } from "express";
import { readBearerToken, verifyNeonToken } from "../lib/neonAuth";
import { provisionUser } from "../lib/provisionUser";

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = readBearerToken(req);
  if (!token) {
    next();
    return;
  }

  try {
    const profile = await verifyNeonToken(token);
    if (!profile.id) {
      next();
      return;
    }
    const user = await provisionUser(profile);
    (req as any).authId = profile.id;
    (req as any).dbUser = user;
  } catch {
    // Guests can still hit public routes.
  }

  next();
}
