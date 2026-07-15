# Fauxmark — Vision

## The problem

Amazon search is full of brand names that were never chosen by a person —
they were generated to fill a trademark-registration requirement, dodge
duplicate-listing filters, or squat on a keyword: `KUAFYQ`, `Vensiono`,
`MIDONE`, `Ancndas`. Shoppers pick up on this ("that name sounds fake") but
can't articulate *why*, and there's no quick, standalone way to check a
single name's registration status or see what specifically makes it read as
synthetic. Tools like Knockoff scan whole listings and hide their scoring
logic behind a browser-extension filter — useful for triage, useless if you
just want to sanity-check the one name in front of you.

## Who it's for

Anyone about to buy from an unfamiliar Amazon storefront and doing a 10-second
gut check on the brand name before checkout — plus anyone curious about *how*
these generated names are distinguishable from real ones in the first place.
No account, no install, no browser extension: paste a name, get an answer.

## The core idea

A brand name is a string, and pseudo-brand generators leave fingerprints in
the string itself, independent of the product or listing around it:

- **Vowel density** far outside the ~32-48% band real English words sit in.
- **Consonant clustering** — runs of 4+ consecutive consonants are rare in
  real words, common in randomly-assembled ones.
- **All-caps ratio** — shouty, keyword-stuffed listings favor all-caps names.
- **Pronounceability** — consonant pairs that don't match any real English
  onset/coda/digraph are a strong "would stumble reading this aloud" signal.

Fauxmark runs all four heuristics client-side, blends them into a single
0-100 suspicion score, and shows the math — every metric visible, not a
single opaque "flagged" badge. It never claims to *know* a name is
unregistered; it always closes with a direct link to search the name on
USPTO TESS, because a heuristic score is a prompt to verify, not a verdict.

## Key design decisions

- **Zero-install, single-lookup.** No extension, no account, no listing
  scrape — paste a name, see a score, in under a second. This is the gap
  Knockoff-style tools don't fill.
- **Transparent scoring, not a black box.** Every metric and its raw value is
  shown alongside the overall verdict, so the tool teaches the signal instead
  of just asserting a conclusion.
- **Client-side only, static site.** No backend, no name storage, no
  server-side logging of what people search — the whole app is a scoring
  function plus a UI, shippable as static files to any subpath host.
  See [`docs/DESIGN.md`](DESIGN.md) for the visual direction.
- **A heuristic is a lead, not a ruling.** The USPTO TESS link is a
  first-class element of every result, not a footnote — Fauxmark's job is
  to make you curious enough to check, not to replace the check.

## What "v1 done" looks like

- Typing a name live-scores it letter by letter, and the verdict badge flips
  from *checking…* to a red/yellow/green call in under a second — the wow
  moment, reachable with zero clicks beyond typing.
- All four metrics (vowel density, consonant clustering, all-caps ratio,
  pronounceability) are implemented, tested against known real names and
  known invented ones, and shown transparently in the result.
- A one-click, pre-filled link to USPTO TESS accompanies every result.
- The page matches `docs/DESIGN.md`'s blueprint/technical direction, is
  fully responsive (390/768/1440), and passes the design self-review in QA.
- Deployable as a static site to `apps.charliekrug.com/brandcheck` with no
  server component.
