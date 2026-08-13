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
            "summary",
            "category",
            "keywords",
            "insights",
            "recommendations",
            "ai_processed",
        ]

        read_only_fields = [
            "id",
            "title",
            "file_type",
            "uploaded_by",
            "uploaded_at",
            "status",
            "summary",
            "category",
            "keywords",
            "insights",
            "recommendations",
            "ai_processed",
        ]

    def create(self, validated_data):

        uploaded_file = validated_data.get("file")

        if uploaded_file:
            filename = uploaded_file.name

            # Title from filename
            title = filename.rsplit(".", 1)[0]

            # File extension
            extension = filename.rsplit(".", 1)[-1].upper()

            # Convert extension to model choices
            if extension == "PDF":
                file_type = "PDF"

            elif extension == "DOCX":
                file_type = "DOCX"

            elif extension == "TXT":
                file_type = "TXT"

            else:
                raise serializers.ValidationError(
                    {
                        "file": "Only PDF, DOCX and TXT files are allowed."
                    }
                )

            validated_data["title"] = title
            validated_data["file_type"] = file_type

        return super().create(validated_data) 