#!/usr/bin/env python
"""Execute the Day 7 ML validation notebook"""

import subprocess
import sys
import os
from pathlib import Path

os.chdir(r'd:\CustomerIQ')

print("=" * 70)
print("DAY 7 ML VALIDATION NOTEBOOK EXECUTION")
print("=" * 70)
print(f"Working directory: {os.getcwd()}")
print(f"Notebook path: Notebook/07_ml_validation.ipynb")
print("=" * 70 + "\n")

# Execute notebook using nbconvert
result = subprocess.run(
    [
        sys.executable, "-m", "nbconvert",
        "--to", "notebook",
        "--execute",
        "--inplace",
        "--ExecutePreprocessor.timeout=600",
        "Notebook/07_ml_validation.ipynb"
    ],
    capture_output=True,
    text=True
)

print("EXECUTION OUTPUT:")
print(result.stdout)

if result.stderr:
    print("\nERRORS/WARNINGS:")
    print(result.stderr)

print(f"\nReturn code: {result.returncode}")

if result.returncode == 0:
    print("\n✓ Notebook executed successfully")
else:
    print("\n✗ Notebook execution failed")
    sys.exit(1)
