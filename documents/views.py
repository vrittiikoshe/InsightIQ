from django.db.models import Q, Count
from django.db.models.functions import TruncMonth

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import Document
from .serializers import DocumentSerializer
from .services import process_uploaded_document


# =========================================================
# DOCUMENT UPLOAD
# =========================================================

class DocumentUploadView(generics.CreateAPIView):

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):

        print("UPLOAD REQUEST:", request.data)

        serializer = self.get_serializer(
            data=request.data
        )

        if not serializer.is_valid():

            print(
                "UPLOAD VALIDATION ERROR:",
                serializer.errors
            )

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        document = serializer.save(
            uploaded_by=request.user
        )

        # ==============================================
        # PROCESS DOCUMENT
        # ==============================================

        try:

            process_uploaded_document(
                document
            )

        except Exception as e:

            print(
                "DOCUMENT PROCESSING ERROR:",
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

        # ==============================================
        # RETURN RESPONSE
        # ==============================================

        response_serializer = self.get_serializer(
            document
        )

        data = response_serializer.data

        # ==============================================
        # CLOUDINARY FILE URL
        # ==============================================

        if document.file:

            try:

                data["file_url"] = document.file.url

            except Exception as e:

                print(
                    "FILE URL ERROR:",
                    e
                )

                data["file_url"] = None

        else:

            data["file_url"] = None

        return Response(
            data,
            status=status.HTTP_201_CREATED
        )


# =========================================================
# DOCUMENT LIST
# =========================================================

class DocumentListView(generics.ListAPIView):

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return (
            Document.objects
            .filter(
                uploaded_by=self.request.user
            )
            .order_by("-uploaded_at")
        )

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        data = serializer.data

        # ==============================================
        # ADD CLOUDINARY URL
        # ==============================================

        for item, document in zip(
            data,
            queryset
        ):

            if document.file:

                try:

                    item["file_url"] = (
                        document.file.url
                    )

                except Exception:

                    item["file_url"] = None

            else:

                item["file_url"] = None

        return Response(data)


# =========================================================
# DOCUMENT DETAIL
# =========================================================

class DocumentDetailView(
    generics.RetrieveAPIView
):

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Document.objects.filter(
            uploaded_by=self.request.user
        )

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        document = self.get_object()

        serializer = self.get_serializer(
            document
        )

        data = serializer.data

        # ==============================================
        # CLOUDINARY URL
        # ==============================================

        if document.file:

            try:

                data["file_url"] = (
                    document.file.url
                )

            except Exception:

                data["file_url"] = None

        else:

            data["file_url"] = None

        return Response(data)


# =========================================================
# DOCUMENT DELETE
# =========================================================

class DocumentDeleteView(
    generics.DestroyAPIView
):

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Document.objects.filter(
            uploaded_by=self.request.user
        )

    def perform_destroy(self, instance):

        # ==============================================
        # DELETE FILE FROM STORAGE
        # ==============================================

        if instance.file:

            try:

                instance.file.delete(
                    save=False
                )

                print(
                    f"File deleted for document {instance.id}"
                )

            except Exception as e:

                print(
                    "FILE DELETE ERROR:",
                    e
                )

        # ==============================================
        # DELETE DATABASE RECORD
        # ==============================================

        instance.delete()


# =========================================================
# DOCUMENT SEARCH
# =========================================================

class DocumentSearchView(
    generics.ListAPIView
):

    """
    Search uploaded documents by title
    or extracted text.
    """

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        query = self.request.GET.get(
            "q",
            ""
        ).strip()

        return (
            Document.objects
            .filter(
                uploaded_by=self.request.user
            )
            .filter(
                Q(title__icontains=query)
                |
                Q(extracted_text__icontains=query)
            )
            .order_by("-uploaded_at")
        )


# =========================================================
# DASHBOARD STATS
# =========================================================

class DashboardStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        documents = Document.objects.filter(
            uploaded_by=request.user
        )

        total_documents = documents.count()

        completed = documents.filter(
            status="COMPLETED"
        ).count()

        processing = documents.filter(
            status="PROCESSING"
        ).count()

        failed = documents.filter(
            status="FAILED"
        ).count()

        # ==============================================
        # MONTHLY UPLOADS
        # ==============================================

        monthly_uploads = (
            documents
            .annotate(
                month=TruncMonth(
                    "uploaded_at"
                )
            )
            .values("month")
            .annotate(
                count=Count("id")
            )
            .order_by("month")
        )

        chart_data = []

        for item in monthly_uploads:

            chart_data.append({

                "month":
                    item["month"].strftime("%b"),

                "count":
                    item["count"],

            })

        # ==============================================
        # RESPONSE
        # ==============================================

        return Response({

            "total_documents":
                total_documents,

            "completed":
                completed,

            "processing":
                processing,

            "failed":
                failed,

            "ai_chats":
                0,

            "monthly_uploads":
                chart_data,

        })