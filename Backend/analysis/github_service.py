"""
GitHub API Service — fetches repositories, file contents, README, commits, and languages.
Uses authenticated requests with a GitHub PAT for higher rate limits (5000 req/hr).
"""
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

HEADERS = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'ProtfoliQ-Analyzer',
}


def _get_headers(user_token=None):
    """Build request headers with authentication."""
    h = dict(HEADERS)
    token = user_token or settings.GITHUB_PAT
    if token:
        h['Authorization'] = f'token {token}'
    return h


def parse_github_url(url: str) -> dict:
    """
    Parse a GitHub URL to extract owner and optional repo name.
    Supports:
      - https://github.com/username
      - https://github.com/username/repo
      - github.com/username/repo
    """
    url = url.strip().rstrip('/')
    if not url.startswith('http'):
        url = 'https://' + url

    parts = url.replace('https://github.com/', '').replace('http://github.com/', '').split('/')
    parts = [p for p in parts if p]

    result = {'owner': '', 'repo': '', 'is_profile': True}
    if len(parts) >= 1:
        result['owner'] = parts[0]
    if len(parts) >= 2:
        result['repo'] = parts[1]
        result['is_profile'] = False
    return result


def fetch_user_repos(username: str, user_token=None) -> list:
    """Fetch all public repositories for a user."""
    repos = []
    page = 1
    while True:
        resp = requests.get(
            f'{settings.GITHUB_API_BASE}/users/{username}/repos',
            headers=_get_headers(user_token),
            params={'per_page': 100, 'page': page, 'sort': 'updated'},
            timeout=15,
        )
        if resp.status_code != 200:
            logger.error(f'GitHub API error fetching repos: {resp.status_code} {resp.text}')
            break
        data = resp.json()
        if not data:
            break
        repos.extend(data)
        page += 1
        if len(data) < 100:
            break
    return repos


def fetch_repo_contents(owner: str, repo: str, path: str = '', user_token=None) -> list:
    """Fetch the file tree of a repository at a given path."""
    resp = requests.get(
        f'{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{path}',
        headers=_get_headers(user_token),
        timeout=15,
    )
    if resp.status_code != 200:
        logger.error(f'GitHub API error fetching contents: {resp.status_code}')
        return []
    return resp.json()


def fetch_file_content(owner: str, repo: str, path: str, user_token=None) -> str:
    """Fetch the raw content of a single file."""
    h = _get_headers(user_token)
    h['Accept'] = 'application/vnd.github.raw+json'
    resp = requests.get(
        f'{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{path}',
        headers=h,
        timeout=15,
    )
    if resp.status_code != 200:
        return ''
    return resp.text


def fetch_readme(owner: str, repo: str, user_token=None) -> str:
    """Fetch the README content for a repository."""
    h = _get_headers(user_token)
    h['Accept'] = 'application/vnd.github.raw+json'
    resp = requests.get(
        f'{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/readme',
        headers=h,
        timeout=15,
    )
    if resp.status_code != 200:
        return ''
    return resp.text


def fetch_commit_history(owner: str, repo: str, per_page: int = 30, user_token=None) -> list:
    """Fetch recent commit history for a repository."""
    resp = requests.get(
        f'{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/commits',
        headers=_get_headers(user_token),
        params={'per_page': per_page},
        timeout=15,
    )
    if resp.status_code != 200:
        return []
    return resp.json()


def fetch_repo_languages(owner: str, repo: str, user_token=None) -> dict:
    """Fetch language breakdown for a repository."""
    resp = requests.get(
        f'{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/languages',
        headers=_get_headers(user_token),
        timeout=15,
    )
    if resp.status_code != 200:
        return {}
    return resp.json()


def get_key_files(owner: str, repo: str, user_token=None) -> list:
    """
    Fetch the content of key source files for analysis.
    Prioritizes: main entry points, config files, models, views, etc.
    Limits to ~10 files to stay within API limits.
    """
    contents = fetch_repo_contents(owner, repo, user_token=user_token)
    if not contents or not isinstance(contents, list):
        return []

    # Prioritized file patterns
    priority_names = [
        'main.py', 'app.py', 'index.js', 'index.ts', 'index.tsx',
        'server.py', 'server.js', 'manage.py', 'setup.py', 'pyproject.toml',
        'package.json', 'Dockerfile', 'docker-compose.yml',
        '.github', 'Makefile', 'requirements.txt',
    ]
    code_extensions = {'.py', '.js', '.ts', '.tsx', '.jsx', '.java', '.go', '.rs', '.cpp', '.c'}

    key_files = []
    other_files = []

    for item in contents:
        if item.get('type') != 'file':
            continue
        name = item.get('name', '')
        if name in priority_names:
            key_files.append(item)
        elif any(name.endswith(ext) for ext in code_extensions):
            other_files.append(item)

    # Also check src/ or app/ directories for deeper files
    for item in contents:
        if item.get('type') == 'dir' and item.get('name') in ('src', 'app', 'lib', 'core', 'api', 'models', 'views'):
            sub_contents = fetch_repo_contents(owner, repo, item['path'], user_token=user_token)
            if isinstance(sub_contents, list):
                for sub in sub_contents:
                    if sub.get('type') == 'file' and any(sub.get('name', '').endswith(ext) for ext in code_extensions):
                        other_files.append(sub)

    # Combine and limit
    all_files = key_files + other_files
    result = []
    for f in all_files[:10]:
        content = fetch_file_content(owner, repo, f['path'], user_token=user_token)
        if content:
            # Truncate very large files
            if len(content) > 8000:
                content = content[:8000] + '\n... (truncated)'
            result.append({'path': f['path'], 'content': content})
    return result


def fetch_user_profile(username: str, user_token=None) -> dict:
    """Fetch the public profile of a GitHub user."""
    resp = requests.get(
        f'{settings.GITHUB_API_BASE}/users/{username}',
        headers=_get_headers(user_token),
        timeout=15,
    )
    if resp.status_code != 200:
        logger.error(f'GitHub API error fetching user profile: {resp.status_code}')
        return {}
    data = resp.json()
    return {
        'login': data.get('login', ''),
        'name': data.get('name', ''),
        'avatar_url': data.get('avatar_url', ''),
        'bio': data.get('bio', ''),
        'company': data.get('company', ''),
        'location': data.get('location', ''),
        'blog': data.get('blog', ''),
        'email': data.get('email', ''),
        'twitter_username': data.get('twitter_username', ''),
        'followers': data.get('followers', 0),
        'following': data.get('following', 0),
        'public_repos': data.get('public_repos', 0),
        'public_gists': data.get('public_gists', 0),
        'html_url': data.get('html_url', ''),
        'created_at': data.get('created_at', ''),
    }
