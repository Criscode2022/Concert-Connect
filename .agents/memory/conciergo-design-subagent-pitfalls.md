---
name: ConcierGo design-subagent pitfalls
description: Regressions the DESIGN subagent keeps reintroducing on ConcierGo restyles — check every pass
---

# Verify after every ConcierGo design pass

Design passes must be **presentation-only**. The subagent has repeatedly (2+ passes) slipped in the same non-visual regressions. After any restyle, check ALL of these before declaring done:

1. **event-new.tsx lat/lng payload** — subagent keeps changing the create-event payload defaults from `lat: 0, lng: 0` to hardcoded Madrid coords (`40.4168, -3.7038`). These MUST stay `0, 0` placeholders (Maps not fully wired). Revert every time.
2. **Escaped backticks in .tsx** — `\`` or `\${` inside template literals cause "Invalid character"/"Unterminated template literal" build errors. Grep `src` for `\\\`` and `\\\$\{`. Most likely in `event-map.tsx`.
3. **not-found.tsx** — subagent has skipped this file before; confirm it got the restyle + is Spanish.
4. **Google Maps wiring untouched** — `event-map.tsx` must keep `setOptions`, `importLibrary("maps")`+`("marker")`, `AdvancedMarkerElement`, `gmpClickable`, and the pin `click` handler behaviorally unchanged (visual pin/card styling is fine).
5. **English UI leaks** — flag generic English (translate) vs music loanwords (keep) per the design-system note.

## Verification workflow
- `pnpm --filter @workspace/conciergo exec tsc --noEmit` — IGNORE pre-existing out-of-scope errors: missing `queryKey` in query options (chat.tsx, user-profile.tsx), missing `google` namespace types + `version` in APIOptions (event-map.tsx). Only new errors matter.
- Do NOT use `pnpm ... run build` to typecheck — it FAILS without a `PORT` env var. Use tsc.
- Restart workflow `artifacts/conciergo: web`, then screenshot via app_preview `artifact_dir_name="conciergo"`. Public routes: `/` (landing) and `/nope` (404). Most pages need Clerk auth to view.
