/**
 * Vercel serverless entry for the Express API (single-project monorepo deploy).
 *
 * `turbo run build --filter=@concert-connect/api` compiles Express to
 * apps/api/dist/app.mjs. This function reuses the exported app across
 * warm invocations. Socket.io is not attached here — it only runs on the
 * long-lived `pnpm api` process.
 */
let cachedApp;

module.exports = async (req, res) => {
  if (!cachedApp) {
    const mod = await import("../apps/api/dist/app.mjs");
    cachedApp = mod.default;
  }
  return cachedApp(req, res);
};
