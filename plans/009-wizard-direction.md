# 009 — Make wizard Back/Next directional

- **Commit:** 29d46e4
- **Severity:** MEDIUM
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 1 file, ~15 lines

## Problem

All three wizard steps exit identically (`opacity: 0, x: -20`) whether the user goes forward or back, and none of them has an enter animation at all (they pop in instantly). Going Back animates left — against the action — contradicting the user's mental model of where the screens live.

Rule (AUDIT.md §7): forward = left, back = right. Animating against the action contradicts it.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/pages/DocumentWizard.jsx` | 641, 647, 659 | Step wrappers: `exit={{ opacity: 0, x: -20 }}`, no `initial` |
| `Frontend/src/pages/DocumentWizard.jsx` | 271–272, 385–386 | StepChoose/StepDownload inners: `initial={{ opacity: 0, x: 30 }}` (always from the right) |

### Current code

```jsx
// Frontend/src/pages/DocumentWizard.jsx:640-644
<AnimatePresence mode="wait">
  {step === 0 && (
    <motion.div key="choose" exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}>
```

## Target

Track direction from step deltas and mirror the animation. Concretely: keep a `const [dir, setDir] = useState(1)` beside `step`; wrap every `setStep` call site (`handleChoose`, `onBack`, `onNext` in StepForm/StepDownload props) so forward sets `dir=1`, back sets `dir=-1`. Then:

```jsx
<motion.div key="choose"
  initial={{ opacity: 0, x: 30 * dir }} animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 * dir }}
  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
```

Same for `key="form"` and `key="download"`. Forward: enters from right (+30), exits left (−20). Back: enters from left (−30), exits right (+20). The inner `initial x: 30` at lines 271/385 must also multiply by `dir` (pass `dir` as a prop into StepChoose/StepForm/StepDownload, or drop the inner slide and keep only the wrapper's — preferred: **drop the inner `x` slide**, keeping opacity, so there is one entrance per container per §7).

**Why these values:** 30px enter / 20px exit preserve today's magnitudes, only the sign becomes directional; 0.2s + house ease matches the existing step transition; one entrance per container (wrapper owns motion, inners own stagger-free fade).

## Conventions to follow

- House ease `[0.22, 1, 0.36, 1]`; 0.2s step budget already in the file.
- `AnimatePresence mode="wait"` stays — direction is carried by `dir`, not by custom variants (keep it simple; no `custom` prop plumbing).

## Steps

1. Add `dir` state; set it at every navigation call site (forward `1`, back `-1`).
2. Give all three step wrappers directional initial/animate/exit per Target.
3. Remove the inner `x: 30` slides at 271/385 (keep their opacity fades); keep the StepForm field stagger removal for plan 013 — do not touch it here.
4. Walk forward 0→1→2 then back 2→1→0: motion must mirror.

## Out of scope

- Do not change step contents, validation, ProgressBar, or height behavior (plan 016).
- Do not touch field-level stagger (plan 013).
- Do not exceed 0.2s or introduce springs.

## Verification

**Build**
- [ ] Lint passes.
- [ ] No `exit={{ opacity: 0, x: -20 }}` constant remains on all three wrappers.

**Behavior**
- [ ] Next: screen exits left, new screen enters from right. Back: exact mirror.
- [ ] Rapid Back/Next mashing: `mode="wait"` serializes; no overlapping screens.

**Feel**
- [ ] Record a full forward-then-back pass and scrub: direction must read instantly — if Back still feels like "forward", the sign is wrong, not the duration.
- [ ] With `prefers-reduced-motion: reduce` emulated, note remaining x-travel for plan 007's MotionConfig (which will collapse it to fade automatically).
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether 30px of travel is enough to read direction on wide screens is a feel call; the plan preserves current magnitudes deliberately — tune only after the feel-check says the direction is ambiguous.
