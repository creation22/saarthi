# 014 — Take the landing counters off React state

- **Commit:** 29d46e4
- **Severity:** LOW
- **Category:** Performance
- **Estimated scope:** 2 files, ~20 lines

## Problem

Both landing counters drive a number tween through React state at ~60fps (`setInterval` 16–18ms → `setVal` → re-render every frame). Animating through React state re-renders every frame for a text node that could update imperatively.

Rule (AUDIT.md §5): update the style or value directly; state updates re-render every frame.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `Frontend/src/components/landing/LandingHero.jsx` | 6–22 | `Counter`: `setInterval 16ms` + `setVal` |
| `Frontend/src/components/landing/LandingStats.jsx` | 5–21 | `Counter`: `setInterval 18ms` + `setVal` |

### Current code

```jsx
// Frontend/src/components/landing/LandingStats.jsx:5-21
function Counter({ to, suffix }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.ceil(to / 55);
    const t = setInterval(() => {
      n = Math.min(n + step, to);
      setVal(n);
      if (n >= to) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}
```

(LandingHero variant identical except `to / 60` step and 16ms cadence.)

## Target

Keep component API (`to`, `suffix`), `useInView once`, easing shape (linear count-up), and final formatted value identical. Replace state with a direct DOM write:

```jsx
function Counter({ to, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    let n = 0;
    const step = Math.ceil(to / 55); // keep each file's existing divisor
    const fmt = v => v.toLocaleString() + suffix;
    ref.current.textContent = fmt(0);
    const t = setInterval(() => {
      n = Math.min(n + step, to);
      if (ref.current) ref.current.textContent = fmt(n);
      if (n >= to) clearInterval(t);
    }, 18); // keep each file's existing cadence
    return () => clearInterval(t);
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}
```

Zero re-renders during the count; identical visual output including `toLocaleString` grouping and suffix.

**Why these values:** divisors/cadences preserved per file (no behavior change); `textContent` write is the "update directly" the rule asks for; `useState` import removed if now unused in the file.

## Conventions to follow

- LandingHero keeps `/60` + 16ms; LandingStats keeps `/55` + 18ms — do not unify (out of scope, avoids behavior drift).
- `suffix` added to deps (it was read inside the effect before via render; now read imperatively — keep lint clean).

## Steps

1. Rewrite both `Counter` components per Target (file-specific divisor/cadence preserved).
2. Remove `useState` import only if unused elsewhere in the file (check before deleting).
3. Scroll each counter into view: counts 0→`to` with grouping, stops exactly at `to`, no extra renders (React DevTools highlight or a render counter confirms).

## Out of scope

- Do not change final values, formatting, `useInView` behavior, or counter styling.
- Do not convert to rAF/spring odometers or add easing — linear count-up is the existing design.
- Do not touch `Typewriter` (timeout-driven, far below frame rate).

## Verification

**Build**
- [ ] Lint passes (no unused imports, exhaustive-deps clean).
- [ ] Both counters still end exactly at `to` with suffix.

**Behavior**
- [ ] Unmount mid-count (navigate away): interval cleared, no setState-on-unmounted warning (there is no setState at all now).
- [ ] `to=0` or tiny `to`: terminates immediately, shows `0`.

**Feel**
- [ ] N/A for frame budget at this size — but profile once: no component re-renders during count (that IS the verification).
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Impact is honestly small (two counters on a rarely-viewed landing page) — filed LOW for that reason. The value is exemplary: it removes the codebase's only 60fps-setState pattern so future copies don't propagate it.
