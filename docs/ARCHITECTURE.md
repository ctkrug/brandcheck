# BrandCheck — Architecture

A static, client-side-only TypeScript app. No backend, no build-time data,
no name storage. Bundled by Vite; tested with Vitest.

## Modules

- **`src/scorer.ts`** — the scoring engine, pure functions only (no DOM).
  - `analyzeBrandName(raw)` runs the four heuristics (vowel density,
    consonant clustering, all-caps ratio, pronounceability), combines them
    into a weighted 0-100 `overallScore`, and maps that to a `Verdict`
    (`checking` / `insufficient` / `green` / `yellow` / `red`).
  - `classifyLetters(raw)` classifies each character (`vowel` / `consonant`
    / `cluster` / `other`) for the live per-letter highlight overlay; reuses
    the same 3+ run threshold as the clustering metric.
  - Names under 3 letters get `insufficient` instead of a confident color
    call — not enough signal for the metrics to mean anything.
- **`src/urlState.ts`** — pure `encodeNameToHash`/`decodeNameFromHash` for
  the shareable-link feature (`#name=...`). Kept separate from scoring
  since it's URL plumbing, not a scoring concern.
- **`src/main.ts`** — all DOM wiring. Renders the page shell once (including
  the static "how this works" methodology strip below the panel), then on
  every `input` event: re-scores, re-renders the letter-highlight overlay,
  updates the verdict badge (cross-fading via a `flip` class + timeout that
  matches the CSS transition duration), rewrites the metric list, updates
  the TESS link, and syncs the URL hash via `history.replaceState`. Input is
  capped at `MAX_INPUT_LENGTH` (200 chars, both via `maxlength` and a clamp
  on the hash-decoded value) — no real brand name is close to that long, and
  it bounds the highlight layer's per-character DOM node count.
- **`src/style.css`** — design tokens and all styling; see `docs/DESIGN.md`
  for the rationale. Notable techniques: the input's own text is
  transparent (`caret-color` keeps the cursor visible) so a positioned
  `.highlight-layer` sibling can show colored letter spans underneath it;
  the panel's corner brackets are four absolutely-positioned `<span>`s,
  not a background-gradient hack (that rendered incorrectly).

## Data flow

```
keystroke → analyzeBrandName(value) → { metrics, overallScore, verdict }
                                     → renderHighlightLayer (classifyLetters)
                                     → setVerdict (cross-fade if changed)
                                     → metrics list + TESS link href
                                     → encodeNameToHash → history.replaceState
```

On load, `decodeNameFromHash(location.hash)` prefills the input before the
first `update()` call, so a shared link reproduces its result immediately.

## Running it

```bash
npm install
npm run dev            # local dev server
npm test               # vitest run — scorer, classifyLetters, urlState, fixtures
npm run test:coverage  # vitest run --coverage — scoped to scorer.ts + urlState.ts
npm run lint           # eslint
npm run build          # tsc --noEmit + vite build -> dist/
```

## Testing strategy

Pure logic (`scorer.ts`, `urlState.ts`) is unit-tested directly, including
boundaries (empty input, non-alphabetic/non-Latin input, the 3-letter
insufficient-signal threshold, and the exact `verdictFromScore` red/yellow/
green cutoffs). `tests/fixtures/brandNames.ts` holds a reference set of 20
real names and 20 invented pseudo-brands; `tests/fixtures.test.ts` asserts
`analyzeBrandName` verdicts at least 80% of each group correctly (currently
100% real / 90% invented). `npm run test:coverage` scopes v8 coverage to
`scorer.ts` + `urlState.ts` (currently 100% line coverage on both) — DOM
wiring in `main.ts` is intentionally thin and not unit-tested — it was
verified by driving a real Chromium instance against the dev server and a
subpath-mounted static build (see PR/run notes).

## Deployment

`vite.config.ts` sets `base: "./"` so every emitted asset path is relative
— the build in `dist/` works whether served from `/` or a subpath like
`apps.charliekrug.com/brandcheck/`. Verified by copying `dist/` into a
`brandcheck/` subdirectory of a local static server and confirming the app
loads and functions with no failed requests.
