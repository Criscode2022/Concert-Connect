import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

function getAuthBaseUrl(): string {
  const url = process.env.NEON_AUTH_BASE_URL ?? process.env.NEON_AUTH_URL;
  if (!url) {
    throw new Error("NEON_AUTH_BASE_URL must be set");
  }
  return url.replace(/\/$/, "");
}

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${getAuthBaseUrl()}/.well-known/jwks.json`));
  }
  return jwks;
}

export type NeonAuthUser = {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string | null;
};

export async function verifyNeonToken(token: string): Promise<NeonAuthUser> {
  const { payload } = await jwtVerify(token, getJwks(), {
    issuer: new URL(getAuthBaseUrl()).origin,
  });
  return profileFromPayload(payload);
}

export function profileFromPayload(payload: JWTPayload): NeonAuthUser {
  const id = typeof payload.sub === "string" ? payload.sub : "";
  const email = typeof payload.email === "string" ? payload.email : undefined;
  const nameFromClaim = typeof payload.name === "string" ? payload.name.trim() : "";
  const name =
    nameFromClaim ||
    (email ? email.split("@")[0] : "") ||
    "Usuario";
  const avatarUrl =
    typeof payload.image === "string"
      ? payload.image
      : typeof payload.picture === "string"
        ? payload.picture
        : null;

  return { id, name, email, avatarUrl };
}

export function readBearerToken(req: { headers: { authorization?: string } }): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}
