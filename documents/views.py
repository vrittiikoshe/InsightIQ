from django.db.models import Q
import os

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Document
from .serializers import DocumentSerializer
from .utils import extract_pdf_text

from ai_engine.services import generate_summary
from ai_engine.classifiers import classify_document


class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):

        document = serializer.save(uploaded_by=self.request.user)

        print("STEP 1 : Document Saved")

        if document.file_type == "PDF":

            extracted_text = extract_pdf_text(document.file.path)

            print("STEP 2 : Text Extracted")
            print(extracted_text[:300])

            summary = generate_summary(extracted_text)

            print("STEP 3 : Summary Generated")
            print(summary)

            category = classify_document(extracted_text)

            print("STEP 4 : Category Generated")
            print(category)

            document.extracted_text = extracted_text
            document.summary = summary
            document.category = category

            document.status = "COMPLETED"
            document.ai_processed = True

            document.save()

            print("STEP 5 : Saved in Database")


class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(
            uploaded_by=self.request.user
        ).order_by("-uploaded_at")


class DocumentDetailView(generics.RetrieveAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(
            uploaded_by=self.request.user
        )


class DocumentDeleteView(generics.DestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(
            uploaded_by=self.request.user
        )

    def perform_destroy(self, instance):

        if instance.file:
            if os.path.isfile(instance.file.path):
                os.remove(instance.file.path)

        instance.delete()


class DocumentSearchView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.GET.get("q", "")

        return Document.objects.filter(
            uploaded_by=self.request.user
        ).filter(
            Q(title__icontains=query) |
            Q(extracted_text__icontains=query)
        ).order_by("-uploaded_at") 