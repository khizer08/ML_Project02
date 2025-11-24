#!/usr/bin/env python3
"""
Standalone script for dataset statistics
Called from Express API
"""

import json
from predict import get_dataset_stats

if __name__ == "__main__":
    try:
        result = get_dataset_stats()
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        import sys
        sys.exit(1)
