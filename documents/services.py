from ai_engine.document_processor import process_document
from ai_engine.rag.chunking import split_document
from ai_engine.rag.vector_store import add_document

from .utils import extract_pdf_text


def process_pdf(document):
    """
    Process an uploaded PDF using AI services.
    """

    extracted_text = extract_pdf_text(document.file.path)

    # AI Processing
    analysis = process_document(extracted_text)

    # RAG Processing
    chunks = split_document(extracted_text)
    add_document(document.id, chunks)

    # Save extracted text
    document.extracted_text = extracted_text

    # Save AI Results
    document.summary = analysis.get("summary", "")
    document.category = analysis.get("category", "")
    document.keywords = analysis.get("keywords", [])
    document.insights = analysis.get("insights", "")
    document.recommendations = analysis.get("recommendations", "")

    # Update status
    if analysis.get("error"):
        document.status = "FAILED"
        document.ai_processed = False
    else:
        document.status = "COMPLETED"
        document.ai_processed = True
        
    document.save()