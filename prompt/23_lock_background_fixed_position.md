# Prompt 23: Permanent Fixed-Position Background Anchor & Scroll Isolation

## 1. Context & User Directive
**User Prompt:**
`make sure that bg fixed in bg`

---

## 2. Technical Modifications

### A. Strict Hardware-Fixed Viewport Pinning (`AmbientRibbonBackground.jsx`)
- Configured the background container with strict CSS viewport pinning:
  - `position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh;`
  - `transform: translate3d(0, 0, 0); WebkitTransform: translate3d(0, 0, 0);` to enforce a dedicated GPU compositor plane.
  - `contain: 'strict'` to completely isolate the element's layout, paint, and bounds from page scroll events.
  - `pointerEvents: 'none'` so all mouse, wheel, touch, and drag inputs pass directly through to the UI cards.
- Removed global assembly drift translation (`x: 85, y: -55`) so the ribbon clusters stay permanently anchored to their designated left and right canvas coordinates.

### B. Purging Scroll-Driven Parallax (`App.jsx`)
- Completely removed the GSAP `ScrollTrigger` parallax displacement on `.ambient-ribbon-left-group` and `.ambient-ribbon-right-group` (`y: ±110px`).
- Page scrolling now scrolls only the foreground content and translucent glass cards, leaving the background 100% stationary and anchored.

### C. Body Scroll Isolation (`index.css`)
- Added `background-attachment: fixed;` to `body` in `index.css`.

---

## 3. Verification
- `npm run build`: Compiled in 1.79s (`dist/assets/index-xXTs-AgF.js`).
- `pytest backend/tests/ -q`: 9/9 passed in 15.30s (100% pass rate).
- Verified live: as the user scrolls, the cards glide smoothly over the background while the glowing ribbons remain fixed in place.

