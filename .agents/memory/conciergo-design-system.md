---
name: ConcierGo design system
description: Locked visual direction, language rules, and copy conventions for the ConcierGo web app
---

# ConcierGo visual direction

Mobile-first (also desktop) Spanish web app for finding people to attend live concerts with. Audience: young live-music fans.

## Locked foundation (extend, never replace)
- Palette: terracotta primary, cream background, charcoal foreground. Token names live in `artifacts/conciergo/src/index.css` — keep them stable.
- Type: Fraunces (serif, display/headers) + Plus Jakarta Sans (body).
- Personality layer ("gig-poster / indie venue"): solid foreground borders, hard offset shadows (`shadow-[Npx_Npx_0px_0px_hsl(var(--foreground))]`), bold uppercase headers, slight rotations on interactive elements, subtle noise/gradient texture.
- **Why:** The user rejected two extremes — an overloaded "vibecoded" original AND a too-minimal warm restyle. The gig-poster layer adds youthful energy on top of the warm minimalist base without going back to overloaded.

## Language rules
- UI is **Spanish only**. No emojis anywhere — use Lucide icons + CSS for flair.
- **Allowed** (intentional, not "untranslated"): genuine live-music loanwords Spanish fans actually use — `Backstage`, `Setlist`, `Rider`, `Fan`. These serve the personality goal; keep them.
- **Not allowed**: generic English UI that reads as lazy/untranslated — e.g. `LIVE` (use `EN DIRECTO`), nav labels like Events/Matches (use Spanish).
- **How to apply:** When a review flags an English string, judge intent: is it music vernacular (keep) or generic UI (translate)? Don't blanket-translate.
