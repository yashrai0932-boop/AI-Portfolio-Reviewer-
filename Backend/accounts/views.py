from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView


class GitHubLogin(SocialLoginView):
    """Handle GitHub OAuth login. Frontend sends the code, we exchange it for a token."""
    adapter_class = GitHubOAuth2Adapter
    callback_url = f"{settings.FRONTEND_URL}/auth/github/callback"
    client_class = OAuth2Client
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def github_oauth_url(request):
    """Return the GitHub OAuth authorization URL for the frontend to redirect to."""
    client_id = settings.SOCIALACCOUNT_PROVIDERS['github']['APP']['client_id']
    redirect_uri = f"{settings.FRONTEND_URL}/auth/github/callback"
    scope = 'read:user user:email repo'
    url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&scope={scope}"
    )
    return Response({'url': url})
