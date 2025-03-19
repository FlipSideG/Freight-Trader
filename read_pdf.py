import PyPDF2

# Path to the PDF file
pdf_path = "documents/Torm Maren_q88_23Jul2023 (1).pdf"

# Open the PDF file
try:
    with open(pdf_path, 'rb') as file:
        # Create a PDF reader object
        pdf_reader = PyPDF2.PdfReader(file)
        
        # Get the number of pages
        num_pages = len(pdf_reader.pages)
        print(f"Number of pages: {num_pages}")
        
        # Extract text from pages 4-6 to see more data
        for page_num in range(3, min(6, num_pages)):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            print(f"\n--- Page {page_num + 1} ---\n")
            print(text[:2000])  # Print first 2000 characters of each page
            
except Exception as e:
    print(f"Error: {e}") 