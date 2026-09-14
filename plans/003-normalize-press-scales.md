# 003 — Normalize hover/press scales to felt-not-seen

- **Commit:** ff71bdf
- **Severity:** MEDIUM
- **Category:** Physicality & origin
- **Estimated scope:** 5 files, ~10 lines

## Problem

Hover scales up to 1.07–1.10 and press scales down to 0.92–0.93 are scattered across daily-use controls (chat mic/send, feedback thumbs, topic icons). Above ~2% hover reads as ballooning; below ~0.95 press reads as the button collapsing instead of acknowledging the tap. Press feedback should be felt, not seen.

Rules (AUDIT.md §3): hover scale above ~2% → `scale(1.02)`; `scale(0.9)`-or-lower press → `scale(0.97)`; hover with nothing on `:active` needs `scale(0.97)` @150ms.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/QueryInput.jsx` | 74–75 | Mic: `whileHover scale 1.07`, `whileTap scale 0.93` — highest frequency (every dictation) |
| `Frontend/src/components/ChatWindow.jsx` | 128 | Feedback thumbs: `whileHover scale 1.1, y -1`, `whileTap scale 0.92` — 28px targets hit daily |
| `Frontend/src/pages/KnowYourRights.jsx` | 135–139 | Topic icon: `whileHover scale 1.08` with spring 400/20, no tap state |
| `Frontend/src/components/ChatWindow.jsx` | 21, 79–80 | Citations 1.03, PlayButton 1.03/0.96 — borderline, normalize with the same pass |
| `Frontend/src/pages/Home.jsx` | 251 | New Chat 1.03/0.97 — hover already close, included for consistency |

### Current code

```jsx
// Frontend/src/components/QueryInput.jsx:74-75
whileHover={!loading ? { scale: 1.07 } : {}}
whileTap={!loading ? { scale: 0.93 } : {}}
```

```jsx
// Frontend/src/components/ChatWindow.jsx:128
whileHover={{ scale: 1.1, y: -1 }} whileTap={{ scale: 0.92 }}
```

```jsx
// Frontend/src/pages/KnowYourRights.jsx:135-139
<motion.span ... whileHover={{ scale: 1.08 }}
  transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
```

## Target

```jsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.97 }}
transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
```

Per-site mapping:
- Mic (QueryInput:74-75): `1.07 → 1.02`, `0.93 → 0.97`. Keep the `!loading`/`canSend` guards.
- Feedback thumbs (ChatWindow:128): `1.1 → 1.02` (drop `y: -1` — the lift plus 10% scale double-emphasizes a 28px target), `0.92 → 0.97`.
- Topic icon (KnowYourRights:138): `1.08 → 1.02`; replace spring `400/20` with `duration 0.15, ease [0.22,1,0.36,1]`; add `whileTap={{ scale: 0.97 }}` since it is inside a pressable row button with no press feedback.
- Citations (ChatWindow:21), PlayButton (79-80), New Chat (Home:251): `1.03/1.04 → 1.02`, `0.96 → 0.97` for uniformity.
- Send button (QueryInput:113-114) `1.04/0.95` → `1.02/0.97`; Sign Up (ResizableNavbar:81) `1.04/0.97` → hover `1.02`, tap stays `0.97`.

**Why these values:** 1.02 = the ~2% ceiling where hover reads as lift, not inflation; 0.97 = felt-not-seen press; 150ms = button-press budget (AUDIT.md §2); `[0.22,1,0.36,1]` = repo house ease-out. Only very tiny elements justify more than 2% — none of these qualify (smallest is 28px, still a finger target).

## Conventions to follow

- In-repo exemplars that already do it right: `ChatWindow.jsx:21` citations `whileTap 0.97`, `ResizableNavbar.jsx:81` Sign Up `whileTap 0.97`, `Home.jsx:251` New Chat `whileTap 0.97` — match their shape, extend the 1.02/0.97 pair to the outliers.
- Keep existing disabled/loading guards (`!loading`, `canSend`, `state === 'idle'`) exactly as-is.
- No new easing tokens; the repo has no `--ease-*` system — inline the house curve.

## Steps

1. QueryInput mic + send: apply 1.02/0.97 pair, keep guards.
2. ChatWindow citations, PlayButton, feedback thumbs: apply pair; remove `y: -1` on thumbs hover.
3. KnowYourRights topic icon: 1.02 hover, add 0.97 tap, swap spring for 0.15s house ease.
4. Home New Chat, ResizableNavbar Sign Up, DocumentWizard/Home/ContractAnalyzer `1.03/1.04` hovers found by grep `whileHover`: normalize hover to 1.02, tap to 0.97.
5. Grep `scale: 1.1|scale: 1.08|scale: 1.07|scale: 0.9|scale: 0.93` — zero remaining matches in `Frontend/src`.

## Out of scope

- Do not change colors, layouts, hit areas (44px hitbox work belongs to the accessibility pass, not this plan).
- Do not touch Bento card `y: -5` lift, nav-pill `layoutId`, modal/drawer entrances, or waveform/scan infinite loops.
- Do not introduce a shared hook/HOC for pressables; edit each call site.
- Do not change any enter/exit durations.

## Verification

**Build**
- [ ] Type-check and lint pass.
- [ ] Grep for the old outliers returns zero matches.

**Behavior**
- [ ] Every touched control still responds to hover and press; disabled/loading states still suppress motion.
- [ ] Topic icon now has press feedback where it had none.
- [ ] Rapid tap retargets mid-flight instead of restarting (framer-motion transitions do this natively).

**Feel**
- [ ] Record taps and scrub frame by frame: press should register as a subtle give, not a visible shrink; if you can clearly see it shrink, it's still too aggressive.
- [ ] Test on a real touch device: hover states must not stick after tap.
- [ ] With `prefers-reduced-motion: reduce` emulated, note remaining motion for the accessibility pass — this plan does not gate it.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether 1.02 vs 1.03 is distinguishable on the 28px thumbs can't be judged from code — the plan picks the stricter 1.02 for cohesion and relies on the feel-check. Brand personality (playful vs professional) could justify slightly more on marketing surfaces only; these are all daily-use product controls, so restraint wins.
