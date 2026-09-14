# 004 — Kill the two inline-style `transition: all` leftovers

- **Commit:** 29d46e4
- **Severity:** HIGH
- **Category:** Easing & duration (`transition: all` signal)
- **Estimated scope:** 2 files, ~2 lines

## Problem

Plan 002 swept every `transition-all` class but missed two **inline-style** instances of the same defect: the Contract Analyzer's Analyze button and the AuthModal tab switcher both declare `transition: 'all …'` in a `style` object, so every background/border/shadow swap animates every property off the GPU.

Rule: "`transition: all` animates properties you never intended, off the GPU" — HIGH (AUDIT.md §2).

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/pages/ContractAnalyzer.jsx` | 939 | Analyze button inline `transition: 'all 0.2s'` (swaps background/border/color/boxShadow on `file` state) |
| `Frontend/src/components/ResizableNavbar.jsx` | 381–386 | AuthModal tab buttons inline `transition: 'all 0.15s'` (swap background/color/boxShadow/fontWeight on `tab` state) |

### Current code

```jsx
// Frontend/src/pages/ContractAnalyzer.jsx:939
boxShadow: file ? '0 8px 32px rgba(224,120,72,0.3)' : 'none',
transition: 'all 0.2s',
```

```jsx
// Frontend/src/components/ResizableNavbar.jsx:381-386
background: tab === t ? '#fff' : 'transparent',
color: tab === t ? '#0A0A0A' : 'rgba(0,0,0,0.45)',
boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
transition: 'all 0.15s' }}>
```

## Target

```js
// ContractAnalyzer.jsx:939
transition: 'background-color 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
```

```js
// ResizableNavbar.jsx:386
transition: 'background-color 0.15s cubic-bezier(0.22, 1, 0.36, 1), color 0.15s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
```

**Why these values:** only the four properties that actually change are named (fontWeight never transitions — it snaps, correctly); 0.2s/0.15s preserve today's timing; `[0.22, 1, 0.36, 1]` is the repo house ease-out.

## Conventions to follow

- This is a direct follow-up to plan 002 — same rule, same curve, same property-naming pattern. Exemplar: `QueryInput.jsx` inline `transition: 'border-color 0.2s, box-shadow 0.2s'`.
- Do not convert these to Tailwind classes; both buttons are fully inline-styled — stay inline.

## Steps

1. `ContractAnalyzer.jsx:939`: replace `'all 0.2s'` with the four-property list above.
2. `ResizableNavbar.jsx:386`: replace `'all 0.15s'` with the three-property list above.
3. Grep `transition: 'all` and `transition:"all` and `transition-all` in `Frontend/src` — zero matches.

## Out of scope

- Do not change durations, colors, shadows, or the `file`/`tab` state logic.
- Do not touch the framer-motion `whileHover`/`whileTap` on the Analyze button (plan 003 already normalized it).
- Do not introduce easing tokens.

## Verification

**Build**
- [ ] Lint passes on both files.
- [ ] All three `transition: all` grep variants return zero matches.

**Behavior**
- [ ] Toggling tabs and attaching/removing a file still eases background/border/shadow; nothing visibly snaps that previously eased.
- [ ] Rapid tab toggling retargets mid-flight instead of jumping.

**Feel**
- [ ] Scrub a tab toggle frame by frame: steep start, gentle settle.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

None — mechanical change, no taste involved.
