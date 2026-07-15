# BrandCheck

Paste a brand name from an Amazon listing. Get a plain-English breakdown of the
linguistic "pseudo-brand" signals it's throwing off — and a link to actually
check the trademark before you trust it.

## Why

Amazon is full of invented, vaguely-plausible brand names (`KUAFYQ`,
`Vensiono`, `MIDONE`) generated to slip past search and squat on a keyword.
Tools like Knockoff flag these at the *listing* scan level, but the actual
signal — what makes a string *feel* like an AI-generated pseudo-brand instead
of a real word — is usually hidden inside a black-box filter. BrandCheck makes
that signal legible for a single name, in the open, in under a second.

## What it does

Type or paste a brand name and watch it get scored live, letter by letter:

- **Vowel density** — real words breathe; pseudo-brands often don't.
- **Consonant clustering** — runs like `-nzq-` or `-vlk-` are a strong tell.
- **All-caps ratio** — SHOUTY strings skew synthetic/keyword-stuffed.
- **Pronounceability** — can an English speaker say it out loud on the first try?

Each metric highlights directly on the letters as you type, and a verdict
badge flips from *checking…* to a red / yellow / green call — transparently,
with the scoring shown, not hidden behind a single opaque flag. A one-click
link takes you to the USPTO TESS trademark search to actually verify the name.

## Features

- [x] Live, per-letter heuristic scoring (vowel density, consonant clusters,
      caps ratio, pronounceability) combined into a single 0–100 signal score
- [x] Red / yellow / green verdict badge, cross-fading between states, with
      the full scoring breakdown visible (each metric's plain-English detail)
- [x] One-click link out to USPTO TESS trademark search for the typed name
- [x] Shareable/permalink-able result for a given name (`#name=...`)
- [x] A reference set of known-real vs. known-invented names to sanity-check
      the heuristic against (`tests/fixtures/brandNames.ts`)

## Stack

- **TypeScript**, bundled with [Vite](https://vitejs.dev/)
- No framework — a small, dependency-light scoring module plus vanilla DOM
- [Vitest](https://vitest.dev/) for unit tests
- Static output (`dist/`), deployable to any static host or subpath

## Status

Core scope from [`docs/BACKLOG.md`](docs/BACKLOG.md) is complete. See
[`docs/VISION.md`](docs/VISION.md) for the design rationale and
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a map of the codebase.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # run the scorer test suite
npm run build    # production build into dist/
```

## License

MIT — see [LICENSE](LICENSE).
