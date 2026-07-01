---
name: ConcierGo stack & data model decisions
description: Non-obvious backend/frontend decisions for the ConcierGo concert-matching app
---

- **Google Maps v2 loader**: `@googlemaps/js-api-loader` v2 removed the `Loader` class. Use `setOptions({ key })` (param is `key`, NOT `apiKey`) + `importLibrary("maps"|"marker")`. `AdvancedMarkerElement` requires a `mapId` on the map (use `"DEMO_MAP_ID"` in dev) — and a `mapId` is mutually exclusive with custom `styles`. For clickable markers with custom HTML content, attach the `click` listener to the content `div` directly (not the marker) and set `gmpClickable: true`.

- **Auth model**: cookie-based Clerk on web. `requireAuth` for writes, `optionalAuth` for public reads (GET /events, GET /events/:id) so the map works logged-out (pass `userId = -1` so `isAttending` is false). Both middlewares JIT-create the DB user.
  - **Why:** map/events must render before login. Real names/avatars come from `clerkClient.users.getUser()` (session claims are usually empty), resolved in `resolveClerkProfile`. `requireAuth` self-heals users still named "Anonymous" on next request.

- **Matching rule — attendance is the source of truth**: matches are created pairwise among all attendees on `POST /events/:id/attend`. On `DELETE .../attend` you MUST also delete that event's matches involving the user (cascade removes their messages), otherwise stale matches let non-attendees keep chatting. Chat endpoints then naturally 404 for removed matches — no per-message attendance check needed.
  - **Why:** requirement is "only registered users who marked attendance can chat." Un-attend must revoke chat access.

- **FK cascade trap**: `events.created_by_user_id` is `onDelete: cascade`. Deleting a user who created events deletes those events (and cascades to attendees/matches/messages). Before deleting any user, reassign `created_by_user_id` to a surviving user first.

- **No seed users**: fake seed users (`clerk_id LIKE 'seed_user_%'`) were purged — they polluted matches with phantom users nobody could log in as. Do NOT reintroduce fake users; seed only events if needed.
