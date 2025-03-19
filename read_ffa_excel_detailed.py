import pandas as pd
import numpy as np

# Path to the FFA Excel file
file_path = "documents/FFA Oil Curves.xlsx"

try:
    # Read the Excel file - skip some rows to find the header
    print("Reading FFA Oil Curves Excel file...")
    
    # First, try to get a more comprehensive view of the file
    df_raw = pd.read_excel(file_path, sheet_name="TABLE", header=None)
    
    print("\nFirst 15 rows of raw data:")
    print(df_raw.iloc[:15, :15].to_string())  # Display first 15 rows and columns
    
    # Try to identify the header row and meaningful data
    print("\nAttempting to identify structure...")
    
    # Check for potential header rows (rows with mostly string values)
    for i in range(10):
        row = df_raw.iloc[i].dropna()
        print(f"Row {i}: {row.iloc[:5].tolist() if len(row) > 0 else 'Empty'}")
    
    # Let's try reading with header at row 3 (index 2) which is common for financial data
    try:
        df = pd.read_excel(file_path, sheet_name="TABLE", header=2)
        print("\nUsing row 3 as header:")
        print(f"Columns: {df.columns.tolist()[:10]}...")  # Show first 10 columns
        print(df.head(5).iloc[:, :10].to_string())  # Show first 5 rows and 10 columns
    except Exception as e:
        print(f"Error with header at row 3: {e}")
    
    # Try a few different approaches to identify the data structure
    print("\nIdentifying data types in each column (first 15 columns):")
    for col in df_raw.columns[:15]:
        non_null = df_raw[col].dropna()
        if len(non_null) > 0:
            sample_values = non_null.iloc[:5].tolist()
            types = [type(x).__name__ for x in sample_values]
            print(f"Column {col}: {types} - Sample: {sample_values}")
    
except Exception as e:
    print(f"Error: {e}") 