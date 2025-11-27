# #!/usr/bin/env python3
# """
# ML Prediction Functions
# Load trained models and make predictions
# """

# import pandas as pd
# import numpy as np
# import joblib
# import os
# import json

# def load_models():
#     """Load all trained models and metrics"""
#     model_dir = os.path.dirname(__file__)
    
#     try:
#         linear_model = joblib.load(os.path.join(model_dir, 'linear_regression_model.pkl'))
#         linear_metrics = joblib.load(os.path.join(model_dir, 'linear_regression_metrics.pkl'))
        
#         rain_model = joblib.load(os.path.join(model_dir, 'logistic_rain_model.pkl'))
#         cloud_model = joblib.load(os.path.join(model_dir, 'logistic_cloud_model.pkl'))
#         logistic_metrics = joblib.load(os.path.join(model_dir, 'logistic_metrics.pkl'))
#         logistic_confusion = joblib.load(os.path.join(model_dir, 'logistic_confusion.pkl'))
        
#         return {
#             'linear': linear_model,
#             'linear_metrics': linear_metrics,
#             'rain': rain_model,
#             'cloud': cloud_model,
#             'logistic_metrics': logistic_metrics,
#             'logistic_confusion': logistic_confusion
#         }
#     except FileNotFoundError:
#         return None

# def predict_temperature(humidity, pressure, wind_speed, clouds):
#     """Predict temperature using linear regression"""
#     models = load_models()
#     if not models:
#         raise Exception("Models not trained. Please train models first.")
    
#     # Create input dataframe
#     input_data = pd.DataFrame({
#         'humidity': [humidity],
#         'pressure': [pressure],
#         'wind_speed': [wind_speed],
#         'clouds': [clouds]
#     })
    
#     # Make prediction
#     prediction = models['linear'].predict(input_data)[0]
    
#     return {
#         'predicted_temperature': float(prediction),
#         'metrics': {
#             'rmse': float(models['linear_metrics']['rmse']),
#             'mse': float(models['linear_metrics']['mse']),
#             'r2_score': float(models['linear_metrics']['r2_score'])
#         }
#     }

# def classify_weather(temperature, humidity, pressure, wind_speed, clouds):
#     """Classify weather conditions using logistic regression"""
#     models = load_models()
#     if not models:
#         raise Exception("Models not trained. Please train models first.")
    
#     # Create input dataframe
#     input_data = pd.DataFrame({
#         'temperature': [temperature],
#         'humidity': [humidity],
#         'pressure': [pressure],
#         'wind_speed': [wind_speed],
#         'clouds': [clouds]
#     })
    
#     # Make predictions
#     rain_pred = models['rain'].predict(input_data)[0]
#     rain_proba = models['rain'].predict_proba(input_data)[0]
    
#     cloud_pred = models['cloud'].predict(input_data)[0]
#     cloud_proba = models['cloud'].predict_proba(input_data)[0]
    
#     return {
#         'rain_prediction': 'Rain' if rain_pred == 1 else 'No Rain',
#         'rain_probability': float(rain_proba[1] if rain_pred == 1 else rain_proba[0]),
#         'cloudiness_prediction': 'Cloudy' if cloud_pred == 1 else 'Clear',
#         'cloudiness_probability': float(cloud_proba[1] if cloud_pred == 1 else cloud_proba[0]),
#         'metrics': {
#             'accuracy': float(models['logistic_metrics']['accuracy']),
#             'precision': float(models['logistic_metrics']['precision']),
#             'recall': float(models['logistic_metrics']['recall']),
#             'f1_score': float(models['logistic_metrics']['f1_score'])
#         },
#         'confusion_matrix': {
#             'true_positive': int(models['logistic_confusion']['true_positive']),
#             'true_negative': int(models['logistic_confusion']['true_negative']),
#             'false_positive': int(models['logistic_confusion']['false_positive']),
#             'false_negative': int(models['logistic_confusion']['false_negative'])
#         }
#     }

# def get_dataset_stats():
#     """Get statistics about the training dataset"""
#     data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'weather_dataset.csv')
#     df = pd.read_csv(data_path)
    
#     features = list(df.columns)
#     statistics = {}
    
#     for feature in features:
#         if df[feature].dtype in ['int64', 'float64']:
#             statistics[feature] = {
#                 'mean': float(df[feature].mean()),
#                 'median': float(df[feature].median()),
#                 'std': float(df[feature].std()),
#                 'min': float(df[feature].min()),
#                 'max': float(df[feature].max())
#             }
    
#     sample_data = df.head(10).to_dict('records')
    
#     return {
#         'total_records': int(len(df)),
#         'features': features,
#         'statistics': statistics,
#         'sample_data': sample_data
#     }

# if __name__ == "__main__":
#     # Test predictions
#     print("Testing Linear Regression...")
#     temp_result = predict_temperature(70, 1013, 5, 50)
#     print(json.dumps(temp_result, indent=2))
    
#     print("\nTesting Logistic Regression...")
#     weather_result = classify_weather(22, 70, 1013, 5, 50)
#     print(json.dumps(weather_result, indent=2))
    
#     print("\nGetting Dataset Stats...")
#     stats = get_dataset_stats()
#     print(f"Total Records: {stats['total_records']}")
#     print(f"Features: {', '.join(stats['features'])}")


#!/usr/bin/env python3
"""
Robust ML prediction helpers for weather project.

Drop-in replacement for your current predict.py / ML module.
"""

import os
import joblib
import json
import numpy as np
import pandas as pd
from typing import Optional, Dict, Any

def _debug_print(msg: str):
    # prints to stderr so CLI JSON outputs are unaffected
    import sys
    print("[predict.py] " + msg, file=sys.stderr)

def _possible_model_dirs():
    # Order: env var, ./models, sibling models folder, script dir
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = []
    env = os.getenv("WEATHER_MODEL_DIR")
    if env:
        candidates.append(os.path.abspath(env))
    # common project-level models folder
    candidates.append(os.path.abspath(os.path.join(script_dir, "models")))
    # parent-level models folder (if predict.py inside package)
    candidates.append(os.path.abspath(os.path.join(script_dir, "..", "models")))
    # fallback: script dir
    candidates.append(script_dir)
    # make unique preserving order
    seen = set()
    out = []
    for c in candidates:
        if c not in seen:
            seen.add(c); out.append(c)
    return out

def _find_file_in_dirs(filename: str) -> Optional[str]:
    for d in _possible_model_dirs():
        path = os.path.join(d, filename)
        if os.path.exists(path):
            return path
    return None

def load_models(verbose: bool=True) -> Optional[Dict[str, Any]]:
    """
    Attempt to load model and metric files from likely locations.
    Returns a dict with models and metrics or raises FileNotFoundError with details.
    """
    files_to_find = {
        "linear": "linear_regression_model.pkl",
        "linear_metrics": "linear_regression_metrics.pkl",
        "rain": "logistic_rain_model.pkl",
        "cloud": "logistic_cloud_model.pkl",
        "logistic_metrics": "logistic_metrics.pkl",
        "logistic_confusion": "logistic_confusion.pkl"
    }

    found_paths = {}
    missing = []
    for key, fname in files_to_find.items():
        p = _find_file_in_dirs(fname)
        if p:
            found_paths[key] = p
        else:
            missing.append(fname)

    if missing:
        # helpful diagnostic for the user
        err = {"error": "Missing model/metric files", "missing_files": missing, "searched_dirs": _possible_model_dirs()}
        if verbose:
            _debug_print("Missing files: " + ", ".join(missing))
            _debug_print("Searched dirs: " + repr(_possible_model_dirs()))
        raise FileNotFoundError(json.dumps(err))

    # load each file, but do it individually to surface specific errors
    try:
        linear_model = joblib.load(found_paths["linear"])
        linear_metrics = joblib.load(found_paths["linear_metrics"])

        rain_model = joblib.load(found_paths["rain"])
        cloud_model = joblib.load(found_paths["cloud"])
        logistic_metrics = joblib.load(found_paths["logistic_metrics"])
        logistic_confusion = joblib.load(found_paths["logistic_confusion"])
    except Exception as e:
        _debug_print("Error loading a model/metric: " + str(e))
        raise

    if verbose:
        _debug_print("Loaded models from: " + ", ".join(set(os.path.dirname(p) for p in found_paths.values())))

    return {
        "linear": linear_model,
        "linear_metrics": linear_metrics,
        "rain": rain_model,
        "cloud": cloud_model,
        "logistic_metrics": logistic_metrics,
        "logistic_confusion": logistic_confusion
    }

def _make_input_df(temperature=None, humidity=None, pressure=None, wind_speed=None, clouds=None, *, for_temp=False):
    if for_temp:
        return pd.DataFrame({
            'humidity': [humidity],
            'pressure': [pressure],
            'wind_speed': [wind_speed],
            'clouds': [clouds]
        })
    else:
        return pd.DataFrame({
            'temperature': [temperature],
            'humidity': [humidity],
            'pressure': [pressure],
            'wind_speed': [wind_speed],
            'clouds': [clouds]
        })

def predict_temperature(humidity, pressure, wind_speed, clouds):
    models = load_models()
    if not models:
        raise Exception("Models not available")

    input_data = _make_input_df(humidity=humidity, pressure=pressure, wind_speed=wind_speed, clouds=clouds, for_temp=True)

    # Some scikit pipelines require the exact feature order or a numpy array — coerce to same type used for training if known.
    try:
        pred = models['linear'].predict(input_data)
    except Exception as e:
        # try using numpy array (fallback)
        _debug_print("Linear model predict failed with DataFrame; trying numpy array fallback: " + str(e))
        arr = input_data.values
        pred = models['linear'].predict(arr)

    prediction = float(pred[0])
    metrics = models.get('linear_metrics', {})
    return {
        'predicted_temperature': prediction,
        'metrics': {
            'rmse': float(metrics.get('rmse', float("nan"))),
            'mse': float(metrics.get('mse', float("nan"))),
            'r2_score': float(metrics.get('r2_score', float("nan")))
        }
    }

def classify_weather(temperature, humidity, pressure, wind_speed, clouds):
    models = load_models()
    if not models:
        raise Exception("Models not available")

    input_data = _make_input_df(temperature=temperature, humidity=humidity, pressure=pressure, wind_speed=wind_speed, clouds=clouds, for_temp=False)

    def _predict_label_and_prob(clf, X):
        # try DataFrame first
        try:
            pred = clf.predict(X)[0]
            if hasattr(clf, "predict_proba"):
                proba_arr = clf.predict_proba(X)[0]
                # proba_arr is like [p0, p1] for binary
                if len(proba_arr) == 2:
                    prob_pos = float(proba_arr[1])
                    prob_neg = float(proba_arr[0])
                    return int(pred), prob_pos if int(pred) == 1 else prob_neg
                else:
                    # multiclass: return highest class prob
                    idx = int(pred)
                    return idx, float(proba_arr[idx])
            else:
                return int(pred), None
        except Exception as e:
            _debug_print("Classifier predict failed on DataFrame: " + str(e))
            # try as numpy
            arr = X.values
            pred = clf.predict(arr)[0]
            prob = None
            if hasattr(clf, "predict_proba"):
                proba_arr = clf.predict_proba(arr)[0]
                if len(proba_arr) == 2:
                    prob = float(proba_arr[int(pred)])
                else:
                    prob = float(proba_arr[int(pred)])
            return int(pred), prob

    rain_pred, rain_prob = _predict_label_and_prob(models['rain'], input_data)
    cloud_pred, cloud_prob = _predict_label_and_prob(models['cloud'], input_data)

    lm = models.get('logistic_metrics', {})
    lc = models.get('logistic_confusion', {})

    return {
        'rain_prediction': 'Rain' if rain_pred == 1 else 'No Rain',
        'rain_probability': float(rain_prob) if rain_prob is not None else None,
        'cloudiness_prediction': 'Cloudy' if cloud_pred == 1 else 'Clear',
        'cloudiness_probability': float(cloud_prob) if cloud_prob is not None else None,
        'metrics': {
            'accuracy': float(lm.get('accuracy', float("nan"))),
            'precision': float(lm.get('precision', float("nan"))),
            'recall': float(lm.get('recall', float("nan"))),
            'f1_score': float(lm.get('f1_score', float("nan")))
        },
        'confusion_matrix': {
            'true_positive': int(lc.get('true_positive', 0)),
            'true_negative': int(lc.get('true_negative', 0)),
            'false_positive': int(lc.get('false_positive', 0)),
            'false_negative': int(lc.get('false_negative', 0))
        }
    }

def get_dataset_stats():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # try a few data locations
    possible = [
        os.path.join(script_dir, "..", "data", "weather_dataset.csv"),
        os.path.join(script_dir, "data", "weather_dataset.csv"),
        os.path.join(script_dir, "..", "..", "data", "weather_dataset.csv")
    ]
    data_path = None
    for p in possible:
        if os.path.exists(p):
            data_path = p
            break
    if not data_path:
        raise FileNotFoundError("Could not find weather_dataset.csv in expected locations: " + ", ".join(possible))
    df = pd.read_csv(data_path)
    features = list(df.columns)
    statistics = {}
    for feature in features:
        if pd.api.types.is_numeric_dtype(df[feature]):
            statistics[feature] = {
                'mean': float(df[feature].mean()),
                'median': float(df[feature].median()),
                'std': float(df[feature].std()),
                'min': float(df[feature].min()),
                'max': float(df[feature].max())
            }
    sample_data = df.head(10).to_dict('records')
    return {
        'total_records': int(len(df)),
        'features': features,
        'statistics': statistics,
        'sample_data': sample_data
    }

# Optional small test harness when run directly
if __name__ == "__main__":
    try:
        _debug_print("Attempting to load models (verbose)...")
        mods = load_models()
        _debug_print("Models loaded OK.")
        print(json.dumps(predict_temperature(70, 1013, 5, 50), indent=2))
        print(json.dumps(classify_weather(22, 70, 1013, 5, 50), indent=2))
    except Exception as e:
        _debug_print("Fatal error: " + str(e))
        raise
