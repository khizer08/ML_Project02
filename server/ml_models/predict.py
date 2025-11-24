#!/usr/bin/env python3
"""
ML Prediction Functions
Load trained models and make predictions
"""

import pandas as pd
import numpy as np
import joblib
import os
import json

def load_models():
    """Load all trained models and metrics"""
    model_dir = os.path.dirname(__file__)
    
    try:
        linear_model = joblib.load(os.path.join(model_dir, 'linear_regression_model.pkl'))
        linear_metrics = joblib.load(os.path.join(model_dir, 'linear_regression_metrics.pkl'))
        
        rain_model = joblib.load(os.path.join(model_dir, 'logistic_rain_model.pkl'))
        cloud_model = joblib.load(os.path.join(model_dir, 'logistic_cloud_model.pkl'))
        logistic_metrics = joblib.load(os.path.join(model_dir, 'logistic_metrics.pkl'))
        logistic_confusion = joblib.load(os.path.join(model_dir, 'logistic_confusion.pkl'))
        
        return {
            'linear': linear_model,
            'linear_metrics': linear_metrics,
            'rain': rain_model,
            'cloud': cloud_model,
            'logistic_metrics': logistic_metrics,
            'logistic_confusion': logistic_confusion
        }
    except FileNotFoundError:
        return None

def predict_temperature(humidity, pressure, wind_speed, clouds):
    """Predict temperature using linear regression"""
    models = load_models()
    if not models:
        raise Exception("Models not trained. Please train models first.")
    
    # Create input dataframe
    input_data = pd.DataFrame({
        'humidity': [humidity],
        'pressure': [pressure],
        'wind_speed': [wind_speed],
        'clouds': [clouds]
    })
    
    # Make prediction
    prediction = models['linear'].predict(input_data)[0]
    
    return {
        'predicted_temperature': float(prediction),
        'metrics': {
            'rmse': float(models['linear_metrics']['rmse']),
            'mse': float(models['linear_metrics']['mse']),
            'r2_score': float(models['linear_metrics']['r2_score'])
        }
    }

def classify_weather(temperature, humidity, pressure, wind_speed, clouds):
    """Classify weather conditions using logistic regression"""
    models = load_models()
    if not models:
        raise Exception("Models not trained. Please train models first.")
    
    # Create input dataframe
    input_data = pd.DataFrame({
        'temperature': [temperature],
        'humidity': [humidity],
        'pressure': [pressure],
        'wind_speed': [wind_speed],
        'clouds': [clouds]
    })
    
    # Make predictions
    rain_pred = models['rain'].predict(input_data)[0]
    rain_proba = models['rain'].predict_proba(input_data)[0]
    
    cloud_pred = models['cloud'].predict(input_data)[0]
    cloud_proba = models['cloud'].predict_proba(input_data)[0]
    
    return {
        'rain_prediction': 'Rain' if rain_pred == 1 else 'No Rain',
        'rain_probability': float(rain_proba[1] if rain_pred == 1 else rain_proba[0]),
        'cloudiness_prediction': 'Cloudy' if cloud_pred == 1 else 'Clear',
        'cloudiness_probability': float(cloud_proba[1] if cloud_pred == 1 else cloud_proba[0]),
        'metrics': {
            'accuracy': float(models['logistic_metrics']['accuracy']),
            'precision': float(models['logistic_metrics']['precision']),
            'recall': float(models['logistic_metrics']['recall']),
            'f1_score': float(models['logistic_metrics']['f1_score'])
        },
        'confusion_matrix': {
            'true_positive': int(models['logistic_confusion']['true_positive']),
            'true_negative': int(models['logistic_confusion']['true_negative']),
            'false_positive': int(models['logistic_confusion']['false_positive']),
            'false_negative': int(models['logistic_confusion']['false_negative'])
        }
    }

def get_dataset_stats():
    """Get statistics about the training dataset"""
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'weather_dataset.csv')
    df = pd.read_csv(data_path)
    
    features = list(df.columns)
    statistics = {}
    
    for feature in features:
        if df[feature].dtype in ['int64', 'float64']:
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

if __name__ == "__main__":
    # Test predictions
    print("Testing Linear Regression...")
    temp_result = predict_temperature(70, 1013, 5, 50)
    print(json.dumps(temp_result, indent=2))
    
    print("\nTesting Logistic Regression...")
    weather_result = classify_weather(22, 70, 1013, 5, 50)
    print(json.dumps(weather_result, indent=2))
    
    print("\nGetting Dataset Stats...")
    stats = get_dataset_stats()
    print(f"Total Records: {stats['total_records']}")
    print(f"Features: {', '.join(stats['features'])}")
