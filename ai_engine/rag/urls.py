from django.urls import path
from .views import DocumentChatView

urlpatterns = [

    path(
        "chat/",
        DocumentChatView.as_view(),
        name="document-chat"
    ),

]