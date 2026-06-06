import uuid
from rest_framework import serializers
from django.contrib.auth.models import User
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['github_username', 'github_access_token', 'avatar_url', 'bio', 'created_at']
        read_only_fields = ['created_at']
        extra_kwargs = {
            'github_access_token': {'write_only': True},
        }


class UserDetailsSerializer(serializers.ModelSerializer):
    """Serializer for the User model used by dj-rest-auth."""
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id', 'email']


class CustomRegisterSerializer(RegisterSerializer):
    """Custom registration serializer that includes first/last name and auto-generates username."""
    username = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, username):
        """Auto-generate a unique username if none is provided."""
        if not username:
            # Generate from email prefix + short UUID to guarantee uniqueness
            email = self.initial_data.get('email', '')
            base = email.split('@')[0] if email else 'user'
            username = f"{base}_{uuid.uuid4().hex[:8]}"
        return username

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        return data

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        user.save()
        return user
