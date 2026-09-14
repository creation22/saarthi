# 013 — Unify chat springs; drop the double entrance in StepForm

- **Commit:** 29d46e4
- **Severity:** LOW
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 2 files, ~5 lines

## Problem

One chat thread uses three unrelated springs — user bubbles (420/32), assistant bubbles (380/30), empty-state icon (280/22 after plan 011) — so sibling messages don't read as one entity. Separately, the wizard StepForm plays a parent slide (`x: 30`, 0.4s) **plus** per-field staggers (`delay: i * 0.04`) — two entrances on one container, delaying readability field by field.

Rules (AUDIT.md §7): sub-animations of one component share duration/curve so the component reads as single; one entrance per container — slide the panel in with content already there.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ChatWindow.jsx` | 147, 167 | User spring 420/32 vs assistant spring 380/30 |
| `Frontend/src/pages/DocumentWizard.jsx` | 271–272 | StepForm wrapper slide `x: 30`, 0.4s house ease |
| `Frontend/src/pages/DocumentWizard.jsx` | 300–303 | Field cells: `delay: i * 0.04, duration: 0.4` stagger |

### Current code

```jsx
// Frontend/src/components/ChatWindow.jsx:147
transition={{ type: 'spring', stiffness: 420, damping: 32 }}
// Frontend/src/components/ChatWindow.jsx:167
transition={{ type: 'spring', stiffness: 380, damping: 30 }}
```

```jsx
// Frontend/src/pages/DocumentWizard.jsx:300-303
<motion.div key={field.key}
  className={isWide ? 'sm:col-span-2' : ''}
  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.04, duration: 0.4 }}
>
```

## Target

- Chat: both bubbles → `transition={{ type: 'spring', stiffness: 400, damping: 31 }}` (midpoint of the two current configs — same character, one entity). Keep the asymmetric `x` offsets (+16 user / −16 assistant) and `y` — direction carries speaker identity, springs carry physics; only physics unifies.
- StepForm: field cells → `transition={{ duration: 0.3 }}` with `initial={{ opacity: 0 }}` (fade only, no `y`, no per-index delay). The wrapper slide at 271 stays as the single entrance; fields are already there when it lands, so the user can start reading immediately.

**Why these values:** 400/31 is the arithmetic midpoint (no taste invented); fade-only fields remove the second entrance while keeping state indication; 0.3s keeps cells settling just after the 0.4s… no — cells at 0.3s settle *during* the wrapper slide, which is exactly "content already there."

## Conventions to follow

- Zero-bounce product posture: pure stiffness/damping springs, no `bounce` param (matches existing style).
- Plan 009 owns the wrapper's direction; this plan owns the fields. Do not touch wrapper props here.

## Steps

1. `ChatWindow.jsx:147` and `:167`: set both transitions to 400/31.
2. `DocumentWizard.jsx:300-303`: initial → `{ opacity: 0 }`, transition → `{ duration: 0.3 }` (drop `y` and `delay`).
3. Keep StepDownload rows (opacity-only already) and everything else untouched.

## Out of scope

- Do not touch EmptyState springs, TypingIndicator (plan 006), bubble offsets, or wrapper slides.
- Do not change Dashboard's 0.06 grid stagger (60ms — inside the 30–80ms budget, explicitly passing).

## Verification

**Build**
- [ ] Lint passes.
- [ ] No `delay: i *` remains in StepForm; both bubble transitions read 400/31.

**Behavior**
- [ ] Alternating user/assistant messages land with identical physics; speaker side still distinct.
- [ ] StepForm fields appear with the panel, not cascading after it.

**Feel**
- [ ] Scrub a two-message exchange: if unified springs make speakers indistinguishable, the offsets are doing their job — confirm, don't re-split.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether 400/31 vs either original is perceptible is doubtful — that's the point (unification, not redesign). The feel-check guards against over-correction.
