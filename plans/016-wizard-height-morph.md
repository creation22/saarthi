# 016 — Morph wizard height between steps

- **Commit:** 29d46e4
- **Severity:** LOW (additive — missed opportunity, not a regression)
- **Category:** Missed opportunities
- **Estimated scope:** 1 file, ~10 lines

## Problem

The three wizard steps have very different heights (template grid vs long form vs preview card). `AnimatePresence mode="wait"` swaps them with opacity/x only, so the page height jumps the instant the old step unmounts — footer and background snap upward/downward with no continuity.

Rule: category 8 — height that jumps between steps of a multi-step flow earns a morph so the two states read as one object.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/pages/DocumentWizard.jsx` | 636–668 | `<main>` + `AnimatePresence mode="wait"` swapping three fixed-height steps |

### Current code

```jsx
// Frontend/src/pages/DocumentWizard.jsx:636-644
<main className="mx-auto max-w-5xl px-5 py-12">
  <ProgressBar step={step} docType={docType} />

  <AnimatePresence mode="wait">
    {step === 0 && (
      <motion.div key="choose" exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}>
```

## Target

Animate the container height around the step swap. Minimal approach honoring `mode="wait"` (exit completes before enter, so height would still jump twice — instead, animate height explicitly):

```jsx
<motion.main
  className="mx-auto max-w-5xl px-5 py-12"
  animate={{ height: 'auto' }}
  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
>
```

**Do not implement blindly** — framer cannot tween to `'auto'` from an exiting sibling without measurement, and `mode="wait"` unmounts before measuring. The executor must pick ONE of these two verified-working options and delete the other from consideration in the PR notes:

- **Option A (preferred, simple):** keep `mode="wait"`, give each step wrapper `exit` that includes height collapse to the *incoming* height is impossible — instead, set the `<main>` to `style={{ overflow: 'hidden' }}` and add `layout` to the three step wrappers so framer's layout animation smooths the container resize automatically. One prop per wrapper, container follows.
- **Option B (explicit):** replace `mode="wait"` with `mode="popLayout"` + `layout` on wrappers; exiting step pops out of flow while the entering step's layout animates the container height.

In both options the x/opacity choreography from plan 009 stays exactly as specified there — height morph layers on top, same 0.2–0.25s house-ease timing so open and resize feel like one thing (§7: opening and height changes feel like one thing).

**Why these values:** 0.2–0.25s matches the step transition so resize never lags content; house ease; `layout` is framer's purpose-built resize morph (LawyerDirectory:17 already uses it in-repo for card expand).

## Conventions to follow

- Exemplar for `layout`-driven resize: `LawyerDirectory.jsx:17` (`motion.div layout` morphing on expand).
- Coordinate with plan 009 (directional exits): that plan owns x/opacity, this plan owns height. If 009 hasn't landed, implement height against the current constant exits — do not duplicate 009's direction work here.

## Steps

1. Try Option A first (add `layout` to the three step wrappers + `overflow hidden` discipline on `<main>`).
2. Walk 0→1→2→1→0 watching the footer: it must glide, never jump. If Option A double-animates against `mode="wait"` exits, switch to Option B.
3. Keep ProgressBar outside the morph (it doesn't change height — confirm it doesn't jitter).

## Out of scope

- Do not change step contents, direction (plan 009), field stagger (plan 013), or validation.
- Do not exceed 0.25s for the height morph.
- Do not restructure the wizard into a single scrolling page.

## Verification

**Build**
- [ ] Lint passes.
- [ ] All three transitions (forward, back, back-to-start) glide the footer.

**Behavior**
- [ ] Tallest step (form) → shortest: container shrinks smoothly, no content clipping mid-morph (`overflow` discipline must not crop fields).
- [ ] Rapid step mashing doesn't strand the container at a wrong height.

**Feel**
- [ ] Record the 1→2 transition (biggest height delta) and scrub: resize and content slide must feel like one object. If they read as two separate animations, shorten height to 0.2s to bind them.
- [ ] Test on a real mid-range device — layout animation is the most frame-sensitive kind.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

This is the highest-uncertainty plan in the batch: `mode="wait"` + height morph interact subtly, and whether the result reads as "one object" can't be judged from code at all. The plan deliberately offers two options and makes the feel-check (especially the 1→2 delta on device) the acceptance test. If neither option glides cleanly, the honest outcome is to close this plan and keep the jump — say so in the PR.
