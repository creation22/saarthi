# 011 — Stop the empty-state icon appearing from nothing

- **Commit:** 29d46e4
- **Severity:** MEDIUM
- **Category:** Physicality & origin
- **Estimated scope:** 1 file, ~3 lines

## Problem

The chat empty-state scales icon starts at `scale: 0.7` — close enough to nothing that the scales emblem pops into being rather than settling in. Nothing appears from nothing; even a deflated balloon has a visible shape.

Rule (AUDIT.md §3): entrance from near-zero → `scale(0.9–0.95)` + `opacity: 0`.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ChatWindow.jsx` | 241–244 | Empty-state icon: `initial opacity 0/scale 0.7`, spring 280/22 |

### Current code

```jsx
// Frontend/src/components/ChatWindow.jsx:241-244
<motion.div
  initial={{ opacity: 0, scale: 0.7 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
```

## Target

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
>
```

Start nearly-there (0.92) so the entrance reads as "it was always almost there"; slightly raise damping (22→26) so the lighter travel doesn't overshoot into a wobble on a serious legal surface (bounce default zero).

**Why these values:** 0.92 sits inside the 0.9–0.95 band; spring params otherwise preserved so the motion keeps its character, just with less distance to cover; extra damping compensates the shorter travel.

## Conventions to follow

- The sibling EmptyState text/link entrances (delays 0.25/0.4) stay untouched — one plan, one site.
- Zero-bounce posture for product surfaces per the repo personality.

## Steps

1. Change `scale: 0.7` → `scale: 0.92`, `damping: 22` → `damping: 26` at `ChatWindow.jsx:241-244`.
2. Nothing else in `EmptyState` changes.

## Out of scope

- Do not touch EmptyState text/link stagger, bubbles, or TypingIndicator (plan 006).
- Do not change the icon itself.

## Verification

**Build**
- [ ] Lint passes.
- [ ] Fresh session (empty chat): icon eases from near-full, no pop.

**Behavior**
- [ ] No overshoot wobble after the change; icon rests exactly at scale 1.

**Feel**
- [ ] Record fresh-load and scrub: first visible frame must already show the icon's shape. If it still reads as appearing, raise to 0.95.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether 0.92 vs 0.95 is distinguishable on a 52px icon is marginal — the plan picks 0.92 to preserve a hint of arrival; the feel-check decides.
