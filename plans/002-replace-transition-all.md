# 002 — Replace transition:all with property-specific transitions

- **Commit:** ff71bdf
- **Severity:** HIGH
- **Category:** Easing & duration (`transition: all` signal)
- **Estimated scope:** 6 files, ~7 lines

## Problem

Seven sites use `transition-all` (Tailwind) / `transition: all`, which animates every changed property — including layout/paint ones never intended — and keeps motion off the GPU. Each site only ever changes colors, borders, shadows, opacity, or transforms. The fix is cheap and mechanical: name the properties.

Rule: "`transition: all` animates properties you never intended, off the GPU" — HIGH (AUDIT.md §2).

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/ReasoningTrace.jsx` | 9 | `transition-all duration-200` on accordion shell (only border + bg change) |
| `Frontend/src/components/QueryInput.jsx` | 38 | `transition-all` on form shell (only border-color/box-shadow change; inline style already sets the right pair) |
| `Frontend/src/pages/DocumentWizard.jsx` | 161 | `transition-all` on template card (only border-color/box-shadow/transform change) |
| `Frontend/src/pages/KnowYourRights.jsx` | 187 | `transition-all hover:shadow-sm` on question row (only border/shadow/transform) |
| `Frontend/src/pages/KnowYourRights.jsx` | 299 | `transition-all focus-within:border-saffron` on search shell (only border-color/box-shadow) |
| `Frontend/src/components/ui/button.jsx` | 7 | `transition-all` in shared `buttonVariants` base (affects every shadcn button) |
| `Frontend/src/components/ui/badge.jsx` | 8 | `transition-all` in shared badge base |

### Current code

```jsx
// Frontend/src/components/ReasoningTrace.jsx:9
<div className="mt-2 overflow-hidden rounded-xl border transition-all duration-200"
```

```jsx
// Frontend/src/components/QueryInput.jsx:38
className="flex items-end gap-2 rounded-2xl border px-4 py-3 transition-all focus-within:shadow-sm"
```

```jsx
// Frontend/src/pages/DocumentWizard.jsx:161
className="group relative flex flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-all"
```

```jsx
// Frontend/src/pages/KnowYourRights.jsx:187
className="group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all hover:shadow-sm"
```

```jsx
// Frontend/src/components/ui/button.jsx:7
... whitespace-nowrap transition-all outline-none select-none ...
```

## Target

Replace each `transition-all` with the exact properties that change there, 150–200ms, house ease-out curve:

```css
/* interactive shells (ReasoningTrace, QueryInput, KnowYourRights search, cards, rows) */
transition: border-color 150ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 150ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 150ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 150ms cubic-bezier(0.22, 1, 0.36, 1);
/* shadcn button/badge base */
transition: color 150ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 150ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 150ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 150ms cubic-bezier(0.22, 1, 0.36, 1);
```

In Tailwind terms: `transition-all duration-200` → `transition-colors duration-150` on pure color/border shells (`ReasoningTrace`, search shell line 299); `transition-all` → `transition-[border-color,background-color,box-shadow,transform] duration-150` (or equivalent `transition` + explicit `transition-property`) on cards/rows that also lift (`DocumentWizard:161`, `KnowYourRights:187`, `QueryInput:38` keeps its inline `transition: border-color 0.2s, box-shadow 0.2s` and drops the class). Keep existing `duration-200` where it already exists unless the diff forces a choice — 150ms is the target for hover, 200ms stays acceptable.

**Why these values:** 100–150ms hover budget (AUDIT.md §2: hover 100–150ms, 300ms feels swimmy); `[0.22, 1, 0.36, 1]` is the repo house ease-out (LandingHero, AuthModal, KnowYourRights:176); naming properties keeps motion on Composite-friendly paths and stops accidental width/height/padding animation.

## Conventions to follow

- `QueryInput.jsx:43` inline `transition: 'border-color 0.2s, box-shadow 0.2s'` is the house exemplar for naming properties — extend its pattern, don't invent a token system.
- `KnowYourRights.jsx:125-127` (`transition: 'border-color 0.2s'`) and `ResizableNavbar.jsx:477` (`transition: 'color 0.15s'`) are correct in-repo precedents for single-property transitions.
- There are no `--ease-*` / `--duration-*` tokens in this repo — use inline values matching the house curve; do not create a parallel token system.

## Steps

1. `ReasoningTrace.jsx:9`: `transition-all duration-200` → `transition-colors duration-150` (shell only swaps border-color/background).
2. `QueryInput.jsx:38`: remove `transition-all` from className (inline style line 43 already declares the exact pair); leave the inline style untouched.
3. `DocumentWizard.jsx:161`: `transition-all` → color/border/shadow/transform-only transition (card lifts via `whileHover y:-4`).
4. `KnowYourRights.jsx:187,299,423,459` and `Home.jsx`/`History.jsx` equivalents if they share the row pattern: same replacement; hover shadow must still ease.
5. `ui/button.jsx:7`, `ui/badge.jsx:8`: `transition-all` → `transition-colors` (plus `box-shadow` if the variant animates shadows); this is the highest-leverage single edit since every shadcn button inherits it.
6. Grep `transition-all` afterward — zero remaining matches in `Frontend/src`.

## Out of scope

- Do not change durations outside 150–200ms, colors, shadows, or hover lift distances.
- Do not touch framer-motion `whileHover`/`whileTap` scales (covered by plan 003).
- Do not introduce CSS variables, a Tailwind config extension, or a new animation library.
- Do not change any component's enter/exit choreography.

## Verification

**Build**
- [ ] Type-check and lint pass.
- [ ] Grep `transition-all` in `Frontend/src` returns zero matches.

**Behavior**
- [ ] Hover/focus each touched shell: border/bg/shadow still ease; no property visibly snaps that previously eased.
- [ ] ReasoningTrace open/close, QueryInput record toggle, wizard card hover, KnowYourRights row hover all still transition.
- [ ] Rapid hover in/out retargets mid-flight (CSS transitions do this natively) instead of jumping.

**Feel**
- [ ] Record hovers and scrub frame by frame: curve steep at start, gentle settle; if flat, the curve is too weak, not the duration.
- [ ] With `prefers-reduced-motion: reduce` emulated, color/opacity still transition and nothing translates.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether 150ms vs 200ms reads better on the wizard cards can't be judged from code — both are inside budget. The plan picks 150ms for hover responsiveness; a human feel-check is the tiebreaker.
