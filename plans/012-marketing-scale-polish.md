# 012 — Marketing polish: scale-from-nothing + card lift

- **Commit:** 29d46e4
- **Severity:** LOW
- **Category:** Physicality & origin
- **Estimated scope:** 4 files, ~10 lines

## Problem

Six decorative entrances on marketing surfaces start at `scale: 0` (invisible → pop), and the Bento card lifts from under its own hover zone (`y: -5` on the hover target itself → lift ends hover → drop re-triggers hover → flicker at the card edge). Marketing gets freedom on duration, not on physics.

Rule (AUDIT.md §3): entrance from `scale(0)` → `scale(0.9–0.95)` + `opacity: 0`; translateY hover belongs on a child, never the hover target itself.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/BentoGrid.jsx` | 241, 342 | Graph nodes: `initial scale 0/opacity 0` |
| `Frontend/src/components/BentoGrid.jsx` | 629 | Model tiles: `initial opacity 0/scale 0.8` |
| `Frontend/src/components/landing/LandingHowItWorks.jsx` | 102–105 | Step dots: `initial scale 0/opacity 0` |
| `Frontend/src/components/landing/LandingFeatures.jsx` | 138–140 | Status dots: `scale: 0` in the `inView false` branch |
| `Frontend/src/components/HomeBgIcons.jsx` | 167–170 | Center dot: `initial scale 0/opacity 0` |
| `Frontend/src/components/landing/LandingBgIcons.jsx` | 195–198 | Center dot: `initial scale 0/opacity 0` |
| `Frontend/src/components/BentoGrid.jsx` | 21–22 | `BentoGridItem`: `whileHover y:-5` on the hovered card itself |

### Current code (representative)

```jsx
// Frontend/src/components/BentoGrid.jsx:241
initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
```

```jsx
// Frontend/src/components/BentoGrid.jsx:629
initial={{ opacity: 0, scale: 0.8 }}
```

```jsx
// Frontend/src/components/BentoGrid.jsx:17-22
<motion.div variants={variants} ... className="... cursor-default overflow-hidden ..."
  style={{ borderColor: 'var(--color-border)', background: 'var(--color-ivory)' }}
  whileHover={{ y: -5, boxShadow: '...', borderColor: 'rgba(197,148,58,0.38)' }}
```

## Target

- Every `initial={{ scale: 0, opacity: 0 }}` (and the `scale: 0` false-branch at LandingFeatures:139, and `scale: 0.8` at BentoGrid:629) → `initial={{ scale: 0.9, opacity: 0 }}`. Keep all delays, durations, springs, and stagger offsets byte-identical — only the start scale changes. SVG `<motion.circle>` nodes: SVG transform-box quirks mean scale may originate oddly; add `style={{ transformBox: 'fill-box', transformOrigin: 'center' }}` alongside where a circle's growth point looks off (verify visually per site; skip where it already grows correctly).
- Bento lift: move the `y: -5` from the card to its inner text block. Concretely, remove `y: -5` from the `whileHover` at line 21 (keep boxShadow/borderColor there) and add `whileHover={{ x: 0, y: -3 }}`… no — simplest correct fix honoring the existing design: keep the card's shadow/border hover, and change the existing inner `group-hover/bento:translate-x-2` slide (line 30) to also lift: `group-hover/bento:translate-x-2 group-hover/bento:-translate-y-1`. The card shell stays put (hover zone intact), the content drifts — no flicker loop. Card is `cursor-default` (non-pressable), so no `whileTap` is added.

**Why these values:** 0.9 = bottom of the near-full band (decorative dots can keep a hint of pop); travel removal on the shell kills the flicker at its root cause rather than damping it.

## Conventions to follow

- Marketing surfaces: preserve all timings/delays/staggers — this plan changes start states only.
- `cursor-default` non-pressable cards get no press state (consistent with plan 010's scope).

## Steps

1. Apply the 0.9 start-scale swap at all six entrance sites (delays/durations/springs untouched).
2. Bento lift: edit lines 21 and 30 per Target; hover the card edge slowly and confirm no flicker.
3. Visually check each SVG dot grows from its own center (add `transformBox`/`transformOrigin` only where wrong).

## Out of scope

- Do not change any duration, delay, stagger, spring, color, or shadow.
- Do not touch the waveform/scan infinite loops, product bubbles, or toasts.
- Do not add press states to non-pressable cards.

## Verification

**Build**
- [ ] Lint passes.
- [ ] Grep `scale: 0[^.]` (scale zero not followed by decimal) in `Frontend/src` — zero entrance matches.

**Behavior**
- [ ] Each dot/node is faintly visible in its first frame (scrubbed), never popping from invisible.
- [ ] Slow hover across the Bento card edge: zero flicker; shadow/border still respond.

**Feel**
- [ ] Marketing pages only: confirm the entrances still feel alive (0.9 start must not read as "already there, why animate" — if dead, 0.85 is the floor; note it).
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

SVG circle `transform-box` behavior varies by browser — the plan says verify-per-site rather than asserting, because fill-box support for SMIL-era SVG edge cases can't be judged from code. Desktop Chrome + one WebKit check minimum.
