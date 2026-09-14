# 015 — Animate the ReasoningTrace disclosure

- **Commit:** 29d46e4
- **Severity:** LOW (additive — missed opportunity, not a regression)
- **Category:** Missed opportunities
- **Estimated scope:** 1 file, ~15 lines

## Problem

The AI reasoning trace disclosure snaps open instantly (`{open && <div>}` conditional render, no animation) while every sibling surface in the app eases. A sudden appearance where the user's eye is focused feels off — and this one must still pass the frequency/purpose test: it does (occasional use, purpose = explanation/state indication, preventing a jarring layout jump).

Rule: category 8 — a disclosure that appears instantly, where a sudden appearance feels off, earns an expand animation.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ReasoningTrace.jsx` | 1–10, 27–35 | Shell has color/border transition; `{open && <div>}` body mounts instantly |

### Current code

```jsx
// Frontend/src/components/ReasoningTrace.jsx:1-2
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
```

```jsx
// Frontend/src/components/ReasoningTrace.jsx:27-35
{open && (
  <div className="border-t px-4 pb-4 pt-3"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-gold-pale)' }}>
```

## Target

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
```

```jsx
<AnimatePresence initial={false}>
  {open && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div className="border-t px-4 pb-4 pt-3"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-gold-pale)' }}>
        ...unchanged inner content...
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

Height + opacity, 0.28s house ease — the disclosure grows from its header instead of teleporting the page content downward.

**Why these values:** height-auto expand is the in-repo standard for disclosures (see below); 0.28s matches the accordion below; house ease; `initial={false}` so first mount doesn't animate.

## Conventions to follow

- Exemplar: `KnowYourRights.jsx:170-178` (`AnimatePresence initial={false}` + `height: 0/'auto'` + opacity + 0.28s `[0.22, 1, 0.36, 1]`, `overflow hidden`) — copy its structure exactly, adapted to this markup.
- framer-motion is already a dependency — no new library.

## Steps

1. Add the `motion, AnimatePresence` import to `ReasoningTrace.jsx`.
2. Wrap the `{open && …}` body per Target (inner content byte-identical, just nested one level deeper).
3. Toggle repeatedly mid-flight: height retargets instead of jumping.

## Out of scope

- Do not change the header button, chevron glyphs, colors, or shell transitions (plan 002 already set those).
- Do not touch `ReasoningTrace` call sites in `ChatWindow.jsx`.
- Do not animate the markdown content itself.

## Verification

**Build**
- [ ] Lint passes.
- [ ] Toggle open/closed: body grows/collapses over 0.28s; surrounding messages glide, never jump.

**Behavior**
- [ ] Mid-animation re-toggle reverses smoothly from current height.
- [ ] Closed state leaves zero residual height (no phantom gap).

**Feel**
- [ ] Record toggle at 50%: expansion should read as the card unfolding from its header. If height animation janks on long traces, cap with `maxHeight` + inner scroll (human call, note it).
- [ ] With `prefers-reduced-motion: reduce` emulated, MotionConfig from plan 007 collapses this to fade — verify together if both land.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Height-auto animation is inherently approximate (framer measures per frame) — on very long reasoning traces it can feel heavy. The feel-check on a long trace is load-bearing, not decorative.
