# # #!/usr/bin/env python3
# # """
# # Standalone script for logistic regression predictions
# # Called from Express API
# # """

# # import sys
# # import json
# # from predict import classify_weather

# # if __name__ == "__main__":
# #     if len(sys.argv) != 6:
# #         print(json.dumps({"error": "Invalid arguments"}))
# #         sys.exit(1)
    
# #     try:
# #         temperature = float(sys.argv[1])
# #         humidity = float(sys.argv[2])
# #         pressure = float(sys.argv[3])
# #         wind_speed = float(sys.argv[4])
# #         clouds = float(sys.argv[5])
        
# #         result = classify_weather(temperature, humidity, pressure, wind_speed, clouds)
# #         print(json.dumps(result))
        
# #     except Exception as e:
# #         print(json.dumps({"error": str(e)}))
# #         sys.exit(1)

# #!/usr/bin/env python3
# """
# Robust CLI for weather classification.
# Accepts 5 numeric args: temperature humidity pressure wind_speed clouds
# Prints JSON with prediction and probability (if available).
# """
# import sys
# import json
# import math
# import numpy as np

# from predict import classify_weather  # keep your existing import

# def respond(obj, exit_code=0):
#     print(json.dumps(obj))
#     sys.exit(exit_code)

# def parse_args(argv):
#     if len(argv) != 6:
#         respond({"error": "Invalid arguments. Usage: script.py temperature humidity pressure wind_speed clouds"}, 1)
#     try:
#         vals = [float(x) for x in argv[1:6]]
#     except ValueError:
#         respond({"error": "All five inputs must be numeric (float)."}, 1)
#     return vals

# if __name__ == "__main__":
#     try:
#         temp, hum, pres, wind, clouds = parse_args(sys.argv)
#         # optional simple sanity checks
#         if any(math.isinf(v) or math.isnan(v) for v in (temp, hum, pres, wind, clouds)):
#             respond({"error": "Inputs must be finite numbers (no NaN/Inf)."}, 1)

#         # Call classify_weather; allow it to return dict or simple value
#         result = classify_weather(temp, hum, pres, wind, clouds)

#         # normalize result to JSON-able dict
#         if isinstance(result, dict):
#             respond(result, 0)
#         else:
#             # if result is (label, prob) or label only
#             if isinstance(result, (list, tuple)) and len(result) >= 1:
#                 label = result[0]
#                 prob = result[1] if len(result) > 1 else None
#                 out = {"prediction": label}
#                 if prob is not None:
#                     try:
#                         out["probability"] = float(prob)
#                     except Exception:
#                         out["probability"] = prob
#                 respond(out, 0)
#             else:
#                 respond({"prediction": result}, 0)

#     except Exception as e:
#         # return the exception message — keep concise
#         respond({"error": str(e)}, 1)

# new code 


#!/usr/bin/env python3
"""
Robust CLI for weather classification.
Accepts 5 numeric args: temperature humidity pressure wind_speed clouds
Prints JSON with prediction and probability (if available).
"""

import os
import sys
import json
import math
import numpy as np

# --- make sure we can import predict.py from the parent folder (server/) ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
# ---------------------------------------------------------------------------

from predict import classify_weather


def respond(obj, exit_code=0):
    print(json.dumps(obj))
    sys.exit(exit_code)


def parse_args(argv):
    if len(argv) != 6:
        respond(
            {
                "error": "Invalid arguments. Usage: script.py "
                         "temperature humidity pressure wind_speed clouds"
            },
            1,
        )
    try:
        vals = [float(x) for x in argv[1:6]]
    except ValueError:
        respond({"error": "All five inputs must be numeric (float)."}, 1)
    return vals


if __name__ == "__main__":
    try:
        temp, hum, pres, wind, clouds = parse_args(sys.argv)

        # optional simple sanity checks
        if any(math.isinf(v) or math.isnan(v) for v in (temp, hum, pres, wind, clouds)):
            respond({"error": "Inputs must be finite numbers (no NaN/Inf)."}, 1)

        # Call classify_weather; allow it to return dict or simple value
        result = classify_weather(temp, hum, pres, wind, clouds)

        # normalize result to JSON-able dict
        if isinstance(result, dict):
            respond(result, 0)
        else:
            # if result is (label, prob) or label only
            if isinstance(result, (list, tuple)) and len(result) >= 1:
                label = result[0]
                prob = result[1] if len(result) > 1 else None
                out = {"prediction": label}
                if prob is not None:
                    try:
                        out["probability"] = float(prob)
                    except Exception:
                        out["probability"] = prob
                respond(out, 0)
            else:
                respond({"prediction": result}, 0)

    except Exception as e:
        respond({"error": str(e)}, 1)

