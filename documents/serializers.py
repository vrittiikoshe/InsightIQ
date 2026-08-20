import os

from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):

    uploaded_by = serializers.ReadOnlyField(
        source="uploaded_by.username"
    )

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
            "extracted_text",
            "summary",
            "category",
            "keywords",
            "insights",
            "recommendations",
            "ai_processed",
        ]

        read_only_fields = [
            "id",
            "uploaded_by",
            "uploaded_at",
            "status",
            "extracted_text",
            "summary",
            "category",
            "keywords",
            "insights",
            "recommendations",
            "ai_processed",
            "title",
            "file_type",
        ]

    # ==========================================
    # FILE VALIDATION
    # ==========================================

    def validate_file(self, value):

        allowed_extensions = [
            ".pdf",
            ".docx",
            ".txt",
        ]

        extension = os.path.splitext(
            value.name
        )[1].lower()

        if extension not in allowed_extensions:

            raise serializers.ValidationError(
                "Only PDF, DOCX and TXT files are allowed."
            )

        return value

    # ==========================================
    # CREATE
    # ==========================================

    def create(self, validated_data):

        file = validated_data.get("file")

        extension = os.path.splitext(
            file.name
        )[1].lower()

        file_types = {
            ".pdf": "PDF",
            ".docx": "DOCX",
            ".txt": "TXT",
        }

        file_type = file_types.get(extension)

        # Remove extension from filename for title
        title = os.path.splitext(
            file.name
        )[0]

        validated_data["title"] = title
        validated_data["file_type"] = file_type

        return Document.objects.create(
            **validated_data
        )