from django.db.models.functions import TruncMonth
from django.db.models import Count

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from documents.models import Document


class DashboardAnalyticsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        documents = Document.objects.filter(
            uploaded_by=request.user
        )

        monthly_uploads = (
            documents
            .annotate(
                month=TruncMonth("uploaded_at")
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
                "month": item["month"].strftime("%b"),
                "count": item["count"],
            })

        return Response({
            "total_documents": documents.count(),

            "completed": documents.filter(
                status="COMPLETED"
            ).count(),

            "processing": documents.filter(
                status="PROCESSING"
            ).count(),

            "failed": documents.filter(
                status="FAILED"
            ).count(),

            "monthly_uploads": chart_data,
        })