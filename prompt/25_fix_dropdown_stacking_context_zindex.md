# Prompt 25: Stacking Context & Z-Index Layering Fix for Dropdown Menus

## 1. Context & User Directive
**User Prompt:**
`fix this`

**User Attachment:** A screenshot (`media_1793518534421_e81ed92e.png`) showing the open `Active Pond:` custom dropdown menu being visually obscured / clipped underneath the sibling `JudgePresetsBar` cards (`Preset 1 NORMAL` and `Preset 2 WARNING`).

---

## 2. Root Cause Analysis
In CSS stacking context rules, sibling elements that both have `position: relative` (inherent to `.card-panel`) stack according to DOM order when `z-index` is `auto`. Because `JudgePresetsBar` follows `<header>` in the DOM tree, its stacking context rendered in front of `<header>`. As a result, the child dropdown menu inside `<header>`—regardless of its internal `z-index`—could not escape its parent's stacking context and rendered underneath `JudgePresetsBar`.

---

## 3. Solution & Fix
1. **Header Stacking Priority ([`Header.jsx`](file:///e:/project/AquaGuard%20AI/frontend/src/components/Header.jsx)):**
   - Added explicit stacking priority: `style={{ ..., position: 'relative', zIndex: 100 }}` to `<header className="card-panel">`.
   - Elevated the dropdown menu's `z-index` so that the custom glass menu renders completely above `JudgePresetsBar` and all downstream components without clipping.
2. **Surveillance Ledger Filter Panel ([`SurveillanceLedgerScreen.jsx`](file:///e:/project/AquaGuard%20AI/frontend/src/components/SurveillanceLedgerScreen.jsx)):**
   - Added conditional elevation `zIndex: (isPondMenuOpen || isTierMenuOpen) ? 100 : 10` to the filter control card, guaranteeing that when the `Pond` or `Tier` dropdown opens, it floats comfortably above the historical audit table.

---

## 4. Verification
- `npm run build`: Compiled in 548ms with zero errors (`dist/assets/index-CRR9cXGg.js`).
- `pytest backend/tests/ -q`: 9/9 passed in 12.15s (100% pass rate).
- Verified live: dropdown menu now renders with full visual elevation on top of all preset cards.

