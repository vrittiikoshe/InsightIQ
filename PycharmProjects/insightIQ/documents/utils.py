import fitz  


def extract_pdf_text(file_path):
    text = ""

    try:
        doc = fitz.open(file_path)

        for page in doc:
            text += page.get_text()

        doc.close()

    except Exception as e:
        print("PDF Extraction Error:", e)

    return text