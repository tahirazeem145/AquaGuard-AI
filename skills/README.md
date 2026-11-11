# AquaGuard AI: Agent Skills Registry

This directory contains official and standardized **Agent Skills** sourced directly from the public Anthropic Agent Skills repository ([`github.com/anthropics/skills`](https://github.com/anthropics/skills)). Each skill provides operational guidance, constraints, and best practices for specialized engineering domains.

---

## Skills Catalog

| Skill Name | Path | Domain | Description & Application in AquaGuard AI |
| :--- | :--- | :---: | :--- |
| **`frontend-design`** | [`frontend-design/SKILL.md`](./frontend-design/SKILL.md) | UI & Visual Design | Distinctive, non-templated UI design. Prevents generic "AI slop" (overused purple gradients, cliché cards). Defines custom color palettes, intentional typography scales, and high-contrast layouts readable under bright outdoor pond sunlight. |
| **`theme-factory`** | [`theme-factory/SKILL.md`](./theme-factory/SKILL.md) | Styling & Tokens | 10 pre-curated color palettes, font pairings, and design token generators. Used to establish cohesive styling (e.g., "Ocean Depths" maritime palette) across the React dashboard. |
| **`web-artifacts-builder`** | [`web-artifacts-builder/SKILL.md`](./web-artifacts-builder/SKILL.md) | Frontend Architecture | Guidelines for building modern React 18 + Vite applications with responsive state management, client-side routing, and modular component composition. |
| **`canvas-design`** | [`canvas-design/SKILL.md`](./canvas-design/SKILL.md) | Visual Assets & Charts | High-craftsmanship aesthetic philosophy for creating data visualizations, pond risk gauges, and diagnostic summary cards that look human-crafted. |
| **`webapp-testing`** | [`webapp-testing/SKILL.md`](./webapp-testing/SKILL.md) | Quality Assurance | Playwright-based automated testing toolkit. Used to write end-to-end tests for the fish image uploader, water slider interactions, risk gauge updates, and demo scenario buttons. |
| **`fastapi-backend`** | [`fastapi-backend/SKILL.md`](./fastapi-backend/SKILL.md) | Backend Architecture | High-performance async REST API with Python FastAPI and Pydantic v2. Handles multipart uploads, CORS, route structuring, and auto-generated Swagger UI docs (`/docs`). |
| **`ml-inference-pipeline`** | [`ml-inference-pipeline/SKILL.md`](./ml-inference-pipeline/SKILL.md) | ML Deployment | Low-latency CPU inference (<35 ms) for MobileNetV3 and Random Forest, CLAHE contrast enhancement, thread-safe model registries, and biological synergy risk fusion. |
| **`supabase-database`** | [`supabase-database/SKILL.md`](./supabase-database/SKILL.md) | Cloud Persistence | Managed PostgreSQL schema, Row-Level Security (RLS), Supabase Storage bucket (`fish-scans`), and Realtime WebSocket alerts. |

---

## Skill Architecture

Every skill conforms to the open Agent Skills specification:
* **YAML Frontmatter:** Declares `name` and `description` used for intent recognition.
* **Instruction Body:** Procedural guidelines, self-critique rules, anti-patterns to avoid, and implementation examples.

