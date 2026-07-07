from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):

    uploaded_by = serializers.ReadOnlyField(source="uploaded_by.username")

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "file",
            "file_type",
            "uploaded_by",
            "uploaded_at",
            "status",
            "summary",
            "ai_processed",
        ]
        read_only_fields = [
            "uploaded_by",
            "uploaded_at",
            "status",
            "summary",
            "ai_processed",
        ]