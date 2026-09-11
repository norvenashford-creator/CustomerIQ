import os
import sqlite3
import pandas as pd

def main():
    db_path = os.path.join("Sql", "customeriq.db")
    export_path = os.path.join("Data", "Processed", "customeriq_powerbi_dataset.csv")
    
    print("Exporting Power BI dataset...")
    
    if not os.path.exists(db_path):
        print(f"Error: Database {db_path} not found. Please run initialize_db.py first.")
        return
        
    conn = sqlite3.connect(db_path)
    
    # Read the full customer_risk table
    query = """
    SELECT 
        customer_id, 
        churn_probability, 
        risk_segment, 
        frequency, 
        monetary, 
        recency, 
        customer_lifespan, 
        avg_purchase_interval, 
        median_purchase_interval, 
        average_order_value, 
        revenue_exposure
    FROM customer_risk;
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    # Check shape
    assert len(df) == 3705, f"Expected 3705 rows, got {len(df)}"
    
    # Save to CSV
    df.to_csv(export_path, index=False)
    print(f"Successfully exported {len(df)} rows to {export_path}")

if __name__ == '__main__':
    main()
