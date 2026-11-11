# AquaGuard AI: Prompt Registry & History Log

This directory serves as the permanent archive of all prompts, engineering instructions, and workflow directives used throughout the design, research, specification, and implementation of **AquaGuard AI – Fish Disease Risk Detection and Early Warning System**.

---

## Prompt Index

| Prompt ID | File Name | Date & Timestamp | Category | Purpose / Summary |
| :---: | :--- | :---: | :--- | :--- |
| **PROMPT-01** | [`01_project_research_and_workspace.md`](./01_project_research_and_workspace.md) | 2026-10-31 18:54:52 | Research & Architecture | Workspace setup, 8 research topic deep dives, dataset validation, initial `prompt.md` master log. |
| **PROMPT-02** | [`02_mrd_and_prd_specification.md`](./02_mrd_and_prd_specification.md) | 2026-10-31 23:31:49 | Product Management | Creation of dedicated `mrd/` and `prd/` directories, authoring comprehensive `mrd.md` and `prd.md`. |
| **PROMPT-03** | [`03_directory_flattening_and_cleanup.md`](./03_directory_flattening_and_cleanup.md) | 2026-10-31 23:36:18 | Workspace Maintenance | Diagnosis and elimination of duplicate folder junctions and flattening the workspace root. |
| **PROMPT-04** | [`04_prompt_archive_system.md`](./04_prompt_archive_system.md) | 2026-10-31 23:38:13 | Documentation | Establishing this dedicated `prompt/` archive folder to log every incoming directive and response. |
| **PROMPT-05** | [`05_skills_and_agents_setup.md`](./05_skills_and_agents_setup.md) | 2026-10-31 23:42:57 | Agent Architecture | Downloaded 5 official Claude skills (`frontend-design`, `theme-factory`, `web-artifacts-builder`, `canvas-design`, `webapp-testing`) and configured 3 specialized agent roles (`frontend_engineer`, `ui_ux_designer`, `qa_testing_engineer`). |
| **PROMPT-06** | [`06_backend_skills_and_agents.md`](./06_backend_skills_and_agents.md) | 2026-10-31 23:50:59 | Backend & AI/ML | Established 3 backend skills (`fastapi-backend`, `ml-inference-pipeline`, `supabase-database`) and 2 specialized backend agent roles (`backend_engineer`, `ai_ml_engineer`). |
| **PROMPT-07** | [`07_backend_implementation_complete.md`](./07_backend_implementation_complete.md) | 2026-10-31 23:56:34 | System Implementation | Engineered complete FastAPI backend and multimodal risk engine without placeholders. 6/6 integration tests passed with 100% success rate. |
| **PROMPT-08** | [`08_real_model_weights_and_backend_integration.md`](./08_real_model_weights_and_backend_integration.md) | 2026-11-01 00:28:50 | AI/ML Models & Backend | Integrated real open-source MobileNetV3-Large PyTorch weights from Hugging Face (98.28% accuracy) and trained/exported Random Forest water hazard model. Resolved Windows path limits via `.venv`, passing all 6 integration tests. |
| **PROMPT-09** | [`09_frontend_implementation_and_e2e_verification.md`](./09_frontend_implementation_and_e2e_verification.md) | 2026-11-01 08:34:07 | Frontend & E2E Testing | Engineered complete React 19 + Vite dashboard in `frontend/` with custom oceanic tokens, circular SVG risk gauge, live Emerson NH3 math, 3 judge demo presets, and full 9/9 pytest pass. |
| **PROMPT-10** | [`10_system_launch_and_links.md`](./10_system_launch_and_links.md) | 2026-11-01 08:36:26 | Operations & Launch | Verified and started background daemon services for both FastAPI (port 8000) and React frontend (port 5173). |
| **PROMPT-11** | [`11_proxy_and_pond_selector_fix.md`](./11_proxy_and_pond_selector_fix.md) | 2026-11-01 08:44:14 | Bug Fix & Integration | Resolved Vite proxy 404 on `/health`, normalized pond dropdown array schemas, and verified green backend status badge. |
| **PROMPT-12** | [`12_photorealistic_images_and_telemetry_calibration.md`](./12_photorealistic_images_and_telemetry_calibration.md) | 2026-11-01 08:55:39 | Visual Assets & Math Calibration | Generated 3 photorealistic fish specimen images (Normal, Warning, Danger) replacing the canvas graphic, and calibrated telemetry values for each tier. |
| **PROMPT-13** | [`13_surveillance_ledger_separate_screen.md`](./13_surveillance_ledger_separate_screen.md) | 2026-11-01 09:05:00 | Screen Architecture & Navigation | Extracted the Pond Surveillance Ledger into a dedicated full-screen view with KPI metrics, filters, CSV/JSON export, and modal inspections. |
| **PROMPT-14** | [`14_fix_active_pond_and_specimen_rendering.md`](./14_fix_active_pond_and_specimen_rendering.md) | 2026-11-01 09:17:00 | Integration & Bug Fixes | Harmonized pond IDs (`pond_01`, `pond_02`, `pond_03`), resolved health check fallback routing, and eliminated legacy canvas drawing remnants. |
| **PROMPT-15** | [`15_fix_risk_gauge_ui_overlap.md`](./15_fix_risk_gauge_ui_overlap.md) | 2026-11-01 09:23:00 | UI/UX Refinement | Eliminated needle and typography collision on the circular Risk Gauge; redesigned with radial arc, glowing beacon pip, and centered digital readout. |
| **PROMPT-16** | [`16_change_font_to_normal_sans.md`](./16_change_font_to_normal_sans.md) | 2026-11-01 09:35:00 | Typography Normalization | Replaced robotic monospace/terminal fonts across the entire application with modern, clean, normal sans-serif typography (Inter). |
| **PROMPT-17** | [`17_figma_glassmorphism_and_palette_transformation.md`](./17_figma_glassmorphism_and_palette_transformation.md) | 2026-11-01 09:51:00 | UI/UX & Visual Architecture | Transformed the entire frontend into dark frosted glassmorphism matching the Figma community file. Replaced generic AI blue with an Electric Lime / Chartreuse and Royal Violet palette. |

---

## Operating Protocol for New Prompts

Whenever a new user request or major system instruction is issued:
1. Create a sequential file in this directory (e.g., `05_<task_name>.md`).
2. Log the exact verbatim prompt text, the context/phase, the objective, and the generated deliverables.
3. Update this index table in `prompt/README.md`.
4. Update the project master document `prompt.md` if any architectural decision, scope boundary, or milestone changed.

