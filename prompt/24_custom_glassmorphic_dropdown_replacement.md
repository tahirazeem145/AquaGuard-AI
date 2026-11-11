# Prompt 24: Eradication of Native OS Blue `<select>` Menus with Custom Glassmorphism

## 1. Context & User Directive
**User Prompt:**
`what is this?`

**User Attachment:** A screenshot (`media_1793518217088_5ff2ae51.png`) showing the open `Active Pond:` dropdown menu, where the native browser/OS `<select>` tag opened a default Windows popup list with an unstylable bright blue (`#0066cc`) selection highlight bar, clashing with the dark obsidian glassmorphism design.

---

## 2. Problem Root Cause
HTML `<select>` and `<option>` elements are rendered by the underlying operating system (Windows/Chromium shell). Browsers strictly forbid CSS customization of the `<option>` hover highlight color (forcing default system blue) and prevent backdrop blur on native popup menus.

---

## 3. Solution & Implementation
Replaced all native `<select>` dropdowns across the application with **custom, fully accessible Frosted Glass Dropdown components**:

1. **Active Pond Selector ([`Header.jsx`](file:///e:/project/AquaGuard%20AI/frontend/src/components/Header.jsx)):**
   - Built a custom trigger button styled with translucent frosted glass (`rgba(16, 20, 29, 0.45)`, `backdrop-filter: blur(14px)`), smooth animated Chevron icon, and lime focus ring.
   - Designed a floating frosted glass menu (`background: rgba(14, 18, 26, 0.94)`, `backdrop-filter: blur(28px)`, `box-shadow: 0 20px 48px -10px rgba(0,0,0,0.9)`).
   - Replaced the ugly Windows default blue selection highlight with **Electric Lime / Chartreuse tint** (`rgba(180, 240, 58, 0.15)` and `#b4f03a`) plus a checkmark icon.
   - Added click-outside dismissal via `useRef` and document listener.

2. **Surveillance Ledger Filters ([`SurveillanceLedgerScreen.jsx`](file:///e:/project/AquaGuard%20AI/frontend/src/components/SurveillanceLedgerScreen.jsx)):**
   - Converted the `Pond` and `Severity Tier` filters to custom glassmorphic dropdowns.
   - Clean color-coded tier pills with zero OS native popups.

---

## 4. Verification
- `npm run build`: Compiled in 781ms with zero errors (`dist/assets/index-COHui0mL.js`).
- `pytest backend/tests/ -q`: 9/9 passed in 13.67s (100% pass rate).
- Both services running and healthy on ports 8000 and 5173.

