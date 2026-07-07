from django.db import models
from django.db import models
from django.conf import settings


class Document(models.Model):

    FILE_TYPES = (
        ("PDF", "PDF"),
        ("DOCX", "DOCX"),
        ("TXT", "TXT"),
    )

    STATUS_CHOICES = (
        ("UPLOADED", "Uploaded"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
    )

    title = models.CharField(max_length=255)

    file = models.FileField(upload_to="uploads/")

    file_type = models.CharField(
        max_length=10,
        choices=FILE_TYPES,
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="documents",
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UPLOADED",
    )

    extracted_text = models.TextField(blank=True)

    summary = models.TextField(blank=True)

    category = models.CharField(
        max_length=100,
        blank=True
    )

    keywords = models.JSONField(
        default=list,
        blank=True
    )

    insights = models.TextField(
        blank=True
    )

    recommendations = models.TextField(
        blank=True
    )

    ai_processed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title

