# Fauxmark

**▶ Live demo: [apps.charliekrug.com/brandcheck](https://apps.charliekrug.com/brandcheck/)**

![CI](https://github.com/ctkrug/brandcheck/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

Spot a fake Amazon brand name in seconds. Paste a name from a listing and see
whether it reads like a real company or a generated pseudo-brand, then check the
trademark before you trust it.

## Why

Amazon is full of invented, vaguely-plausible brand names (`KUAFYQ`, `Vensiono`,
`MIDONE`) registered to satisfy a listing requirement or squat on a keyword.
Shoppers sense that a name sounds fake but cannot say why, and there is no quick
way to sanity-check a single name. Listing scanners like Knockoff hide their
scoring inside a black-box filter. Fauxmark makes the signal legible for one
name, in the open, in under a second.

## What it does

Type or paste a brand name and watch it get scored live, letter by letter:

- **Vowel density.** Real words breathe; pseudo-brands often do not.
- **Consonant clustering.** Runs like `-nzq-` or `-vlk-` are a strong tell.
- **All-caps ratio.** SHOUTY strings skew synthetic and keyword-stuffed.
- **Pronounceability.** Can an English speaker say it aloud on the first try?

Each metric highlights directly on the letters as you type, and a verdict badge
flips from *checking* to a red, yellow, or green call, with the full scoring
shown rather than hidden behind one opaque flag. A one-click link opens the
USPTO trademark search pre-filled with the name so you can confirm it.

## Sample output

Scoring `KUAFYQ` (an invented Amazon-style name):

```
Verdict: LIKELY PSEUDO-BRAND  (overall signal 65 / 100)

  Vowel density           0   33% vowels (typical English words: 32-48%)
  Consonant clustering   20   longest consonant run: 3 letters
  All-caps ratio        100   100% of trailing letters are uppercase
  Pronounceability      100   2/2 consonant pairs are awkward to say
```

Scoring `Patagonia` (a real brand):

```
Verdict: LOW RISK  (overall signal 3 / 100)

  Vowel density          19   56% vowels (typical English words: 32-48%)
  Consonant clustering    0   no consecutive consonants
  All-caps ratio          0   standard capitalization
  Pronounceability        0   no consonant clusters to evaluate
```

## Features

- Live, per-letter heuristic scoring combined into a single 0-100 signal score.
- A red, yellow, or green verdict badge that cross-fades between states, with
  every metric's plain-English detail visible.
- One-click link to the USPTO trademark search for the typed name.
- Shareable permalink for any name (`#name=...`), decoded on load.
- A reference set of 20 known-real and 20 known-invented names that the test
  suite scores to guard the heuristic (`tests/fixtures/brandNames.ts`).

## Stack

- **TypeScript**, bundled with [Vite](https://vitejs.dev/).
- No framework: a small, dependency-light scoring module plus vanilla DOM.
- [Vitest](https://vitest.dev/) for unit tests, with v8 coverage on the core.
- Static output (`dist/`), deployable to any static host or subpath.

## Development

```bash
npm install
npm run dev            # local dev server
npm test               # run the scorer test suite
npm run test:coverage  # coverage, scoped to the core scoring modules
npm run lint           # eslint, the same check CI runs
npm run build          # production build into dist/
```

## Documentation

- [`docs/VISION.md`](docs/VISION.md) for the design rationale.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a map of the codebase.
- [`docs/DESIGN.md`](docs/DESIGN.md) for the visual direction.

## License

MIT, see [LICENSE](LICENSE).

---

More of Charlie's projects → [apps.charliekrug.com](https://apps.charliekrug.com)
