from django.urls import path, include
from .views import GitHubLogin, github_oauth_url

urlpatterns = [
    # dj-rest-auth standard endpoints
    path('', include('dj_rest_auth.urls')),
    path('registration/', include('dj_rest_auth.registration.urls')),

    # GitHub OAuth
    path('github/', GitHubLogin.as_view(), name='github_login'),
    path('github/url/', github_oauth_url, name='github_oauth_url'),
]
