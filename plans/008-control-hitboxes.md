# 008 — Give sub-44px controls a 44px hitbox

- **Commit:** 29d46e4
- **Severity:** MEDIUM
- **Category:** Accessibility
- **Estimated scope:** 2 files, ~15 lines

## Problem

The two highest-frequency controls in the app are smaller than the 44×44px minimum: feedback thumbs are 28×28 (`h-7 w-7`) and the voice mic is 36×36 (`h-9 w-9`). Small targets punish touch and motor-impaired users on surfaces hit dozens of times a day.

Rule (AUDIT.md §6): add a `::before` hitbox of at least 44px without changing layout.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ChatWindow.jsx` | 127–134 | Feedback thumb `motion.button`, `h-7 w-7` (28px) |
| `Frontend/src/components/QueryInput.jsx` | 69–82 | Mic `motion.button`, `h-9 w-9` (36px) |

### Current code

```jsx
// Frontend/src/components/ChatWindow.jsx:129 (className)
className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
```

```jsx
// Frontend/src/components/QueryInput.jsx:76 (className)
className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-40"
```

## Target

Keep both classNames visually identical; extend the invisible hit area with a positioned pseudo-element (Tailwind arbitrary variant, no layout change):

```jsx
// thumbs — add to className:
"before:absolute before:-inset-3 before:content-['']"
// mic — add to className (already relative):
"before:absolute before:-inset-2 before:content-['']"
```

28px + 2×12px inset = 52px target; 36px + 2×8px = 52px target. Both ≥44px, both need `absolute` positioning context (thumbs button needs `relative` added; mic already has `relative`). `::before` must not intercept visuals: it inherits the button's rounded shape for the pointer only and renders nothing (`content-['']`, no background).

**Why these values:** 44px is the WCAG minimum; the insets overshoot slightly so the targets match each other (52px) and stay forgiving on touch; layout is untouched so the message rhythm doesn't shift.

## Conventions to follow

- Visual styles stay exactly as plans 002/003 left them — this plan only appends the `before:` hitbox utilities (and `relative` on the thumbs).
- If Tailwind v4 arbitrary `before:-inset-3` doesn't compose in this codebase, fall back to a 6-line CSS rule in `index.css` (`.hitbox-44 { position: relative; } .hitbox-44::before { content:''; position:absolute; inset:-12px; }`) and add the class instead. Executor: try utilities first, fall back without asking.

## Steps

1. `ChatWindow.jsx` thumbs button: add `relative` + `before:absolute before:-inset-3 before:content-['']` (or the CSS fallback class).
2. `QueryInput.jsx` mic button: add `before:absolute before:-inset-2 before:content-['']` (already `relative`).
3. Verify no visual change at rest/hover/press; verify tap area with DevTools device toolbar (touch overlay).

## Out of scope

- Do not resize the visible buttons, change gaps, or move siblings.
- Do not touch the send button (h-9 + padded width — already ≥44px wide), nav avatar, or any other target.
- Do not change any animation timing.

## Verification

**Build**
- [ ] Lint passes.
- [ ] No visual regression in ChatWindow/QueryInput snapshots or stories.

**Behavior**
- [ ] Tapping 8px outside the visible thumb/mic edge still activates it, without shifting layout or overlapping neighbors' hitboxes (thumbs sit in a `gap-1.5` row — confirm no cross-activation).
- [ ] Keyboard focus ring still hugs the visible button, not the hitbox.

**Feel**
- [ ] Test on a real touch device: thumbs and mic must be tappable first-try with a thumb, not a fingertip aim.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether 52px hitboxes in the 6px-gap thumbs row cause mis-taps between up/down votes needs a real thumb, not code — the feel-check on device is the verdict. If mis-taps occur, shrink thumbs inset to `-inset-2` (44px) and note it.
