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
from .serializers import ChangePasswordSerializer
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

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
            
class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        user = request.user

        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {
                    "error": "Current password is incorrect."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        update_session_auth_hash(request, user)

        return Response(
            {
                "message": "Password updated successfully."
            }
        )
        
class ForgotPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "message": "If an account exists with this email, a password reset link has been sent."
                },
                status=status.HTTP_200_OK,
            )

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        reset_link = (
            f"http://localhost:5173/reset-password/{uid}/{token}/"
        )

        send_mail(
            subject="InsightIQ Password Reset",
            message=f"""
Hello {user.full_name or user.username},

You requested a password reset for your InsightIQ account.

Click the link below to reset your password:

{reset_link}

If you did not request this, you can safely ignore this email.

Regards,
InsightIQ Team
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Password reset link has been sent to your email."
            },
            status=status.HTTP_200_OK,
        )
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator

class ResetPasswordView(APIView):

    def post(self, request):

        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not uid or not token or not new_password:
            return Response(
                {
                    "error": "UID, token and new password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {
                    "error": "Password must be at least 8 characters."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = urlsafe_base64_decode(uid).decode()

            user = User.objects.get(id=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {
                    "error": "Invalid reset link."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {
                    "error": "Invalid or expired reset link."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {
                "message": "Password reset successfully."
            },
            status=status.HTTP_200_OK,
        )