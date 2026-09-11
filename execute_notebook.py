#!/usr/bin/env python
"""Execute Day 7 notebook using direct Python execution of cells"""

import json
import sys
import os
from pathlib import Path

os.chdir(r'd:\CustomerIQ')
print("Working directory:", os.getcwd())

# Load and execute notebook
notebook_path = Path('Notebook/07_ml_validation.ipynb')

with open(notebook_path, 'r', encoding='utf-8') as f:
    notebook = json.load(f)

# Execute code cells
cell_count = 0
error_count = 0

for cell in notebook['cells']:
    if cell['cell_type'] == 'code':
        cell_count += 1
        print(f"\n{'='*70}")
        print(f"EXECUTING CELL {cell_count}")
        print('='*70)
        
        code = ''.join(cell['source'])
        print("CODE:")
        print(code[:200] + ("..." if len(code) > 200 else ""))
        
        try:
            # Execute the cell code
            exec(code, globals())
            print(f"✓ Cell {cell_count} executed successfully")
        except Exception as e:
            error_count += 1
            print(f"✗ Cell {cell_count} failed with error:")
            print(f"  {type(e).__name__}: {str(e)[:100]}")
            # Continue execution to see all errors
            if error_count >= 3:
                print("\nToo many errors, stopping execution")
                break

print(f"\n{'='*70}")
print(f"EXECUTION SUMMARY")
print(f"{'='*70}")
print(f"Total cells executed: {cell_count}")
print(f"Errors encountered: {error_count}")
print(f"Success rate: {((cell_count - error_count) / cell_count * 100):.1f}%")
