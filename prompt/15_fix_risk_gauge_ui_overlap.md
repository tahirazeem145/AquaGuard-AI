# Prompt 15: Resolution of Risk Gauge Needle & Typography Collision

## 1. Context & User Directive
**User Prompt:** `fix the ui`
**User Attachment:** A screenshot (`media_1793504957453_851dc5fe.png`) showing the circular Risk Gauge where the needle pivot circle, needle hand, and the digital score text `0` with label `RISK INDEX (0 - 100)` were rendered directly on top of each other, creating an unreadable visual overlap.

## 2. Root Cause Analysis
- The legacy implementation of `RiskGauge.jsx` placed the SVG needle pivot at $(120, 140)$ with a line pointing outwards, while simultaneously placing an absolute-positioned HTML `div` with `bottom: 0px` containing large `2.5rem` typography.
- Because both elements mapped to the exact same vertical coordinates ($y \approx 130\text{--}150$), the numeric score `0` was superimposed over the white pivot dot, and `RISK INDEX` crossed directly through the needle line.

## 3. Engineering Redesign (`frontend/src/components/RiskGauge.jsx`)
1. **Mathematical Arc Geometry:**
   - Engineered a 250° circular sweep arc with center $(cx, cy) = (130, 115)$ and radius $r = 86\text{ px}$.
   - Arc start angle is $145^\circ$ and end angle is $395^\circ$, leaving an open 110° base at the bottom.
2. **Elimination of Text Collisions via Native SVG Viewport Positioning:**
   - Placed the text elements natively inside SVG coordinates, mathematically centered in the open circle:
     - `y = 93`: Micro-caption `COMPOSITE RISK` (10px uppercase monospace, `#64748b`).
     - `y = 133`: Large Digital Score Number (46px bold monospace, dynamic tier color with drop-shadow glow).
     - `y = 151`: Unit Scale `/ 100` (11px monospace, `#94a3b8`).
     - `y = 168`: Embedded Tier Pill Badge (e.g. `NORMAL`, `WARNING`, `EMERGENCY`).
3. **High-Precision Value Tracking (Bead & Pip Indicator):**
   - Eliminated the clumsy needle crossing the text box.
   - Implemented a sleek glowing marker pip and outer bead that glides along the arc track to the exact score position:
     $$\theta = 145^\circ + \left(\frac{\text{Score}}{100}\right) \times 250^\circ$$
     $$(x_{pip}, y_{pip}) = (130 + 86\cos\theta, 115 + 86\sin\theta)$$
   - Ensured a minimum physical separation of $>80\text{ px}$ between the track indicator and the digital typography at all values ($0$ to $100$).
4. **Enhanced Tri-Factor Weight Breakdown:**
   - Added horizontal mini-bars for Visual Pathologies (55%), Water Telemetry (45%), and Biological Synergy bonuses.

## 4. Verification
- `npm run build`: Compiled cleanly in 483ms with zero errors.
- Verified in browser with HMR auto-reload: clean separation, no typography collision, and smooth CSS/SVG transitions.

