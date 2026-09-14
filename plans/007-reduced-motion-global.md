# 007 — Ship a reduced-motion variant for all motion

- **Commit:** 29d46e4
- **Severity:** MEDIUM
- **Category:** Accessibility
- **Estimated scope:** 2 files, ~40 lines

## Problem

A repo-wide grep for `prefers-reduced-motion|useReducedMotion|MotionConfig|reducedMotion` in `Frontend/src` returns **zero matches**. Every animation — 0.72s hero entrances, infinite shimmer/bounce-dot/pulse-ring/aurora loops, framer springs on every message — plays at full strength for users with vestibular disorders. `html { scroll-behavior: smooth }` is also unconditional.

Rule (AUDIT.md §6): ship every animation as two variants. Under `reduce`, animate opacity/color/background only — nothing moves. Reduced motion means gentler, not zero.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/index.css` | 33–60, 63–75 | `@keyframes` fadeUp/fadeIn/slideRight/scaleIn + `.anim-*` utilities with translate/scale movement |
| `Frontend/src/index.css` | 80 | `html { scroll-behavior: smooth; }` unconditional |
| `Frontend/src/index.css` | 135–149, 177–195, 198–213 | Infinite `shimmer`, `bounce-dot`, `pulse-ring`, `aurora-drift*` loops with no reduced path |
| `Frontend/src/App.jsx` | 19–51 | No `MotionConfig`; framer-motion animates transforms app-wide |

### Current code

```css
/* Frontend/src/index.css:80 */
html { scroll-behavior: smooth; font-size: 16px; }
```

```jsx
// Frontend/src/App.jsx:19-24
<BrowserRouter>
  <ThemeProvider>
  <AuthProvider>
    <Toaster position="top-right" />
```

## Target

```css
/* append to Frontend/src/index.css */
html { scroll-behavior: auto; }
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
@media (prefers-reduced-motion: reduce) {
  .anim-fade-up, .anim-slide-r, .anim-scale-in {
    animation-name: fadeIn; /* opacity-only variant of each entrance */
  }
  .text-shimmer, .dot-loader span, .pulse-ring::before {
    animation: none;
  }
  .dot-loader span:nth-child(2), .dot-loader span:nth-child(3) { animation-delay: 0s; }
}
```

```jsx
// Frontend/src/App.jsx — wrap the tree (import { MotionConfig } from 'framer-motion')
<MotionConfig reducedMotion="user">
  <BrowserRouter>
    ...
  </BrowserRouter>
</MotionConfig>
```

`fadeIn` keyframes already exist (opacity-only) so entrances keep state indication without movement. `MotionConfig reducedMotion="user"` (default is `never` — must be set explicitly) makes all framer transform motion collapse to opacity automatically. Infinite loader loops go static rather than mid-cycle: typing dots render as three solid dots, pulse ring renders once without animation.

**Why these values:** opacity/color-only under `reduce` preserves meaning (a toast still fades in) without vestibular triggers; `scroll-behavior` gated per the rule; `MotionConfig` is the framer-blessed global switch — one line covers ~20 `whileHover`/spring sites.

## Conventions to follow

- Reuse the existing `fadeIn` keyframes as the reduced-motion entrance — no new keyframes.
- `Aurora` keyframes are marketing-background loops; leaving them running under `reduce` is also defensible, but the plan pauses them because they translate continuously. If a human judges the landing dead without them, scope back to pausing only `shimmer`/`bounce-dot`/`pulse-ring`.

## Steps

1. `index.css`: gate `scroll-behavior: smooth` behind `no-preference` (default `auto`).
2. `index.css`: append the `reduce` block above (entrances → `fadeIn`; shimmer/dot/pulse-ring → `none`).
3. `App.jsx`: add `MotionConfig reducedMotion="user"` around the router (keep provider nesting order).
4. Verify: emulate `prefers-reduced-motion: reduce` in DevTools — landing entrances fade only, dots static, chat bubbles fade without slide, smooth scroll off.

## Out of scope

- Do not redesign any animation's `no-preference` appearance.
- Do not add per-component `useReducedMotion` branches (global switch covers it; per-component branching is follow-up work if a specific surface needs it).
- Do not touch hitbox sizes (plan 008) or hover gating on touch (noted below).

## Verification

**Build**
- [ ] Lint passes.
- [ ] Grep `prefers-reduced-motion` in `Frontend/src` returns matches; grep `reducedMotion` returns the `MotionConfig`.

**Behavior**
- [ ] Under emulated `reduce`: nothing translates/scales; opacity/color transitions still run; no infinite loop animates.
- [ ] Under `no-preference`: pixel-identical to today.

**Feel**
- [ ] With `reduce` on, send a chat message: the reply must still be perceptible as new (fade), not popping.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether the aurora background should keep drifting under `reduce` is borderline — ambient marketing motion arguably passes "gentler". The plan pauses it; a human feel-check on the landing page decides. Touch-device hover gating (`@media (hover:hover)`) is intentionally deferred: framer `whileHover` can't be gated from CSS, so it needs per-component work — say so in the PR rather than half-doing it.
