# 006 — Give the TypingIndicator an exit

- **Commit:** 29d46e4
- **Severity:** MEDIUM
- **Category:** Cohesion, hierarchy & spatial consistency (plus Interruptibility)
- **Estimated scope:** 1 file, ~5 lines

## Problem

The typing indicator slides/fades in from `y: 6` but has no `exit` prop and renders **outside** the `AnimatePresence` that wraps the messages, so every assistant reply starts with the indicator winking out of existence instead of yielding to the message. Enter/exit asymmetry on a surface seen with every single query.

Rules (AUDIT.md §4, §7): re-triggerable UI must retarget rather than restart — `@keyframes`-style snap is the Sonner bug pattern; exit direction matches entry.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ChatWindow.jsx` | 224–226 | `TypingIndicator`: initial/animate only, no exit |
| `Frontend/src/components/ChatWindow.jsx` | 289–297 | Messages inside `<AnimatePresence>`, `{loading && <TypingIndicator/>}` outside it |

### Current code

```jsx
// Frontend/src/components/ChatWindow.jsx:224-226
<motion.div
  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
  className="flex justify-start"
>
```

```jsx
// Frontend/src/components/ChatWindow.jsx:289-297
<AnimatePresence initial={false}>
  {messages.map((msg, i) => { ... })}
</AnimatePresence>
{loading && <TypingIndicator key="typing" />}
```

## Target

```jsx
// TypingIndicator block
<motion.div
  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 6 }}
  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
  className="flex justify-start"
>
```

```jsx
// message list block
<AnimatePresence initial={false}>
  {messages.map((msg, i) => { ... })}
  {loading && <TypingIndicator key="typing" />}
</AnimatePresence>
```

Exit mirrors entry (`y: 6`, fade) and runs shorter than the message-bubble springs so the indicator is gone before the reply lands. Moving it inside the existing `AnimatePresence` gives it a real exit instead of unmount-snapping.

**Why these values:** 0.2s matches the repo's small-element budget and the mobile-menu precedent below; house ease; symmetric y (exit direction matches entry per §7).

## Conventions to follow

- Exemplar: `ResizableNavbar.jsx` mobile menu (`initial opacity 0/height 0 → animate → exit opacity 0/height 0`, 0.22s house ease) — same enter-then-reverse-exit shape. Do not copy its height animation; the indicator keeps opacity/y only.

## Steps

1. Add the `exit` + `transition` props to `TypingIndicator` (`ChatWindow.jsx:224-226`).
2. Move `{loading && <TypingIndicator key="typing" />}` inside the `<AnimatePresence>` block (lines 289–297).
3. Keep the `key="typing"`, dot-loader CSS, and loading logic untouched.

## Out of scope

- Do not change the dot-loader keyframes, bubble springs, or `scrollIntoView` behavior.
- Do not touch `EmptyState` or message-bubble transitions.
- Do not gate reduced motion here (plan 007).

## Verification

**Build**
- [ ] Lint passes.
- [ ] Send a query: indicator eases in, eases out downward on reply arrival — no snap.

**Behavior**
- [ ] Rapid send/receive (two queries back-to-back): indicator exit retargets instead of stacking or flashing.
- [ ] Indicator never overlaps the incoming assistant bubble.

**Feel**
- [ ] Record at 50% speed: the handoff indicator→message should read as one continuous yield. If the exit feels laggy behind the reply, shorten exit to 0.15s (human call, note it in the PR).
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether a downward exit or an in-place fade reads better under the incoming bubble can't be judged from code; the plan picks direction-matched exit per the rule and leaves the final call to the feel-check.
