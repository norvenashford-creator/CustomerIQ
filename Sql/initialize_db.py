import os
import sqlite3
import pandas as pd

def main():
    db_dir = "Sql"
    db_path = os.path.join(db_dir, "customeriq.db")
    ddl_path = os.path.join(db_dir, "customeriq_database.sql")
    csv_path = os.path.join("Data", "Processed", "customer_risk_scores.csv")
    
    print("Initializing Database...")
    
    # Verify input exists
    if not os.path.exists(csv_path):
        print(f"Error: Source file {csv_path} not found.")
        return
        
    # Read CSV
    df = pd.read_csv(csv_path)
    print(f"Loaded CSV file with {len(df)} rows.")
    
    # Check shape
    assert len(df) == 3705, f"Expected 3705 rows, got {len(df)}"
    
    # Cast Customer ID to integer
    df = df.dropna(subset=['Customer ID'])
    df['Customer ID'] = df['Customer ID'].astype(int)
    
    # Calculate derived columns safely
    # 1. average_order_value = monetary / frequency
    df['average_order_value'] = df['Monetary'] / df['Frequency']
    # 2. revenue_exposure = monetary * churn_probability
    df['revenue_exposure'] = df['Monetary'] * df['churn_probability']
    
    # Connect to SQLite
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Read and run DDL
    with open(ddl_path, 'r') as f:
        ddl_sql = f.read()
    cursor.executescript(ddl_sql)
    print("Executed DDL schema.")
    
    # Insert data
    insert_sql = """
    INSERT INTO customer_risk (
        customer_id, churn_probability, risk_segment, frequency, monetary, recency,
        customer_lifespan, avg_purchase_interval, median_purchase_interval, average_order_value, revenue_exposure
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    records = []
    for _, row in df.iterrows():
        records.append((
            int(row['Customer ID']),
            float(row['churn_probability']),
            str(row['risk_segment']),
            int(row['Frequency']),
            float(row['Monetary']),
            int(row['Recency']),
            int(row['Customer Lifespan']),
            float(row['Average Purchase Interval']),
            float(row['Median Purchase Interval']),
            float(row['average_order_value']),
            float(row['revenue_exposure'])
        ))
        
    cursor.executemany(insert_sql, records)
    conn.commit()
    print(f"Successfully inserted {len(records)} records into customer_risk table.")
    
    # Verify insertion
    cursor.execute("SELECT COUNT(*) FROM customer_risk;")
    db_count = cursor.fetchone()[0]
    print(f"Table count in database: {db_count} (Expected: 3705)")
    
    cursor.execute("SELECT DISTINCT risk_segment, COUNT(*) FROM customer_risk GROUP BY risk_segment;")
    print("Risk segment counts in DB:")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]}")
        
    conn.close()

if __name__ == '__main__':
    main()
