/**
 * Vercel serverless entry for the Express API.
 * The app is compiled to artifacts/api-server/dist/app.mjs.
 */
let cachedApp;

module.exports = async (req, res) => {
  try {
    if (!cachedApp) {
      const mod = await import("../artifacts/api-server/dist/app.mjs");
      cachedApp = mod.default;
    }
    return cachedApp(req, res);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("API failed to start:", message);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "API failed to start", message }));
  }
};
