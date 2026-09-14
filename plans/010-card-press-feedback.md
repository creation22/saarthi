# 010 — Add press feedback to clickable cards

- **Commit:** 29d46e4
- **Severity:** MEDIUM
- **Category:** Physicality & origin
- **Estimated scope:** 4 files, ~8 lines

## Problem

Four pressable surfaces have hover states but nothing on press: Dashboard matter cards lift on hover, lawyer cards and matter stat tiles lift on hover, and the Know-Your-Rights accordion header shifts background on hover — yet tapping any of them gives zero acknowledgment. Hover with no press response feels dead, as if the tap wasn't received.

Rule (AUDIT.md §3): hover with nothing on `:active` → `transform: scale(0.97)` on press, `transition: transform 150ms`.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/pages/Dashboard.jsx` | 122–123 | `MatterCard`: `whileHover y:-3` + spring, `onClick` navigate, no `whileTap` |
| `Frontend/src/pages/LawyerDirectory.jsx` | 17 | `LawyerCard`: `layout` + `whileHover y:-2` + spring 400, no `whileTap` |
| `Frontend/src/pages/MatterDetail.jsx` | 176 | Stat tiles: `whileHover y:-2`, `onClick`, no `whileTap` |
| `Frontend/src/pages/KnowYourRights.jsx` | 129–133 | Accordion header: `whileHover backgroundColor`, no `whileTap` |

### Current code

```jsx
// Frontend/src/pages/Dashboard.jsx:122-123
<motion.div whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(0,0,0,0.09)' }}
  transition={{ type: 'spring', stiffness: 400 }}
```

```jsx
// Frontend/src/pages/LawyerDirectory.jsx:17
<motion.div layout whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400 }}
```

```jsx
// Frontend/src/pages/MatterDetail.jsx:176
<motion.div key={label} whileHover={{ y: -2 }} onClick={link}
```

```jsx
// Frontend/src/pages/KnowYourRights.jsx:129-133
<motion.button
  onClick={() => setOpen(o => !o)}
  ...
  whileHover={{ backgroundColor: 'var(--color-ivory-deep)' }}
  transition={{ duration: 0.15 }}
>
```

## Target

Add to each of the four (keeping every existing hover prop untouched):

```jsx
whileTap={{ scale: 0.97 }}
transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
```

For the three spring-driven cards, the 0.15s house-ease transition governs the tap while the spring keeps governing the hover lift (framer merges per-interaction transitions; if the installed version overrides instead, put the tap transition inline on `whileTap` as `whileTap={{ scale: 0.97, transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } }}` — verify tap feels like a 150ms give, not a spring wobble). LawyerDirectory keeps its `layout` prop (it morphs on expand — correct use, untouched).

**Why these values:** 0.97 = felt-not-seen press (plan 003 standard); 150ms = button-press budget; house ease. Cards keep their existing lifts — this plan only adds the missing press half.

## Conventions to follow

- Exemplar: plan 003's normalized pressables (`ChatWindow.jsx` citations, `QueryInput.jsx` mic) — same 1.02/0.97 vocabulary, same 0.15s house ease.
- Do not "fix" the hover lifts themselves here (Bento lift flicker is plan 012; these lifts are ≤3px on the card itself and read as elevation, not displacement).

## Steps

1. Dashboard `MatterCard`, LawyerDirectory `LawyerCard`, MatterDetail stat tiles: add `whileTap` + tap transition.
2. KnowYourRights accordion header: add `whileTap={{ scale: 0.99 }}` (a full-width row should barely give — 0.99, not 0.97 — because scaling a full-bleed row edge-to-edge reads as breakage; document this exception in the PR).
3. Keep all `onClick`/`layout`/hover props byte-identical otherwise.

## Out of scope

- Do not change hover lifts, colors, navigation, or expand behavior.
- Do not touch BentoGridItem (plan 012) or marketing cards.
- Do not change any durations outside the added tap transition.

## Verification

**Build**
- [ ] Lint passes.
- [ ] Grep `whileHover` without a nearby `whileTap` on these four sites — zero.

**Behavior**
- [ ] Pressing each surface visibly gives then releases; hover lift still works with a mouse.
- [ ] Rapid taps retarget instead of sticking scaled-down.

**Feel**
- [ ] Test on a real touch device: the press must register as acknowledgment, not as the card collapsing. If 0.97 on MatterCard reads as collapse, drop to 0.98 and note it.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

The 0.99 exception for the full-width accordion header is a judgment call (felt-not-seen scales with element size); the feel-check on a real row confirms it. Whether spring+timed-transition merging behaves as assumed depends on framer internals — the verification step covers both branches.
