# 001 — Stop animating navbar layout properties on scroll

- **Commit:** ff71bdf
- **Severity:** HIGH
- **Category:** Performance
- **Estimated scope:** 1 file, ~30 lines

## Problem

The desktop and mobile navbars in `ResizableNavbar.jsx` animate `width`, `paddingLeft/Right/Top/Bottom`, `marginTop`, and `borderRadius` through a framer-motion spring on every scroll-threshold crossing. Layout properties trigger Layout + Paint + Composite for the whole subtree instead of Composite-only, so the pill morph drops frames exactly when the user is scrolling. Animating `background` and `boxShadow` in the same spring adds Paint work on top.

Rule: animate `transform` / `opacity` only; `scale` instead of `padding`, `translate` instead of `margin` (AUDIT.md §5).

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ResizableNavbar.jsx` | 28–43 | Desktop pill: spring over width, borderRadius, margins, paddings, background, boxShadow |
| `Frontend/src/components/ResizableNavbar.jsx` | 93–105 | Mobile bar: same spring over width, borderRadius, margins, paddings |

### Current code

```jsx
// Frontend/src/components/ResizableNavbar.jsx:28-43
<motion.div
  animate={{
    width:         scrolled ? '62%'   : '100%',
    borderRadius:  scrolled ? '999px' : '0px',
    marginTop:     scrolled ? '12px'  : '0px',
    paddingLeft:   scrolled ? '22px'  : '24px',
    paddingRight:  scrolled ? '22px'  : '24px',
    paddingTop:    scrolled ? '10px'  : '16px',
    paddingBottom: scrolled ? '10px'  : '16px',
    backdropFilter:'blur(20px)',
    background:    navBg,
    boxShadow:     navShadow,
  }}
  transition={{ type: 'spring', stiffness: 220, damping: 40 }}
```

```jsx
// Frontend/src/components/ResizableNavbar.jsx:93-104
<motion.div
  animate={{
    width:         scrolled ? '92%'  : '100%',
    borderRadius:  scrolled ? '16px' : '0px',
    marginTop:     scrolled ? '10px' : '0px',
    ...
  }}
  transition={{ type: 'spring', stiffness: 220, damping: 40 }}
```

## Target

Snap all layout props instantly via plain `style`; reserve framer-motion for a Composite-only entrance (opacity + translateY). Background/boxShadow swap instantly with the `scrolled` boolean (one toggle per crossing, no per-frame interpolation).

```jsx
<motion.div
  initial={{ opacity: 0, y: -8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
  className="hidden lg:flex items-center justify-between"
  style={{
    width: scrolled ? '62%' : '100%',
    borderRadius: scrolled ? 999 : 0,
    marginTop: scrolled ? 12 : 0,
    padding: scrolled ? '10px 22px' : '16px 24px',
    minWidth: scrolled ? 740 : 'unset',
    backdropFilter: 'blur(20px)',
    background: navBg,
    boxShadow: navShadow,
  }}
>
```

Apply the identical split to the mobile bar (lines 93–105): layout values into `style`, motion reserved for `opacity`/`y` only.

**Why these values:** 0.2s matches the repo's small-popover budget (AUDIT.md §2: tooltip/small popover 125–200ms); `[0.22, 1, 0.36, 1]` is the repo's existing ease-out-expo house curve (used in `LandingHero.jsx`, `KnowYourRights.jsx:176`, `AuthModal`); snapping layout removes the Layout/Paint pass while keeping the visual scrolled/unscrolled states pixel-identical.

## Conventions to follow

- House ease-out curve is `[0.22, 1, 0.36, 1]` — reuse it, do not introduce `easeOut` strings or new cubic-beziers.
- `UserMenu` in the same file (`ResizableNavbar.jsx:221-225`) already does this correctly — opacity/y/scale-only motion with layout in `style`. Match its structure.
- The `scrolled` boolean from `useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 80))` stays as-is; it already debounces to one toggle per threshold crossing.

## Steps

1. In `ResizableNavbar.jsx` desktop block (28–43): move `width`, `borderRadius`, `marginTop`, paddings, `background`, `boxShadow`, `backdropFilter` out of `animate` into `style` keyed on `scrolled`; replace `animate` with `{{ opacity: 1, y: 0 }}` plus the `initial` above.
2. Same split for the mobile block (93–105) with its values (`92%`/`100%`, radius `16`/`0`, padding `13px 16px`).
3. Keep `navBg`/`navShadow` ternaries and the `minWidth` rule unchanged — they now apply instantly instead of interpolating.
4. Verify no other prop in either `animate` object is a layout/paint property (`width`, `padding*`, `margin*`, `borderRadius`, `background`, `boxShadow` must all be gone from `animate`).

## Out of scope

- Do not change the scroll threshold (`v > 80`), the pill dimensions, colors, or shadows.
- Do not touch `NavLinks` layoutId pill, `UserMenu`, `AuthModal`, or mobile menu height animation.
- Do not introduce a new animation library or a global easing token system.
- Do not change any other component's timing, even if it looks similar.

## Verification

**Build**
- [ ] Type-check and lint pass (`npm run lint` in `Frontend/`).
- [ ] Landing page renders; navbar toggles pill shape crossing 80px scroll.

**Behavior**
- [ ] Scrolling past 80px snaps width/radius/padding instantly while opacity/y eases over 0.2s — no stretched intermediate widths.
- [ ] Scroll rapidly up/down across the threshold: motion retargets cleanly, no stuck half-pill state.
- [ ] With `prefers-reduced-motion: reduce` emulated, opacity still transitions and nothing moves vertically (y snaps).

**Feel**
- [ ] Record a scroll-threshold crossing and scrub frame by frame: no layout jank mid-morph; if it still stutters, profile — the fix is fewer animated props, not a longer duration.
- [ ] Test on a real mid-range Android device over mobile data, not just desktop Chrome.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether the instant snap of borderRadius reads as abrupt versus the old springy morph is a feel judgment from code alone — the plan chooses correctness (no layout animation) and a short opacity/y ease to mask the cut. If a human finds the snap too hard, the follow-up is a transform-scale wrapper, not re-animating width.
