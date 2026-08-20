import os
import tempfile
import requests

from cloudinary import api

from ai_engine.document_processor import process_document

from ai_engine.rag.chunking import split_document
from ai_engine.rag.vector_store import add_document

from .utils import extract_document_text


def download_cloudinary_file(document):
    """
    Download the uploaded Cloudinary file to a temporary
    local file so that PDF/DOCX/TXT extraction can work.
    """

    try:

        file_url = document.file.url

        print("Cloudinary File URL:", file_url)

        # -------------------------------------------------
        # If URL is relative, construct absolute URL
        # -------------------------------------------------

        if file_url.startswith("/"):

            from django.conf import settings

            # Try Cloudinary storage URL
            try:
                file_url = document.file.storage.url(
                    document.file.name
                )

                print(
                    "Generated Cloudinary URL:",
                    file_url
                )

            except Exception as storage_error:

                print(
                    "Storage URL Error:",
                    storage_error
                )

        # -------------------------------------------------
        # Download file
        # -------------------------------------------------

        response = requests.get(
            file_url,
            timeout=60
        )

        response.raise_for_status()

        # -------------------------------------------------
        # Create temporary file
        # -------------------------------------------------

        extension = os.path.splitext(
            document.file.name
        )[1]

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        )

        temp_file.write(
            response.content
        )

        temp_file.close()

        print(
            "Temporary file created:",
            temp_file.name
        )

        return temp_file.name

    except Exception as e:

        print(
            "Cloudinary Download Error:",
            e
        )

        return None


def process_uploaded_document(document):

    temp_file_path = None

    try:

        # ==========================================
        # PROCESSING
        # ==========================================

        document.status = "PROCESSING"

        document.save(
            update_fields=["status"]
        )

        # ==========================================
        # DOWNLOAD FILE FROM CLOUDINARY
        # ==========================================

        temp_file_path = download_cloudinary_file(
            document
        )

        if not temp_file_path:

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
        # EMPTY DOCUMENT
        # ==========================================

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
        # AI ERROR
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

            if chunks:

                add_document(
                    document.id,
                    chunks
                )

            else:

                print(
                    f"No chunks generated for document {document.id}"
                )

        except Exception as rag_error:

            print(
                "RAG Processing Error:",
                rag_error
            )

            # RAG failure does not fail AI processing

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
                    "Temporary file cleanup error:",
                    cleanup_error
                )