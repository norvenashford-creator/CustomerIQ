import sys
print(sys.executable)
print(sys.version)
try:
    import pytest
    print('pytest import ok')
except Exception as exc:
    print('pytest import failed:', exc)
