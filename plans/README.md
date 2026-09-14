# Animation plans

Recommended execution order (leverage = impact ÷ effort):

| Order | Plan | Severity | Status |
| --- | --- | --- | --- |
| 1 | [002 — Replace transition:all](002-replace-transition-all.md) | HIGH | DONE |
| 2 | [003 — Normalize hover/press scales](003-normalize-press-scales.md) | MEDIUM | DONE |
| 3 | [001 — Stop animating navbar layout properties](001-navbar-no-layout-animation.md) | HIGH | DONE |

Dependencies: 002 and 003 both touch `QueryInput.jsx` hover/transition lines but different props (`transition-all` class vs `whileHover`/`whileTap` scales) — safe to run in either order, or in parallel with care around lines 38 vs 74–75. Run 001 last since it rewrites the same navbar file's motion blocks and is the largest diff.

Source commit for all plans: `ff71bdf`.
