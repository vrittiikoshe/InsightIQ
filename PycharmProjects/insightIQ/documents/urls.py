from django.urls import path
from .views import (
    DocumentUploadView,
    DocumentListView,
    DocumentDetailView,
    DocumentDeleteView,
    DocumentSearchView,
)

urlpatterns = [
    path("upload/", DocumentUploadView.as_view(), name="document-upload"),
    path("", DocumentListView.as_view(), name="document-list"),
    path("<int:pk>/", DocumentDetailView.as_view(), name="document-detail"),
    path("delete/<int:pk>/", DocumentDeleteView.as_view(), name="document-delete"),
    path("search/", DocumentSearchView.as_view(), name="document-search"),
]