from ai_engine.document_processor import process_document

from ai_engine.rag.chunking import split_document
from ai_engine.rag.vector_store import add_document

from .utils import extract_document_text


def process_uploaded_document(document):
    """
    Process an uploaded PDF, DOCX or TXT document.

    Flow:

    File
      ↓
    Text Extraction
      ↓
    AI Analysis
      ↓
    RAG Chunking
      ↓
    Vector Store
      ↓
    Save results
    """

    try:

        # ==========================================
        # PROCESSING
        # ==========================================

        document.status = "PROCESSING"

        document.save(
            update_fields=["status"]
        )

        # ==========================================
        # TEXT EXTRACTION
        # ==========================================

        try:

            extracted_text = extract_document_text(
                document.file.path,
                document.file_type
            )

        except Exception as extraction_error:

            print(
                "Text Extraction Error:",
                extraction_error
            )

            document.status = "FAILED"
            document.ai_processed = False
            document.save(
                update_fields=[
                    "status",
                    "ai_processed",
                ]
            )

            return

        # Empty document check

        if not extracted_text or not extracted_text.strip():

            print(
                f"Empty document: {document.id}"
            )

            document.status = "FAILED"
            document.ai_processed = False
            document.save(
                update_fields=[
                    "status",
                    "ai_processed",
                ]
            )

            return

        # ==========================================
        # SAVE EXTRACTED TEXT
        # ==========================================

        document.extracted_text = extracted_text

        # ==========================================
        # AI PROCESSING
        # ==========================================

        try:

            analysis = process_document(
                extracted_text
            )

        except Exception as ai_error:

            print(
                "AI Processing Error:",
                ai_error
            )

            document.status = "FAILED"
            document.ai_processed = False
            document.save(
                update_fields=[
                    "extracted_text",
                    "status",
                    "ai_processed",
                ]
            )

            return

        # ==========================================
        # CHECK AI ERROR
        # ==========================================

        if analysis.get("error"):

            print(
                "AI returned an error:",
                analysis.get("insights", "")
            )

            document.summary = analysis.get(
                "summary",
                ""
            )

            document.category = analysis.get(
                "category",
                ""
            )

            document.keywords = analysis.get(
                "keywords",
                []
            )

            document.insights = analysis.get(
                "insights",
                ""
            )

            document.recommendations = analysis.get(
                "recommendations",
                ""
            )

            document.status = "FAILED"
            document.ai_processed = False

            document.save()

            return

        # ==========================================
        # RAG PROCESSING
        # ==========================================

        try:

            chunks = split_document(
                extracted_text
            )

            if not chunks:

                print(
                    f"No chunks generated for document {document.id}"
                )

            else:

                add_document(
                    document.id,
                    chunks
                )

        except Exception as rag_error:

            print(
                "RAG Processing Error:",
                rag_error
            )

            # We don't fail the entire document
            # because AI analysis itself succeeded.

        # ==========================================
        # SAVE AI RESULTS
        # ==========================================

        document.summary = analysis.get(
            "summary",
            ""
        )

        document.category = analysis.get(
            "category",
            ""
        )

        document.keywords = analysis.get(
            "keywords",
            []
        )

        document.insights = analysis.get(
            "insights",
            ""
        )

        document.recommendations = analysis.get(
            "recommendations",
            ""
        )

        # ==========================================
        # SUCCESS
        # ==========================================

        document.status = "COMPLETED"
        document.ai_processed = True

        document.save()

        print(
            f"Document {document.id} processed successfully."
        )

    # ==============================================
    # UNEXPECTED ERROR
    # ==============================================

    except Exception as e:

        print(
            "Document Processing Error:",
            e
        )

        document.status = "FAILED"
        document.ai_processed = False

        document.save(
            update_fields=[
                "status",
                "ai_processed",
            ]
        )