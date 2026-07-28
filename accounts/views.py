import traceback
from rest_framework import generics
from .models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    UpdateProfileSerializer,
)
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return UpdateProfileSerializer

        return ProfileSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response(
                {"error": "Token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

            print("IDINFO:", idinfo)

            email = idinfo["email"]
            name = idinfo.get("name", "")
            picture = idinfo.get("picture", "")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email.split("@")[0],
                    "full_name": name,
                    "is_verified": True,
                },
            )

            if created:
                user.set_unusable_password()
                user.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "full_name": user.full_name,
                        "picture": picture,
                    },
                }
            )

        except Exception as e:
            import traceback

            traceback.print_exc()
            print("GOOGLE LOGIN ERROR:", repr(e))

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
    )