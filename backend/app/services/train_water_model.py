import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, accuracy_score

def calculate_nh3(tan: float, temp: float, ph: float) -> float:
    """Emerson et al. aqueous ammonia thermodynamics."""
    temp_k = temp + 273.15
    pka = 0.09018 + (2729.92 / temp_k)
    fraction = 1.0 / (10 ** (pka - ph) + 1.0)
    return tan * fraction

def compute_hazard_ground_truth(do: float, ph: float, temp: float, nh3: float, turb: float) -> float:
    """Computes reference environmental hazard score (0 - 100) based on FAO criteria."""
    penalty = 0.0

    # DO penalties
    if do < 2.0:
        penalty += 50.0 + (2.0 - do) * 15.0
    elif do < 3.5:
        penalty += 35.0 + (3.5 - do) * 10.0
    elif do < 5.0:
        penalty += 15.0 + (5.0 - do) * 5.0

    # pH penalties
    if ph < 6.0:
        penalty += 35.0 + (6.0 - ph) * 15.0
    elif ph < 6.8:
        penalty += 15.0 + (6.8 - ph) * 8.0
    elif ph > 8.8:
        penalty += 35.0 + (ph - 8.8) * 15.0
    elif ph > 8.2:
        penalty += 15.0 + (ph - 8.2) * 8.0

    # Temperature penalties
    if temp < 18.0:
        penalty += 20.0 + (18.0 - temp) * 2.0
    elif temp > 32.0:
        penalty += 20.0 + (temp - 32.0) * 3.0

    # Ammonia NH3 penalties
    if nh3 > 0.08:
        penalty += 45.0 + (nh3 - 0.08) * 200.0
    elif nh3 > 0.025:
        penalty += 20.0 + (nh3 - 0.025) * 150.0

    # Turbidity penalty
    if turb > 100.0:
        penalty += 10.0 + min(15.0, (turb - 100.0) * 0.1)

    return min(100.0, max(0.0, penalty))

def generate_aquaculture_dataset(n_samples: int = 6000):
    """Generates synthetic dataset mirroring real pond sensor logs."""
    np.random.seed(42)

    # Realistic parameter distributions
    # 70% normal, 15% hypoxia/temp stress, 15% ammonia/pH stress
    dos = np.concatenate([
        np.random.uniform(5.0, 9.0, int(n_samples * 0.65)),
        np.random.uniform(1.2, 4.0, int(n_samples * 0.20)),
        np.random.uniform(3.5, 6.0, int(n_samples * 0.15))
    ])
    phs = np.concatenate([
        np.random.uniform(6.8, 8.2, int(n_samples * 0.70)),
        np.random.uniform(5.2, 6.7, int(n_samples * 0.15)),
        np.random.uniform(8.3, 9.8, int(n_samples * 0.15))
    ])
    temps = np.concatenate([
        np.random.uniform(24.0, 30.0, int(n_samples * 0.70)),
        np.random.uniform(14.0, 23.0, int(n_samples * 0.15)),
        np.random.uniform(31.0, 38.0, int(n_samples * 0.15))
    ])
    tans = np.concatenate([
        np.random.uniform(0.01, 0.2, int(n_samples * 0.70)),
        np.random.uniform(0.2, 1.5, int(n_samples * 0.20)),
        np.random.uniform(1.5, 4.0, int(n_samples * 0.10))
    ])
    turbs = np.random.uniform(10.0, 150.0, n_samples)

    X = []
    y_reg = []
    y_clf = []

    for do, ph, temp, tan, turb in zip(dos, phs, temps, tans, turbs):
        nh3 = calculate_nh3(tan, temp, ph)
        score = compute_hazard_ground_truth(do, ph, temp, nh3, turb)

        if score >= 80.0:
            tier = "EMERGENCY"
        elif score >= 55.0:
            tier = "WARNING"
        elif score >= 25.0:
            tier = "ADVISORY"
        else:
            tier = "NORMAL"

        X.append([do, ph, temp, tan, turb, nh3])
        y_reg.append(score)
        y_clf.append(tier)

    return np.array(X), np.array(y_reg), np.array(y_clf)

def train_and_export():
    print("Generating 6,000 aquaculture telemetry records based on FAO & Emerson standards...")
    X, y_reg, y_clf = generate_aquaculture_dataset(6000)

    X_train, X_test, y_train_reg, y_test_reg, y_train_clf, y_test_clf = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42
    )

    print("Training Random Forest Regressor & Classifier...")
    rf_regressor = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_regressor.fit(X_train, y_train_reg)

    rf_classifier = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_classifier.fit(X_train, y_train_clf)

    # Evaluate
    preds_reg = rf_regressor.predict(X_test)
    preds_clf = rf_classifier.predict(X_test)

    r2 = r2_score(y_test_reg, preds_reg)
    acc = accuracy_score(y_test_clf, preds_clf)

    print(f"Validation R^2 Score: {r2:.4f}")
    print(f"Validation Classification Accuracy: {acc * 100:.2f}%")

    # Feature Importance
    feature_names = ["DO_mg_l", "pH", "Temp_C", "TAN_mg_l", "Turbidity_NTU", "NH3_mg_l"]
    importances = dict(zip(feature_names, rf_regressor.feature_importances_))
    print("Feature Importances:", importances)

    # Export bundle
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "models_weights")
    os.makedirs(output_dir, exist_ok=True)
    bundle_path = os.path.join(output_dir, "water_hazard_rf.pkl")

    model_bundle = {
        "regressor": rf_regressor,
        "classifier": rf_classifier,
        "features": feature_names,
        "r2_score": r2,
        "accuracy": acc
    }

    joblib.dump(model_bundle, bundle_path)
    print(f"Model bundle saved to: {bundle_path} ({os.path.getsize(bundle_path) / (1024 * 1024):.2f} MB)")

if __name__ == "__main__":
    train_and_export()

