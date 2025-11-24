#!/usr/bin/env python3
"""
Standalone script for logistic regression predictions
Called from Express API
"""

import sys
import json
from predict import classify_weather

if __name__ == "__main__":
    if len(sys.argv) != 6:
        print(json.dumps({"error": "Invalid arguments"}))
        sys.exit(1)
    
    try:
        temperature = float(sys.argv[1])
        humidity = float(sys.argv[2])
        pressure = float(sys.argv[3])
        wind_speed = float(sys.argv[4])
        clouds = float(sys.argv[5])
        
        result = classify_weather(temperature, humidity, pressure, wind_speed, clouds)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
