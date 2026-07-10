from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from documents.models import Document
from .chat import chat_with_document


class DocumentChatView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        question = request.data.get("question")

        try:
            document_id = int(request.data.get("document_id"))
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid document_id"},
                status=400
            )

        try:
            Document.objects.get(
                id=document_id,
                uploaded_by=request.user
            )
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=404
            )

        answer = chat_with_document(
            question,
            document_id
        )

        return Response({
            "answer": answer
        }) 