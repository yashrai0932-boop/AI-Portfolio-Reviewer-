"""
AI Analysis Engine — Uses NVIDIA NIM API (OpenAI-compatible) to run specialized
portfolio analysis agents. Each agent has tuned system prompts and returns structured JSON.
"""
import json
import logging
from django.conf import settings
from openai import OpenAI

logger = logging.getLogger(__name__)

_client = None


def get_client():
    global _client
    if _client is None:
        _client = OpenAI(
            base_url=settings.NVIDIA_NIM_BASE_URL,
            api_key=settings.NVIDIA_NIM_API_KEY,
        )
    return _client


def _call_nim(model: str, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
    """Make a call to NVIDIA NIM API and return the response text."""
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        content = response.choices[0].message.content
        # deepseek-r1 wraps responses in <think>...</think> tags, strip those
        if '<think>' in content:
            # Extract content after </think>
            parts = content.split('</think>')
            if len(parts) > 1:
                content = parts[-1].strip()
        return content
    except Exception as e:
        logger.error(f'NVIDIA NIM API error: {e}')
        return ''


def _parse_json(text: str) -> dict:
    """Extract and parse JSON from AI response text."""
    text = text.strip()
    # Try to find JSON block in markdown code fences
    if '```json' in text:
        start = text.index('```json') + 7
        end = text.index('```', start)
        text = text[start:end].strip()
    elif '```' in text:
        start = text.index('```') + 3
        end = text.index('```', start)
        text = text[start:end].strip()
    # Try to find JSON object or array
    for i, ch in enumerate(text):
        if ch in ('{', '['):
            # Find matching close
            depth = 0
            for j in range(i, len(text)):
                if text[j] in ('{', '['):
                    depth += 1
                elif text[j] in ('}', ']'):
                    depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[i:j + 1])
                    except json.JSONDecodeError:
                        break
            break
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.error(f'Failed to parse JSON from AI response: {text[:200]}')
        return {}


# ============================================
# Agent: Code Quality Analysis
# ============================================
def analyze_code_quality(files: list, repo_name: str) -> dict:
    """Analyze code quality across provided files."""
    files_text = '\n\n'.join([
        f"--- FILE: {f['path']} ---\n{f['content']}"
        for f in files[:5]
    ])

    system = """You are an expert code reviewer. Analyze the provided code files and return a JSON object with:
{
  "score": <int 0-100>,
  "readability": <int 0-100>,
  "naming_conventions": <int 0-100>,
  "architecture": <int 0-100>,
  "strengths": ["strength1", "strength2", ...],
  "issues": ["issue1", "issue2", ...],
  "patterns_found": ["pattern1", "pattern2", ...]
}
Return ONLY valid JSON. No explanation outside JSON."""

    user = f"Repository: {repo_name}\n\nCode files:\n{files_text}"
    result = _call_nim(settings.NVIDIA_CODE_REVIEW_MODEL, system, user)
    parsed = _parse_json(result)
    if not parsed:
        return {"score": 60, "readability": 60, "naming_conventions": 60, "architecture": 60,
                "strengths": ["Code is functional"], "issues": ["Unable to perform detailed analysis"],
                "patterns_found": []}
    return parsed


# ============================================
# Agent: Documentation Analysis
# ============================================
def analyze_documentation(readme_content: str, repo_name: str, has_files: dict = None) -> dict:
    """Analyze README and documentation quality."""
    system = """You are a documentation quality expert. Analyze the README content and return JSON:
{
  "score": <int 0-100>,
  "checks": [
    {"item": "Project Description", "present": true/false, "quality": "good"/"needs-improvement"/"missing"},
    {"item": "Setup Instructions", "present": true/false, "quality": "..."},
    {"item": "Installation Guide", "present": true/false, "quality": "..."},
    {"item": "Usage Examples", "present": true/false, "quality": "..."},
    {"item": "Screenshots", "present": true/false, "quality": "..."},
    {"item": "Architecture Explanation", "present": true/false, "quality": "..."},
    {"item": "API Documentation", "present": true/false, "quality": "..."},
    {"item": "Contributing Guidelines", "present": true/false, "quality": "..."},
    {"item": "License", "present": true/false, "quality": "..."},
    {"item": "Environment Variables", "present": true/false, "quality": "..."}
  ],
  "suggestions": ["suggestion1", "suggestion2"]
}
Return ONLY valid JSON."""

    readme_display = readme_content if readme_content else "(No README found)"
    user = f"Repository: {repo_name}\n\nREADME Content:\n{readme_display}"
    result = _call_nim(settings.NVIDIA_GENERAL_MODEL, system, user)
    parsed = _parse_json(result)
    if not parsed:
        return {"score": 30, "checks": [
            {"item": "README", "present": bool(readme_content), "quality": "missing" if not readme_content else "needs-improvement"}
        ], "suggestions": ["Add a comprehensive README"]}
    return parsed


# ============================================
# Agent: Security Audit
# ============================================
def analyze_security(files: list, repo_name: str) -> dict:
    """Scan code for security issues."""
    files_text = '\n\n'.join([
        f"--- FILE: {f['path']} ---\n{f['content']}"
        for f in files[:5]
    ])

    system = """You are a security auditor. Scan the code for security vulnerabilities and return JSON:
{
  "score": <int 0-100>,
  "issues": [
    {"severity": "critical"/"high"/"medium"/"low", "title": "...", "description": "...", "file": "..."}
  ]
}
Look for: exposed API keys, hardcoded credentials, SQL injection, XSS, CORS issues, insecure dependencies, missing input validation.
Return ONLY valid JSON."""

    user = f"Repository: {repo_name}\n\nCode files:\n{files_text}"
    result = _call_nim(settings.NVIDIA_CODE_REVIEW_MODEL, system, user)
    parsed = _parse_json(result)
    if not parsed:
        return {"score": 70, "issues": []}
    return parsed


# ============================================
# Agent: Recruiter Simulation
# ============================================
def simulate_recruiter(repo_summaries: list, overall_scores: dict, skills: list) -> dict:
    """Simulate how a recruiter would evaluate the portfolio."""
    system = """You are a senior technical recruiter at a top tech company. Evaluate this student's GitHub portfolio and return JSON:
{
  "first_impression": "<2-3 sentence summary of what you'd think seeing this portfolio>",
  "overall_sentiment": "strong"/"average"/"weak",
  "recruiter_score": <int 0-100>,
  "signals": [
    {"type": "positive"/"negative", "text": "...", "impact": "high"/"medium"/"low"}
  ],
  "timeline": [
    {"label": "0-10 seconds", "description": "...", "sentiment": "positive"/"neutral"/"negative"},
    {"label": "10-30 seconds", "description": "...", "sentiment": "..."},
    {"label": "30-60 seconds", "description": "...", "sentiment": "..."},
    {"label": "1-2 minutes", "description": "...", "sentiment": "..."},
    {"label": "2-5 minutes", "description": "...", "sentiment": "..."}
  ]
}
Be honest and realistic. Return ONLY valid JSON."""

    user = f"""Portfolio Summary:
Repositories: {json.dumps(repo_summaries, indent=2)}

Scores: {json.dumps(overall_scores, indent=2)}

Detected Skills: {', '.join(skills)}"""

    result = _call_nim(settings.NVIDIA_GENERAL_MODEL, system, user)
    parsed = _parse_json(result)
    if not parsed:
        return {"first_impression": "Portfolio needs more information for evaluation.",
                "overall_sentiment": "average", "recruiter_score": 50, "signals": [], "timeline": []}
    return parsed


# ============================================
# Agent: Skill Detection
# ============================================
def detect_skills(languages: dict, files: list, repo_summaries: list) -> dict:
    """Detect demonstrated skills from code and repos."""
    system = """You are a skills assessment expert. Based on the code, languages, and project descriptions, return JSON:
{
  "detected": [
    {"name": "Python", "category": "language"/"framework"/"tool"/"cloud"/"database"/"other", "proficiency": "beginner"/"intermediate"/"advanced"}
  ],
  "missing": [
    {"name": "Docker", "category": "tool", "reason": "Not demonstrated in any project"}
  ]
}
Categories: language, framework, tool, cloud, database, other.
For missing skills, only include skills commonly expected for someone at this level.
Return ONLY valid JSON."""

    files_summary = '\n'.join([f"- {f['path']}" for f in files[:15]])
    repos_text = json.dumps(repo_summaries, indent=2)

    user = f"""Languages detected: {json.dumps(languages)}

Key files:
{files_summary}

Repositories:
{repos_text}"""

    result = _call_nim(settings.NVIDIA_GENERAL_MODEL, system, user)
    parsed = _parse_json(result)
    if not parsed:
        # Fallback: derive from languages
        detected = [{"name": lang, "category": "language", "proficiency": "intermediate"} for lang in languages.keys()]
        return {"detected": detected, "missing": []}
    return parsed


# ============================================
# Agent: Roast Generator
# ============================================
def generate_roasts(repo_summaries: list, scores: dict, issues: list) -> list:
    """Generate witty portfolio roasts."""
    system = """You are a brutally honest but funny portfolio critic. Generate 5-6 witty, share-worthy roasts about this developer's portfolio. Each roast should be 1-2 sentences, specific to their actual weaknesses, and funny.

Return JSON array:
[
  {"text": "roast text here", "category": "Documentation"/"Security"/"Testing"/"Deployment"/"Architecture"/"Git Practices"}
]
Be creative, specific, and funny. Not generic. Return ONLY valid JSON array."""

    user = f"""Portfolio scores: {json.dumps(scores)}
Issues found: {json.dumps(issues[:10])}
Repositories: {json.dumps(repo_summaries)}"""

    result = _call_nim(settings.NVIDIA_GENERAL_MODEL, system, user)
    parsed = _parse_json(result)
    if isinstance(parsed, list):
        return parsed
    if isinstance(parsed, dict) and 'roasts' in parsed:
        return parsed['roasts']
    return [{"text": "Your portfolio exists. That's... something.", "category": "General"}]


# ============================================
# Agent: Recommendations
# ============================================
def generate_recommendations(scores: dict, issues: list, missing_skills: list) -> list:
    """Generate actionable portfolio improvement recommendations."""
    system = """You are a career advisor for software developers. Based on the portfolio analysis, generate 6-8 prioritized improvement recommendations.

Return JSON array:
[
  {"priority": "high"/"medium"/"low", "title": "...", "description": "...", "category": "Presentation"/"Documentation"/"Engineering"/"DevOps"/"Security"/"Community"}
]
Order by priority (high first). Be specific and actionable. Return ONLY valid JSON array."""

    user = f"""Scores: {json.dumps(scores)}
Issues: {json.dumps(issues[:15])}
Missing skills: {json.dumps(missing_skills)}"""

    result = _call_nim(settings.NVIDIA_GENERAL_MODEL, system, user)
    parsed = _parse_json(result)
    if isinstance(parsed, list):
        return parsed
    if isinstance(parsed, dict) and 'recommendations' in parsed:
        return parsed['recommendations']
    return [{"priority": "high", "title": "Improve documentation", "description": "Add comprehensive README files.", "category": "Documentation"}]


# ============================================
# Agent: Production Readiness
# ============================================
def analyze_production_readiness(files: list, file_tree: list, repo_name: str) -> dict:
    """Check how production-ready a project is."""
    file_names = [f.get('name', '') for f in file_tree] if isinstance(file_tree, list) else []
    files_text = '\n'.join([f"- {f['path']}" for f in files])

    system = """You are a DevOps engineer evaluating project production readiness. Return JSON:
{
  "score": <int 0-100>,
  "checks": [
    {"label": "Docker Support", "has": true/false},
    {"label": "Environment Variables", "has": true/false},
    {"label": "Logging System", "has": true/false},
    {"label": "Unit Testing", "has": true/false},
    {"label": "CI/CD Pipeline", "has": true/false},
    {"label": "Error Handling", "has": true/false},
    {"label": "API Documentation", "has": true/false},
    {"label": "Deployment Config", "has": true/false}
  ]
}
Return ONLY valid JSON."""

    user = f"""Repository: {repo_name}
Root files: {', '.join(file_names)}
Key files:
{files_text}"""

    result = _call_nim(settings.NVIDIA_GENERAL_MODEL, system, user)
    parsed = _parse_json(result)
    if not parsed:
        return {"score": 40, "checks": []}
    return parsed
