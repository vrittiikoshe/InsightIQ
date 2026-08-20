import os

from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):

    uploaded_by = serializers.ReadOnlyField(
        source="uploaded_by.username"
    )

    file_url = serializers.SerializerMethodField()

    class Meta:

        model = Document

        fields = [
            "id",
            "title",
            "file",
            "file_url",
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
            "file_url",
        ]

    # ==========================================
    # CLOUDINARY FILE URL
    # ==========================================

    def get_file_url(self, obj):

        if not obj.file:
            return None

        try:
            return obj.file.url

        except Exception as e:

            print(
                "Cloudinary URL Error:",
                e
            )

            return None

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

            attrs["file_type"] = detected_type

        return attrs 