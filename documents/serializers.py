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
    # FILE TYPE VALIDATION
    # ==========================================

    def validate(self, attrs):

        file = attrs.get("file")

        if file:

            extension = os.path.splitext(
                file.name
            )[1].lower()

            expected_file_type = {
                ".pdf": "PDF",
                ".docx": "DOCX",
                ".txt": "TXT",
            }

            detected_type = (
                expected_file_type.get(
                    extension
                )
            )

            if detected_type is None:

                raise serializers.ValidationError({
                    "file":
                    "Unsupported file type."
                })

            # Automatically set file_type
            attrs["file_type"] = detected_type

        return attrs 