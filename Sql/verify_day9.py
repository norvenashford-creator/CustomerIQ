import os
import sqlite3
import pandas as pd
import subprocess

def main():
    print("Starting Day 9 Validation Checks...\n")
    
    db_path = os.path.join("Sql", "customeriq.db")
    pbi_path = os.path.join("Data", "Processed", "customeriq_powerbi_dataset.csv")
    src_path = os.path.join("Data", "Processed", "customer_risk_scores.csv")
    
    errors = []
    
    # Check 1: Existence of files
    for path in [db_path, pbi_path, src_path]:
        if not os.path.exists(path):
            errors.append(f"Missing file: {path}")
            
    if errors:
        print("Initial checks failed:")
        for err in errors:
            print(f"- {err}")
        return False
        
    print("Files verified: Sql/customeriq.db, Data/Processed/customeriq_powerbi_dataset.csv, Data/Processed/customer_risk_scores.csv all exist.\n")
    
    # Connect to SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check 2: Row Count in DB
    cursor.execute("SELECT COUNT(*) FROM customer_risk;")
    db_row_count = cursor.fetchone()[0]
    print(f"Check 2: DB Row Count = {db_row_count} (Target: 3705)")
    if db_row_count != 3705:
        errors.append(f"DB Row count mismatch: expected 3705, got {db_row_count}")
        
    # Check 3: Unique Customer IDs in DB
    cursor.execute("SELECT COUNT(DISTINCT customer_id) FROM customer_risk;")
    db_unique_customers = cursor.fetchone()[0]
    print(f"Check 3: DB Unique Customer IDs = {db_unique_customers} (Target: 3705)")
    if db_unique_customers != 3705:
        errors.append(f"DB Duplicate customer IDs found: unique count is {db_unique_customers}")
        
    # Check 4: No Missing Critical Fields in DB
    cursor.execute("""
        SELECT COUNT(*) FROM customer_risk 
        WHERE customer_id IS NULL 
           OR churn_probability IS NULL 
           OR risk_segment IS NULL 
           OR frequency IS NULL 
           OR monetary IS NULL 
           OR recency IS NULL;
    """)
    db_null_count = cursor.fetchone()[0]
    print(f"Check 4: DB NULL counts in critical fields = {db_null_count} (Target: 0)")
    if db_null_count != 0:
        errors.append(f"DB NULLs found in critical fields: count is {db_null_count}")
        
    # Check 5: Risk Categories in DB
    cursor.execute("SELECT DISTINCT risk_segment FROM customer_risk;")
    db_segments = {row[0] for row in cursor.fetchall()}
    print(f"Check 5: DB Risk Categories = {db_segments} (Target: {{'HIGH', 'MEDIUM', 'LOW'}})")
    expected_segments = {'HIGH', 'MEDIUM', 'LOW'}
    if db_segments != expected_segments:
        errors.append(f"DB Risk segment mismatch: expected {expected_segments}, got {db_segments}")
        
    # Check 6: Churn Probabilities in DB
    cursor.execute("SELECT COUNT(*) FROM customer_risk WHERE churn_probability < 0.0 OR churn_probability > 1.0;")
    db_invalid_prob_count = cursor.fetchone()[0]
    print(f"Check 6: DB Out of range Churn Probabilities = {db_invalid_prob_count} (Target: 0)")
    if db_invalid_prob_count != 0:
        errors.append(f"DB Churn probabilities out of bounds [0, 1] found: count is {db_invalid_prob_count}")
        
    conn.close()
    
    # Check 7: Power BI CSV Verification
    df_pbi = pd.read_csv(pbi_path)
    pbi_row_count = len(df_pbi)
    pbi_unique_customers = df_pbi['customer_id'].nunique()
    pbi_null_count = df_pbi[['customer_id', 'churn_probability', 'risk_segment', 'frequency', 'monetary', 'recency']].isnull().sum().sum()
    pbi_segments = set(df_pbi['risk_segment'].unique())
    pbi_invalid_prob_count = len(df_pbi[(df_pbi['churn_probability'] < 0.0) | (df_pbi['churn_probability'] > 1.0)])
    
    print("\n--- Power BI CSV Verification ---")
    print(f"Row count: {pbi_row_count} (Target: 3705)")
    print(f"Unique Customer IDs: {pbi_unique_customers} (Target: 3705)")
    print(f"NULL counts: {pbi_null_count} (Target: 0)")
    print(f"Risk Categories: {pbi_segments} (Target: {{'HIGH', 'MEDIUM', 'LOW'}})")
    print(f"Out of bounds Churn Probabilities: {pbi_invalid_prob_count} (Target: 0)")
    
    if pbi_row_count != 3705:
        errors.append(f"Power BI CSV Row count mismatch: expected 3705, got {pbi_row_count}")
    if pbi_unique_customers != 3705:
        errors.append(f"Power BI CSV Duplicate customer IDs found: unique count is {pbi_unique_customers}")
    if pbi_null_count != 0:
        errors.append(f"Power BI CSV NULLs found: count is {pbi_null_count}")
    if pbi_segments != expected_segments:
        errors.append(f"Power BI CSV Risk segment mismatch: expected {expected_segments}, got {pbi_segments}")
    if pbi_invalid_prob_count != 0:
        errors.append(f"Power BI CSV Churn probabilities out of bounds [0, 1]: count is {pbi_invalid_prob_count}")
        
    # Check 8: Source customer_risk_scores.csv Unchanged Check
    print("\nCheck 8: Source file modification check")
    try:
        git_res = subprocess.run(
            ["git", "status", "--porcelain", src_path],
            capture_output=True,
            text=True,
            check=True
        )
        if git_res.stdout.strip():
            # Check if there's any active git diff
            diff_res = subprocess.run(
                ["git", "diff", src_path],
                capture_output=True,
                text=True,
                check=True
            )
            if diff_res.stdout.strip():
                errors.append(f"Source file {src_path} has modifications in git.")
                print(f"Git diff for {src_path}:\n{diff_res.stdout}")
            else:
                print(f"File {src_path} status: untracked or modified metadata but no diff.")
        else:
            print(f"File {src_path} is UNCHANGED according to git.")
    except Exception as e:
        print(f"Git check failed: {e}. Checking row count and column structure of source CSV instead.")
        df_src = pd.read_csv(src_path)
        if len(df_src) != 3705:
            errors.append(f"Source file length is {len(df_src)}, expected 3705")
        if list(df_src.columns) != ['Customer ID', 'churn_probability', 'risk_segment', 'Frequency', 'Monetary', 'Recency', 'Customer Lifespan', 'Average Purchase Interval', 'Median Purchase Interval']:
            errors.append("Source file columns modified")
        print("Source file validation passed via structure check.")
        
    print("\n------------------------------")
    if not errors:
        print("ALL VALIDATION CHECKS PASSED SUCCESSFULLY!")
        return True
    else:
        print(f"VALIDATION FAILED WITH {len(errors)} ERRORS:")
        for err in errors:
            print(f"- {err}")
        return False

if __name__ == '__main__':
    main()
