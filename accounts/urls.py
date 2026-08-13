from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView,
    ProfileView,
    GoogleLoginView,
    ChangePasswordView,
    ForgotPasswordView,
    ResetPasswordView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("login/", TokenObtainPairView.as_view(), name="login"),

    path("refresh/", TokenRefreshView.as_view(), name="refresh"),

    path("profile/", ProfileView.as_view(), name="profile"),

    path(
        "google-login/",
        GoogleLoginView.as_view(),
        name="google-login",
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
    path(
    "forgot-password/",
    ForgotPasswordView.as_view(),
    name="forgot-password",
    ),
    path(
    "reset-password/",
    ResetPasswordView.as_view(),
    name="reset-password",
    ),
]