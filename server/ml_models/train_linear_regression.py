#!/usr/bin/env python3
"""
Linear Regression Model Training Script
Predicts temperature based on weather features
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

def train_linear_regression():
    # Load dataset
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'weather_dataset.csv')
    df = pd.read_csv(data_path)
    
    # Features and target
    features = ['humidity', 'pressure', 'wind_speed', 'clouds']
    X = df[features]
    y = df['temperature']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    # Save model and metrics
    model_dir = os.path.dirname(__file__)
    joblib.dump(model, os.path.join(model_dir, 'linear_regression_model.pkl'))
    
    metrics = {
        'mse': mse,
        'rmse': rmse,
        'r2_score': r2
    }
    joblib.dump(metrics, os.path.join(model_dir, 'linear_regression_metrics.pkl'))
    
    print(f"Linear Regression Model Trained Successfully!")
    print(f"RMSE: {rmse:.2f}")
    print(f"MSE: {mse:.2f}")
    print(f"R² Score: {r2:.3f}")
    
    return model, metrics

if __name__ == "__main__":
    train_linear_regression()
