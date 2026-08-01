from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from documents.models import Document
from .chat import chat_with_document


class DocumentChatView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            question = request.data.get("question")
            document_id = int(request.data.get("document_id"))

            answer = chat_with_document(question, document_id)

            return Response({
                "answer": answer
            })

        except Exception as e:
            import traceback
            traceback.print_exc()

            return Response(
                {"error": str(e)},
                status=500
            )