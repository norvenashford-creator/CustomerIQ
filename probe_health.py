import urllib.request
import json

url = 'http://127.0.0.1:8000/health'
with urllib.request.urlopen(url, timeout=5) as response:
    data = response.read().decode()
    print(data)
