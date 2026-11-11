# AquaGuard AI: Development Step 28 – Pond Treatment Dosage Calculator (Feature 2)

> **Step:** 28  
> **Status:** Completed & Verified ✅  
> **Date:** 2026-11-01  
> **Category:** Precision Aquaculture Remediation / Farmer Utility Tools  

---

## 1. Overview & Objective

To translate AI-generated non-antibiotic recommendations into exact, actionable, physical measurements for smallholder aquaculture farmers, we developed the **Pond Treatment Dosage Calculator** (`TreatmentDosageCalculatorModal.jsx`). Instead of vague instructions like "apply rock salt" or "buffer pond water with lime", the calculator provides farmers with:
1. Exact quantities in **kilograms ($kg$)** and **standard $50\text{ kg}$ commercial sacks/bags**.
2. Total water volume calculation in **Cubic Meters ($m^3$)**, **Liters ($L$)**, and **Acres ($ac$)**.
3. Specialized treatment modes:
   - **Whole Pond Rock Salt Treatment:** $1.0 - 3.0\text{ kg/m}^3$ (salinity buffer for osmotic relief and nitrite detoxification).
   - **Separate Intensive Saline Dip Vat:** $2.0\% - 3.0\%$ saline bath for 5–10 minutes with aeration for parasitic & fungal cleansing.
   - **Agricultural Lime ($CaCO_3$):** Dynamic neutralization calculation targeting $pH = 7.4$ based on live telemetry pH deficit ($25\text{ kg per } 1,000\text{ m}^3\text{ per } 0.5\text{ pH deficit}$).
   - **Clean Water Exchange:** $20\% - 30\%$ volumetric flush to purge toxic ammonia gas and organic matter.
   - **Emergency Mechanical Aeration:** Recommended paddlewheel runtime schedule based on live dissolved oxygen ($DO$) levels.
4. Estimated treatment cost in **Indian Rupees ($₹$)** and **US Dollars ($\$$)**.
5. One-click **"Copy Treatment Slip"** formatted for instant pasting into farm logbooks or WhatsApp field groups.
6. Seamless integration with the 12 Indian Languages + English localization matrix.

---

## 2. Scientific & Mathematical Models

### 2.1 Pond Water Volume Calculation
$$\text{Volume } (m^3) = \text{Length } (m) \times \text{Width } (m) \times \text{Average Depth } (m)$$
$$\text{Total Water Volume } (L) = \text{Volume } (m^3) \times 1,000$$

Imperial mode automatically converts feet to meters ($1\text{ ft} \approx 0.3048\text{ m}$).

### 2.2 Whole Pond Rock Salt (Non-Iodized)
$$\text{Required Salt } (kg) = \text{Volume } (m^3) \times \text{Dosage Rate } (kg/m^3)$$
$$\text{Standard Sacks } (50\text{ kg}) = \left\lceil \frac{\text{Required Salt } (kg)}{50} \right\rceil$$

### 2.3 Agricultural Lime ($CaCO_3$) for pH Correction
$$\Delta pH = \max(0, 7.4 - pH_{current})$$
$$\text{Lime Quantity } (kg) = \left( \frac{\text{Volume } (m^3)}{1,000} \right) \times \left( \frac{\Delta pH}{0.5} \right) \times 25\text{ kg}$$

### 2.4 Clean Water Exchange
$$\text{Flush Volume } (L) = \text{Total Liters} \times \left( \frac{\text{Flush Percentage}}{100} \right)$$

### 2.5 Emergency Mechanical Aeration Duration
$$\text{Runtime } (hrs) = \begin{cases} 
8.0\text{ hours (Continuous Overnight)}, & DO < 2.5\text{ mg/L} \\
6.5\text{ hours (Extended Night/Morning)}, & 2.5 \le DO < 4.0\text{ mg/L} \\
4.5\text{ hours (Standard Remediation)}, & 4.0 \le DO < 5.0\text{ mg/L} \\
2.0\text{ hours (Preventative Maintenance)}, & DO \ge 5.0\text{ mg/L}
\end{cases}$$

---

## 3. UI/UX Implementation Details

- **Modal Architecture:** Floating frosted glass modal (`TreatmentDosageCalculatorModal.jsx`) styled in the Obsidian Glassmorphism theme (`rgba(10, 14, 22, 0.95)`, `backdrop-filter: blur(32px)`).
- **Direct Launchers:** Added global `[ ⚖️ Dosage Calculator ]` button to `ActionPlanCard.jsx` header plus individual `[ ⚖️ Calculate Dosage ]` shortcuts beside each prescriptive plan item.
- **Smart Pre-Filling:** Automatically detects current pond name, pond dimensions, and live telemetry parameters ($pH$, $DO$) from `App.jsx`.
- **Farmer-Friendly Visuals:** Sack badges ($50\text{ kg sacks}$), color-coded cards, and responsive sliders with instant real-time computation.

---

## 4. Verification & Testing

- **Backend Pytest:** 9/9 automated test suites passing with 100% compliance (`backend/tests/`).
- **Frontend Build:** Vite production compilation completed in 863ms with zero errors.
- **Microservice Status:** FastAPI backend running healthy on `http://127.0.0.1:8000`, Vite running on `http://127.0.0.1:5173`.

