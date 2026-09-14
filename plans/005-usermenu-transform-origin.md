# 005 — Anchor the UserMenu dropdown to its trigger

- **Commit:** 29d46e4
- **Severity:** MEDIUM
- **Category:** Physicality & origin (plus Easing & duration)
- **Estimated scope:** 1 file, ~5 lines

## Problem

The avatar-anchored UserMenu dropdown grows from its own center (`transform-origin` defaults to `center`) instead of from the avatar button, so cause and effect read as disconnected. It also uses the weak built-in `easeOut` curve and gives exit the identical duration as enter, even though the user has already decided to dismiss.

Rules (AUDIT.md §2–3): trigger-anchored popovers must originate from the button; built-in named curves are almost never strong enough — pick a real cubic-bezier; exits should be shorter and often simpler.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ResizableNavbar.jsx` | 222–226 | UserMenu dropdown enter/exit: `y: 6, scale: 0.97`, `easeOut`, 0.15s both ways, no origin |

### Current code

```jsx
// Frontend/src/components/ResizableNavbar.jsx:222-226
<motion.div
  initial={{ opacity: 0, y: 6, scale: 0.97 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 6, scale: 0.97 }}
  transition={{ duration: 0.15, ease: 'easeOut' }}
  style={{
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    minWidth: 210,
```

## Target

```jsx
<motion.div
  initial={{ opacity: 0, y: 6, scale: 0.97, transformOrigin: 'top right' }}
  animate={{ opacity: 1, y: 0, scale: 1, transformOrigin: 'top right' }}
  exit={{ opacity: 0, scale: 0.97, transformOrigin: 'top right' }}
  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
  exitTransition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
```

If framer-motion's per-prop `exitTransition` is unavailable in the installed version (12.x supports `transition` as a function of state — verify), fall back to a single `transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}` on enter and accept the symmetric 0.15s exit (0.15s is already at the fast end of budget, so symmetry here is tolerable). Exit drops the `y` drift (fades/scales in place — simpler, per the rule).

**Why these values:** `top right` because the menu is absolutely positioned `right: 0` under the avatar — it must grow from the trigger; 0.97 scale start reads as "almost there" (already correct, keep); house ease replaces weak `easeOut`; exit shorter/simpler because dismissal needs no travel.

## Conventions to follow

- Exemplar for trigger-anchored origin: `ui/select.jsx` and `ui/tooltip.jsx` use `origin-(--transform-origin)` (Base UI). This menu is hand-rolled (not Base UI), so set `transformOrigin: 'top right'` directly — same intent, adapted to the mechanism.
- House ease `[0.22, 1, 0.36, 1]` per plans 001–003.

## Steps

1. Add `transformOrigin: 'top right'` to initial/animate/exit at `ResizableNavbar.jsx:223-225`.
2. Replace `ease: 'easeOut'` with the house curve; shorten/simplify exit per Target (with the documented fallback).
3. Keep position, offsets (`top: calc(100% + 10px)`), minWidth, colors, shadows, and the outside-click close handler untouched.

## Out of scope

- Do not touch AuthModal (centered modal — `transform-origin: center` is exempt and correct there).
- Do not change menu contents, links, or sign-out behavior.
- Do not introduce easing tokens.

## Verification

**Build**
- [ ] Lint passes.
- [ ] No `easeOut`/`easeIn`/`easeInOut` string remains in this dropdown block.

**Behavior**
- [ ] Menu scales from the avatar (top-right), not its center; dismiss reverses into the same corner.
- [ ] Rapid toggle retargets mid-flight instead of restarting.

**Feel**
- [ ] Record open/close, scrub frame by frame: the first frames must show movement at the trigger corner — if the panel appears to bloom from center, the origin didn't apply.
- [ ] With `prefers-reduced-motion: reduce` emulated, note remaining motion for plan 007 — this plan does not gate it.

## Notes

Whether the y-drift removal on exit reads as calmer or as stiffer is a feel judgment; the plan follows the rule (exits simpler) and the feel-check is the tiebreaker.
