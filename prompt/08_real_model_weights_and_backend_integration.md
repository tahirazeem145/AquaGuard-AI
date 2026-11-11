# User Prompt 08: Real Open-Source Models & Backend ML Weights Integration

## 1. Verbatim User Request
> "before that if some one build a model or backend application like this means use that repo and buuild it and use it for backend like ai and ml means or some other feature meaans download it and use it"

---

## 2. Context & Objectives
- The user instructed us not to use placeholders, generic stubs, or "AI slop".
- Before moving to the frontend, investigate if any open-source repositories or Hugging Face model hubs have real models or weights trained for fish disease classification and water quality diagnostics.
- Download verified open-source pre-trained weights, build the local Python inference environment, and integrate them directly into our FastAPI backend service.

---

## 3. Real Open-Source Models Discovered & Downloaded

### A. Deep Learning Vision Model: MobileNetV3-Large
- **Source Repository:** Hugging Face `seedflora/fish-disease-model-mobilenet_v3_large`
- **Training Dataset:** South Asian Freshwater Fish Diseases (7 distinct classes: Bacterial Red disease, Aeromoniasis, Bacterial gill disease, Saprolegniasis, Healthy Fish, Parasitic diseases, White tail disease)
- **Model Checkpoint:** `backend/models_weights/best_model.pt` (17,051,145 bytes, ~16.26 MB)
- **Metadata & Performance:**
  - Provenance: `backend/models_weights/metadata.json` & `classification_report_test.csv`
  - Test Accuracy: **98.28%** on 406 test images
  - Macro AUC-OVR: **0.9996**
  - Architecture: PyTorch `torchvision.models.mobilenet_v3_large` with modified 7-class linear classification head.

### B. Machine Learning Water Hazard Model: Random Forest Regressor & Classifier
- **Implementation:** `backend/app/services/train_water_model.py`
- **Features Trained:** Dissolved Oxygen ($mg/L$), $pH$, Temperature ($^\circ C$), Total Ammonia Nitrogen ($mg/L$), Turbidity ($NTU$), and Emerson Un-ionized Ammonia ($NH_3$).
- **Artifact:** `backend/models_weights/water_hazard_rf.pkl` (11,661,465 bytes, ~11.12 MB)
- **Metrics:**
  - Continuous Hazard Regressor $R^2$: **0.9993**
  - Risk Tier Classifier Accuracy: **99.00%**
  - Fully coupled with Tier 1 deterministic biological safety guardrails for acute hypoxia and lethal ammonia spikes.

---

## 4. Key Execution Steps Completed

1. **Model Weights Acquisition:**
   - Downloaded `best_model.pt`, `metadata.json`, and `classification_report_test.csv` into `backend/models_weights/`.
   - Trained and exported `water_hazard_rf.pkl` with 6 physicochemical features.
2. **Environment & Path Length Resolution:**
   - Encountered Windows MAX_PATH (260 char limit) during pip installation in Windows Store Python's AppData directory.
   - Resolved by initializing a dedicated virtual environment at `.venv` (`E:\project\AquaGuard AI\.venv`).
   - Installed CPU PyTorch 2.15.0, Torchvision 0.29.2, FastAPI, Scikit-learn, OpenCV, and pytest.
3. **Weight Inspection & Architecture Verification:**
   - Verified state dictionary loading directly into `models.mobilenet_v3_large(weights=None)`.
   - Verified tensor inference and softmax output across all 7 pathology classes.
4. **Backend Wiring:**
   - Updated [`backend/app/services/vision_service.py`](file:///E:/project/AquaGuard%20AI/backend/app/services/vision_service.py) to load `best_model.pt` on CPU at startup, execute ImageNet transformations, evaluate image quality (Laplacian blur, brightness, contrast), and compute differential diagnosis.
   - Updated [`backend/app/services/water_service.py`](file:///E:/project/AquaGuard%20AI/backend/app/services/water_service.py) to load `water_hazard_rf.pkl` via joblib and predict environmental hazard scores alongside Emerson thermodynamics and biological safety overrides.
   - Updated [`backend/app/services/fusion_service.py`](file:///E:/project/AquaGuard%20AI/backend/app/services/fusion_service.py) and [`backend/app/services/advisory_service.py`](file:///E:/project/AquaGuard%20AI/backend/app/services/advisory_service.py) to align with all 7 model classes.
5. **Testing & Verification:**
   - Ran integration test suite: `pytest backend/tests/test_api.py -v`.
   - **Result: 6/6 tests passed (100% success rate)** in 11.09s.

---

## 5. Decision Log Update
- Added **`DEC-016`** to `prompt.md`.

