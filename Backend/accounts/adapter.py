import uuid
from allauth.account.adapter import DefaultAccountAdapter


class CustomAccountAdapter(DefaultAccountAdapter):
    """Custom adapter that auto-generates unique usernames since we use email-only auth."""

    def populate_username(self, request, user):
        """Generate a unique username from the email address."""
        email = user.email or ''
        base = email.split('@')[0] if email else 'user'
        user.username = f"{base}_{uuid.uuid4().hex[:8]}"
