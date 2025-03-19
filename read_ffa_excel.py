import pandas as pd

# Path to the FFA Excel file
file_path = "documents/FFA Oil Curves.xlsx"

try:
    # Read the Excel file
    xls = pd.ExcelFile(file_path)
    
    # Print available sheets
    print(f"Available sheets: {xls.sheet_names}")
    
    # Read each sheet and show a preview
    for sheet_name in xls.sheet_names:
        print(f"\n--- Sheet: {sheet_name} ---")
        
        # Read the sheet
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        
        # Show basic info
        print(f"Shape: {df.shape}")
        
        # Show column names
        print(f"Columns: {df.columns.tolist()}")
        
        # Show first few rows
        print("\nFirst 5 rows:")
        print(df.head().to_string())
        
except Exception as e:
    print(f"Error: {e}") 