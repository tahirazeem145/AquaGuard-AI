---
name: ml-inference-pipeline
description: Best practices for serving machine learning models (TensorFlow/Keras, ONNX Runtime, and Scikit-learn) in production Python environments. Focuses on low-latency CPU inference, image preprocessing (CLAHE, normalization), tabular feature engineering, deterministic guardrails, and thread-safe singleton model loaders.
license: MIT
---

# ML Inference Pipeline Skill

This skill provides operational patterns for serving computer vision and tabular machine learning models on resource-constrained CPU environments (e.g. cloud free-tiers, edge instances).

## 1. Core Principles

1. **Lazy Singleton Model Loading:** Load model weights into memory exactly once at application startup (`@asynccontextmanager` in FastAPI). Never reload weights on every request.
2. **CPU-Optimized Inference:** For hackathon deployments, target ONNX Runtime or lightweight TensorFlow/Keras runtime with single-thread CPU execution to achieve $< 35\text{ ms}$ latency.
3. **Robust Preprocessing Pipeline:** Mirror training-time image transformations identically (resizing, standardization, CLAHE contrast enhancement).
4. **Deterministic Biological Guardrails:** Never let an ML model alone predict "Safe" if physical sensor thresholds violate lethal limits (e.g., Dissolved Oxygen $< 2.0\text{ mg/L}$). Always apply an explicit deterministic override.

---

## 2. Preprocessing Architecture

```text
Input Image (RGB) ──> [Resize 224x224] ──> [CLAHE Enhancement] ──> [Normalize [-1, 1]] ──> [Tensor Shape (1, 224, 224, 3)]
                                                                                                      │
                                                                                                      ▼
                                                                                         [MobileNetV3 Forward Pass]
                                                                                                      │
                                                                                                      ▼
                                                                                           [Softmax Probabilities]
```

### 2.1 CLAHE Enhancement for Murky/Underwater Imagery
```python
import cv2
import numpy as np

def apply_clahe_rgb(image_np: np.ndarray) -> np.ndarray:
    """Enhance contrast in LAB color space to reveal pale ulcers and spots."""
    lab = cv2.cvtColor(image_np, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)
```

### 2.2 Singleton Model Manager Pattern
```python
import os
import joblib
import tensorflow as tf

class ModelRegistry:
    _instance = None
    
    def __init__(self):
        self.vision_model = None
        self.water_model = None
        self.class_names = [
            "Healthy Fish",
            "Ichthyophthiriasis (White Spot)",
            "Fin and Tail Rot",
            "Columnaris Disease",
            "Saprolegniasis (Water Mold)",
            "Dropsy / Ascites",
            "Epizootic Ulcerative Syndrome (EUS)"
        ]

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_models(self, weights_dir: str):
        vision_path = os.path.join(weights_dir, "mobilenetv3_fish_disease.keras")
        water_path = os.path.join(weights_dir, "water_hazard_rf.pkl")
        
        self.vision_model = tf.keras.models.load_model(vision_path)
        self.water_model = joblib.load(water_path)
```

---

## 3. Multimodal Risk Fusion Formulation

$$R_{pond} = \min\left(100, \; 0.55 \cdot (P_{max} \times 100) + 0.45 \cdot H_{env} + S(C_{disease}, \mathbf{X}_{env})\right)$$

### Biological Synergy Matrix:
```python
def compute_biological_synergy(disease: str, telemetry: dict) -> float:
    do = telemetry.get("dissolved_oxygen_mg_l", 6.0)
    temp = telemetry.get("temperature_c", 25.0)
    ammonia = telemetry.get("un_ionized_ammonia_mg_l", 0.01)
    ph = telemetry.get("ph", 7.4)

    bonus = 0.0
    # Columnaris escalates in warm alkaline water
    if "Columnaris" in disease and temp > 26.0 and ph > 8.0:
        bonus += 20.0
    # Saprolegniasis exploits cold-water immunosuppression
    elif "Saprolegniasis" in disease and temp < 18.0:
        bonus += 15.0
    # Aeromonas/Fin rot explodes under ammonia stress + hypoxia
    elif "Fin" in disease and (ammonia > 0.05 or do < 3.5):
        bonus += 25.0
    # White spot escalates after thermal shocks
    elif "Ichthyophthiriasis" in disease and temp < 22.0:
        bonus += 15.0
    elif "Healthy" in disease and do > 5.5 and ammonia < 0.02:
        bonus -= 10.0

    return max(0.0, bonus)
```

