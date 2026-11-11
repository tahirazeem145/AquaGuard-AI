# AquaGuard AI: Specialized Agent Roles

This directory defines the specialized **Agent Roles** that drive the development, design, and testing of **AquaGuard AI**. Each agent encapsulates domain-specific system prompts, responsibilities, technical constraints, and uses the standardized skills located in the [`skills/`](../skills/) directory.

---

## Agent Directory

| Agent Role | Specification File | Bound Skills | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Frontend Engineer** | [`frontend_engineer.md`](./frontend_engineer.md) | `web-artifacts-builder`, `frontend-design` | React 18 + Vite component architecture, Bootstrap 5 responsiveness, state management, client-side image compression, and FastAPI REST endpoint integration. |
| **UI/UX Designer** | [`ui_ux_designer.md`](./ui_ux_designer.md) | `frontend-design`, `theme-factory`, `canvas-design` | Visual identity, maritime color tokens ("Ocean Depths"), typography pairing, semi-circular SVG risk gauge design, WCAG 2.1 AA sunlight contrast, and anti-template design reviews. |
| **Backend Engineer** | [`backend_engineer.md`](./backend_engineer.md) | `fastapi-backend`, `supabase-database` | FastAPI REST service, Pydantic v2 schemas, OpenAPI/Swagger docs (`/docs`), Supabase PostgreSQL integration, Storage CDN uploads, and threadpool async dispatch. |
| **AI/ML Engineer** | [`ai_ml_engineer.md`](./ai_ml_engineer.md) | `ml-inference-pipeline` | MobileNetV3-Large transfer learning, CLAHE image preprocessing, Random Forest water hazard scoring, and multimodal biological synergy risk fusion. |
| **QA & Testing Engineer** | [`qa_testing_engineer.md`](./qa_testing_engineer.md) | `webapp-testing` | Playwright automated end-to-end tests, DOM selector verification, API error simulation, edge case validation (corrupted images, extreme sensor limits), and judge demo rehearsal. |

---

## How Agents Collaborate

```
[UI/UX Designer] ──(Design Tokens & Wireframes)──> [Frontend Engineer] ──(Running App)──> [QA Testing Engineer]
       ▲                                                                                            │
       └─────────────────────────(Visual Bugs & UX Regressions)─────────────────────────────────────┘
```

