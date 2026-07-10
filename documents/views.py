import os

from django.db.models import Q

from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

from .models import Document
from .serializers import DocumentSerializer
from .services import process_pdf


class DocumentUploadView(generics.CreateAPIView):
    """
    API to upload and process PDF documents.
    """

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        document = serializer.save(
            uploaded_by=self.request.user
        )

        if document.file_type == "PDF":
            process_pdf(document)

    def perform_destroy(self, instance):
        if instance.file and os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

        instance.delete()

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

    # def perform_destroy(self, instance):
    #     if instance.file and os.path.isfile(instance.file.path):
    #         os.remove(instance.file.path)

    #     instance.delete()

class DocumentSearchView(generics.ListAPIView):
    """
    Search uploaded documents by title or extracted text.
    """

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.GET.get("q", "")

        return (
            Document.objects.filter(
                uploaded_by=self.request.user
            )
            .filter(
                Q(title__icontains=query)
                | Q(extracted_text__icontains=query)
            )
            .order_by("-uploaded_at")
        )