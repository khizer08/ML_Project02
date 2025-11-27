# #!/usr/bin/env python3
# """
# Standalone script for linear regression predictions
# Called from Express API
# """

# import sys
# import json
# from predict import predict_temperature

# if __name__ == "__main__":
#     if len(sys.argv) != 5:
#         print(json.dumps({"error": "Invalid arguments"}))
#         sys.exit(1)
    
#     try:
#         humidity = float(sys.argv[1])
#         pressure = float(sys.argv[2])
#         wind_speed = float(sys.argv[3])
#         clouds = float(sys.argv[4])
        
#         result = predict_temperature(humidity, pressure, wind_speed, clouds)
#         print(json.dumps(result))
        
#     except Exception as e:
#         print(json.dumps({"error": str(e)}))
#         sys.exit(1)

#!/usr/bin/env python3
"""
Standalone script for linear regression predictions
Called from Express API
"""

import os
import sys
import json

# --- make sure we can import predict.py from the parent folder (server/) ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
# ---------------------------------------------------------------------------

from predict import predict_temperature


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(json.dumps({"error": "Invalid arguments"}))
        sys.exit(1)

    try:
        humidity = float(sys.argv[1])
        pressure = float(sys.argv[2])
        wind_speed = float(sys.argv[3])
        clouds = float(sys.argv[4])

        result = predict_temperature(humidity, pressure, wind_speed, clouds)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

