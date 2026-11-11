# Prompt 01: Project Research & Workspace Establishment

* **Prompt ID:** PROMPT-01
* **Date & Timestamp:** 2026-10-31 18:54:52 IST
* **Phase:** Phase 1 – Research & Feasibility
* **Status:** Completed

---

## Verbatim User Prompt

```text
Act as a senior research analyst, AI/ML engineer, software architect, and technical documentation specialist.

We are developing a hackathon project called AquaGuard AI – Fish Disease Risk Detection and Early Warning System.

Before writing any application code, I want you to establish a proper research and documentation workspace.

## 1. Create Project Folders

Inside the current project directory, create this structure:

AquaGuard-AI/
│
├── research/
│   ├── problem_analysis.md
│   ├── existing_solutions.md
│   ├── fish_diseases_research.md
│   ├── dataset_research.md
│   ├── ai_ml_approach.md
│   ├── proposed_solution.md
│   ├── feasibility_analysis.md
│   └── references.md
│
└── prompt.md

Do not create the application or start coding yet.

## 2. Conduct Detailed Research

Research the following topics using reliable sources such as scientific papers, research publications, government fisheries departments, and trusted aquaculture organizations.

### A. Problem Analysis
* What are the major fish diseases affecting aquaculture?
* Why are early disease detection and prevention difficult?
* What causes diseases to spread in fish ponds?
* What are the economic impacts of fish diseases?
* What challenges do small-scale fish farmers face?

### B. Existing Solutions
* What existing fish disease detection systems are available?
* How do current fish disease detection applications work?
* What technologies are already being used?
* What limitations exist in current solutions?
* What opportunities exist for improvement?

### C. Fish Disease Research
Investigate common fish diseases, their visible symptoms, causes, and prevention methods.
Include diseases such as:
* Ichthyophthiriasis (White Spot Disease)
* Fin Rot
* Columnaris
* Saprolegniasis
* Dropsy
* Other relevant aquaculture diseases.
Clearly distinguish diseases that can potentially be identified through images from those requiring laboratory tests or expert diagnosis.

### D. Dataset Research
Find publicly available datasets for:
* Fish disease images.
* Healthy and unhealthy fish images.
* Fish disease classification.
* Aquaculture water-quality data.
For every dataset, record:
* Dataset name.
* Source and download link.
* Number of images or records, if available.
* Disease categories.
* Data format.
* License or usage restrictions.
* Suitability for our hackathon prototype.
Do not invent datasets or claim that a dataset exists without verifying it.

### E. AI/ML Approach
Investigate practical approaches for:
* Fish disease image classification.
* Fish symptom identification.
* Water-quality analysis.
* Disease risk assessment.
* Early warning generation.
Compare suitable models and technologies.
Recommend an approach that is realistic for a student hackathon team with limited development time and resources.

### F. Proposed Solution
Design a practical solution for AquaGuard AI.
Consider these modules:
1. AI-based fish image analysis.
2. Pond water-quality monitoring.
3. Fish disease risk assessment.
4. Early warning and notifications.
5. Pond health dashboard.
6. Historical reports and monitoring.
Explain how these modules communicate with each other.

### G. Feasibility Analysis
Evaluate:
* Technical feasibility.
* Dataset availability.
* AI model development difficulty.
* Development time.
* Hardware requirements.
* Cost.
* Demo feasibility.
* Potential limitations.
Identify which features should be included in the hackathon MVP and which should be future enhancements.

## 3. Research Quality Requirements
* Use real and trustworthy sources.
* Prefer scientific papers and official fisheries organizations.
* Include source links and publication dates wherever available.
* Do not fabricate research findings, statistics, datasets, or references.
* Clearly distinguish verified facts from assumptions and recommendations.
* Identify limitations and uncertainties.
* Use simple, understandable technical language.
* Avoid unnecessary information that does not contribute to our project.

## 4. Maintain prompt.md
The file prompt.md will be our permanent project instruction and development history document.
Initially, add:
* Project name: AquaGuard AI.
* Project title: Fish Disease Risk Detection and Early Warning System.
* Problem statement.
* Proposed solution.
* Project objectives.
* Target users.
* Planned technology stack:
  * React.js
  * Bootstrap 5
  * Python
  * FastAPI
  * Supabase
  * TensorFlow / Scikit-learn
* Research status.
* Current development phase: Research.
* Important decisions and unresolved questions.

### Important rule for future work
Whenever we make a major project decision, finalize a feature, change the architecture, select a dataset, or complete a development phase, update prompt.md.
Keep it as the single source of truth for our project.
Do not overwrite previous important decisions. Maintain a clear project history.

## 5. Final Report
After completing the research:
1. Save every research document in the research/ folder.
2. Update prompt.md with a summary of the findings.
3. Provide a concise summary of the most important findings.
4. Recommend the best technical approach.
5. Identify the most feasible hackathon MVP.
6. List the next development tasks.

Important: Do not start application development until the research is completed and the proposed solution is documented.
```

---

## Action Taken & Deliverables Generated

1. Created 8 comprehensive research reports under `research/`:
   * `research/problem_analysis.md`
   * `research/existing_solutions.md`
   * `research/fish_diseases_research.md`
   * `research/dataset_research.md`
   * `research/ai_ml_approach.md`
   * `research/proposed_solution.md`
   * `research/feasibility_analysis.md`
   * `research/references.md`
2. Formatted and initialized the primary Single Source of Truth document `prompt.md` covering project identity, problem statement, objectives, technology stack, decision log, and hackathon scope.
3. Formulated the core ML approach: MobileNetV3-Large for computer vision, Random Forest + FAO deterministic guardrails for water quality, and decoupled mathematical multimodal risk fusion.

