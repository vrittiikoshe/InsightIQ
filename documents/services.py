import os
import tempfile
import requests

from ai_engine.document_processor import process_document

from ai_engine.rag.chunking import split_document
from ai_engine.rag.vector_store import add_document

from .utils import extract_document_text


def download_cloudinary_file(file_url, file_type):
    """
    Download a Cloudinary file to a temporary local file.

    Returns:
        temporary file path
    """

    extension_map = {
        "PDF": ".pdf",
        "DOCX": ".docx",
        "TXT": ".txt",
    }

    extension = extension_map.get(
        file_type,
        ""
    )

    response = requests.get(
        file_url,
        timeout=60
    )

    response.raise_for_status()

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=extension
    )

    try:

        temp_file.write(
            response.content
        )

        temp_file.close()

        return temp_file.name

    except Exception:

        temp_file.close()

        try:
            os.remove(
                temp_file.name
            )
        except Exception:
            pass

        raise


def process_uploaded_document(document):
    """
    Process an uploaded PDF, DOCX or TXT document.

    Flow:

    Cloudinary
        ↓
    Temporary Download
        ↓
    Text Extraction
        ↓
    Gemini AI Analysis
        ↓
    RAG Chunking
        ↓
    Vector Store
        ↓
    Save Results
    """

    temp_file_path = None

    try:

        # ==========================================
        # PROCESSING
        # ==========================================

        document.status = "PROCESSING"

        document.save(
            update_fields=[
                "status"
            ]
        )

        # ==========================================
        # CHECK FILE
        # ==========================================

        if not document.file:

            print(
                f"No file found for document {document.id}"
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
        # GET CLOUDINARY URL
        # ==========================================

        try:

            file_url = document.file.url

            print(
                "Cloudinary File URL:",
                file_url
            )

        except Exception as file_url_error:

            print(
                "Cloudinary URL Error:",
                file_url_error
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
        # DOWNLOAD FILE TEMPORARILY
        # ==========================================

        try:

            temp_file_path = download_cloudinary_file(
                file_url,
                document.file_type
            )

            print(
                "Temporary file created:",
                temp_file_path
            )

        except Exception as download_error:

            print(
                "Cloudinary Download Error:",
                download_error
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
        # TEXT EXTRACTION
        # ==========================================

        try:

            extracted_text = extract_document_text(
                temp_file_path,
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

        # ==========================================
        # EMPTY DOCUMENT CHECK
        # ==========================================

        if (
            not extracted_text
            or not extracted_text.strip()
        ):

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

        print(
            f"Extracted {len(extracted_text)} characters"
        )

        # ==========================================
        # SAVE EXTRACTED TEXT
        # ==========================================

        document.extracted_text = (
            extracted_text
        )

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
                analysis.get(
                    "insights",
                    ""
                )
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

                print(
                    f"RAG processing completed for document {document.id}"
                )

        except Exception as rag_error:

            print(
                "RAG Processing Error:",
                rag_error
            )

            # RAG failure does not fail
            # the complete document.

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

    finally:

        # ==========================================
        # DELETE TEMPORARY FILE
        # ==========================================

        if temp_file_path:

            try:

                if os.path.exists(
                    temp_file_path
                ):

                    os.remove(
                        temp_file_path
                    )

                    print(
                        "Temporary file deleted."
                    )

            except Exception as cleanup_error:

                print(
                    "Temporary File Cleanup Error:",
                    cleanup_error
                ) 