#!/usr/bin/env python3
"""
Logistic Regression Model Training Script
Classifies weather conditions (Rain/No Rain, Cloudy/Clear)
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib
import os

def train_logistic_regression():
    # Load dataset
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'weather_dataset.csv')
    df = pd.read_csv(data_path)
    
    # Features
    features = ['temperature', 'humidity', 'pressure', 'wind_speed', 'clouds']
    X = df[features]
    
    # Train model for rain prediction
    y_rain = df['rain']
    X_train_rain, X_test_rain, y_train_rain, y_test_rain = train_test_split(
        X, y_rain, test_size=0.2, random_state=42
    )
    
    rain_model = LogisticRegression(random_state=42, max_iter=1000)
    rain_model.fit(X_train_rain, y_train_rain)
    y_pred_rain = rain_model.predict(X_test_rain)
    
    # Train model for cloudiness prediction
    y_cloudiness = df['cloudiness']
    X_train_cloud, X_test_cloud, y_train_cloud, y_test_cloud = train_test_split(
        X, y_cloudiness, test_size=0.2, random_state=42
    )
    
    cloud_model = LogisticRegression(random_state=42, max_iter=1000)
    cloud_model.fit(X_train_cloud, y_train_cloud)
    y_pred_cloud = cloud_model.predict(X_test_cloud)
    
    # Calculate metrics for rain model
    rain_metrics = {
        'accuracy': accuracy_score(y_test_rain, y_pred_rain),
        'precision': precision_score(y_test_rain, y_pred_rain, zero_division=0),
        'recall': recall_score(y_test_rain, y_pred_rain, zero_division=0),
        'f1_score': f1_score(y_test_rain, y_pred_rain, zero_division=0)
    }
    
    rain_cm = confusion_matrix(y_test_rain, y_pred_rain)
    rain_confusion = {
        'true_positive': int(rain_cm[1][1]) if rain_cm.shape == (2, 2) else 0,
        'true_negative': int(rain_cm[0][0]) if rain_cm.shape == (2, 2) else 0,
        'false_positive': int(rain_cm[0][1]) if rain_cm.shape == (2, 2) else 0,
        'false_negative': int(rain_cm[1][0]) if rain_cm.shape == (2, 2) else 0
    }
    
    # Save models and metrics
    model_dir = os.path.dirname(__file__)
    joblib.dump(rain_model, os.path.join(model_dir, 'logistic_rain_model.pkl'))
    joblib.dump(cloud_model, os.path.join(model_dir, 'logistic_cloud_model.pkl'))
    joblib.dump(rain_metrics, os.path.join(model_dir, 'logistic_metrics.pkl'))
    joblib.dump(rain_confusion, os.path.join(model_dir, 'logistic_confusion.pkl'))
    
    print(f"Logistic Regression Models Trained Successfully!")
    print(f"Rain Model - Accuracy: {rain_metrics['accuracy']*100:.1f}%")
    print(f"Rain Model - Precision: {rain_metrics['precision']*100:.1f}%")
    print(f"Rain Model - Recall: {rain_metrics['recall']*100:.1f}%")
    print(f"Rain Model - F1 Score: {rain_metrics['f1_score']:.3f}")
    
    return rain_model, cloud_model, rain_metrics, rain_confusion

if __name__ == "__main__":
    train_logistic_regression()
