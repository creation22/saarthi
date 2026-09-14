# Animation plans

Source commit for 001–003: `ff71bdf`. Source commit for 004–016: `29d46e4`.

Recommended execution order (leverage = impact ÷ effort):

| Order | Plan | Severity | Status |
| --- | --- | --- | --- |
| 1 | [002 — Replace transition:all](002-replace-transition-all.md) | HIGH | DONE |
| 2 | [003 — Normalize hover/press scales](003-normalize-press-scales.md) | MEDIUM | DONE |
| 3 | [001 — Stop animating navbar layout properties](001-navbar-no-layout-animation.md) | HIGH | DONE |
| 4 | [004 — transition:all leftovers](004-transition-all-leftovers.md) | HIGH | TODO |
| 5 | [005 — UserMenu transform origin](005-usermenu-transform-origin.md) | MEDIUM | TODO |
| 6 | [006 — TypingIndicator exit](006-typing-indicator-exit.md) | MEDIUM | TODO |
| 7 | [007 — Reduced-motion global](007-reduced-motion-global.md) | MEDIUM | TODO |
| 8 | [009 — Wizard direction](009-wizard-direction.md) | MEDIUM | TODO |
| 9 | [010 — Card press feedback](010-card-press-feedback.md) | MEDIUM | TODO |
| 10 | [008 — Control hitboxes](008-control-hitboxes.md) | MEDIUM | TODO |
| 11 | [011 — Empty-state scale](011-empty-state-scale.md) | MEDIUM | TODO |
| 12 | [013 — Unify springs/stagger](013-unify-springs-stagger.md) | LOW | TODO |
| 13 | [015 — ReasoningTrace disclosure](015-reasoning-trace-disclosure.md) | LOW | TODO |
| 14 | [012 — Marketing scale polish](012-marketing-scale-polish.md) | LOW | TODO |
| 15 | [014 — Counters off state](014-counters-off-state.md) | LOW | TODO |
| 16 | [016 — Wizard height morph](016-wizard-height-morph.md) | LOW | TODO |

Dependencies:
- 004 first (2-line mechanical follow-up to 002; touches `ResizableNavbar.jsx` tabs + `ContractAnalyzer.jsx` button).
- 005 touches `ResizableNavbar.jsx` UserMenu — run after 004 to avoid same-file conflicts (different blocks, safe in either order).
- 006 touches `ChatWindow.jsx` TypingIndicator — independent of 005.
- 007 (`MotionConfig` + `index.css`) changes global motion behavior: land it before the feel-checks of 006/009/011/013/015/016, since it alters what `reduce` looks like. Verify others under both motion settings after 007 lands.
- 009 owns wizard x/opacity; 013 owns wizard field stagger; 016 owns wizard height. All three edit `DocumentWizard.jsx` — run sequentially (009 → 013 → 016), never in parallel.
- 010 touches `Dashboard.jsx`, `LawyerDirectory.jsx`, `MatterDetail.jsx`, `KnowYourRights.jsx` — independent of the wizard chain; safe alongside 004–008.
- 008 touches `ChatWindow.jsx` + `QueryInput.jsx` (classNames only) — safe alongside 006 (different lines) but prefer sequential on `ChatWindow.jsx`.
- 011 touches `ChatWindow.jsx` EmptyState — sequential with 006/008 on that file.
- 012/014 are marketing-only (`BentoGrid.jsx`, `Landing*.jsx`, `HomeBgIcons.jsx`) — safe in parallel with everything except each other on `BentoGrid.jsx` (012 only there; fine).
- 015 touches `ReasoningTrace.jsx` alone — parallel-safe.
