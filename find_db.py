import sqlite3, glob
paths = glob.glob('**/*.db', recursive=True) + glob.glob('**/*.sqlite*', recursive=True)
print('DB files found:', paths)
for p in paths:
    try:
        con = sqlite3.connect(p)
        print(p, '->', con.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
    except Exception as e:
        print(p, 'ERROR', e)
