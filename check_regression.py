import sqlite3
con = sqlite3.connect(r'Sql\customeriq.db')
cur = con.execute('''
    SELECT COUNT(*),
           SUM(CASE WHEN risk_segment='HIGH' THEN 1 ELSE 0 END),
           SUM(CASE WHEN risk_segment='MEDIUM' THEN 1 ELSE 0 END),
           SUM(CASE WHEN risk_segment='LOW' THEN 1 ELSE 0 END),
           ROUND(AVG(churn_probability)*100, 2),
           ROUND(SUM(revenue_exposure), 2)
    FROM customer_risk
''')
print(cur.fetchone())
