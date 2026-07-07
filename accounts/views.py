from rest_framework import generics
from .models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, ProfileSerializer

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
