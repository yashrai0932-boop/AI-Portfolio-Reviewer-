"""
Portfolio Analyzer — Orchestrates the full analysis pipeline.
Fetches data from GitHub, runs AI agents, aggregates scores, saves to database.
"""
import logging
from . import github_service, ai_engine
from .models import AnalysisReport, Repository

logger = logging.getLogger(__name__)


def _compute_letter_grade(score: int) -> str:
    if score >= 95: return 'A+'
    if score >= 90: return 'A'
    if score >= 85: return 'A-'
    if score >= 80: return 'B+'
    if score >= 75: return 'B'
    if score >= 70: return 'B-'
    if score >= 65: return 'C+'
    if score >= 60: return 'C'
    if score >= 55: return 'C-'
    if score >= 50: return 'D'
    return 'F'


def _compute_github_health(repos: list) -> str:
    if not repos:
        return 'Poor'
    avg_stars = sum(r.get('stargazers_count', 0) for r in repos) / len(repos)
    recent_count = sum(1 for r in repos if r.get('pushed_at', '')[:4] >= '2025')
    if avg_stars > 20 and recent_count > 3:
        return 'Excellent'
    if avg_stars > 5 or recent_count > 2:
        return 'Good'
    if recent_count > 0:
        return 'Fair'
    return 'Poor'


def run_analysis(report: AnalysisReport, user_token: str = None):
    """
    Run the full portfolio analysis pipeline.
    Updates the report in-place and saves to DB.
    """
    try:
        report.status = 'analyzing'
        report.current_step = 'Fetching GitHub repositories...'
        report.save()

        # 1. Parse the GitHub URL
        parsed = github_service.parse_github_url(report.github_url)
        owner = parsed['owner']

        if not owner:
            report.status = 'failed'
            report.error_message = 'Could not parse GitHub URL'
            report.save()
            return

        # Fetch and save the GitHub user profile
        report.current_step = 'Fetching GitHub user profile...'
        report.save()
        profile = github_service.fetch_user_profile(owner, user_token)
        report.github_profile = profile
        report.save()

        # 2. Fetch repositories
        if parsed['is_profile']:
            raw_repos = github_service.fetch_user_repos(owner, user_token)
        else:
            # Single repo — wrap in list
            import requests
            from django.conf import settings
            headers = github_service._get_headers(user_token)
            headers['Accept'] = 'application/vnd.github+json'
            resp = requests.get(f'{settings.GITHUB_API_BASE}/repos/{owner}/{parsed["repo"]}',
                                headers=headers, timeout=15)
            raw_repos = [resp.json()] if resp.status_code == 200 else []

        if not raw_repos:
            report.status = 'failed'
            report.error_message = 'No repositories found'
            report.save()
            return

        # Filter out forks and empty repos, take top 6 by stars
        repos = [r for r in raw_repos if not r.get('fork') and r.get('size', 0) > 0]
        repos.sort(key=lambda r: r.get('stargazers_count', 0), reverse=True)
        repos = repos[:6]

        # 3. Analyze each repository
        all_code_scores = []
        all_doc_scores = []
        all_security_scores = []
        all_architecture_scores = []
        all_production_scores = []
        all_completeness_scores = []
        all_issues = []
        all_files_for_skills = []
        all_languages = {}
        repo_summaries = []

        report.current_step = 'Reading source code files...'
        report.save()

        for repo_data in repos:
            repo_name = repo_data.get('name', '')
            repo_owner = repo_data.get('owner', {}).get('login', owner)
            logger.info(f'Analyzing repository: {repo_owner}/{repo_name}')

            report.current_step = f'Reading files for {repo_name}...'
            report.save()

            # Fetch data for this repo
            readme = github_service.fetch_readme(repo_owner, repo_name, user_token)
            key_files = github_service.get_key_files(repo_owner, repo_name, user_token)
            file_tree = github_service.fetch_repo_contents(repo_owner, repo_name, user_token=user_token)
            languages = github_service.fetch_repo_languages(repo_owner, repo_name, user_token)
            commits = github_service.fetch_commit_history(repo_owner, repo_name, per_page=10, user_token=user_token)

            # Merge languages
            for lang, bytes_count in languages.items():
                all_languages[lang] = all_languages.get(lang, 0) + bytes_count

            all_files_for_skills.extend(key_files)

            # Run AI analysis on this repo
            report.current_step = f'AI: Analyzing code quality for {repo_name}...'
            report.save()
            code_result = ai_engine.analyze_code_quality(key_files, repo_name) if key_files else {
                "score": 50, "readability": 50, "naming_conventions": 50, "architecture": 50,
                "strengths": [], "issues": ["No source files found"], "patterns_found": []}

            report.current_step = f'AI: Reviewing documentation for {repo_name}...'
            report.save()
            doc_result = ai_engine.analyze_documentation(readme, repo_name)
            
            report.current_step = f'AI: Scanning security for {repo_name}...'
            report.save()
            security_result = ai_engine.analyze_security(key_files, repo_name) if key_files else {"score": 70, "issues": []}
            
            report.current_step = f'AI: Checking production readiness for {repo_name}...'
            report.save()
            production_result = ai_engine.analyze_production_readiness(key_files, file_tree, repo_name)

            report.current_step = f'AI: Generating architecture tree for {repo_name}...'
            report.save()
            file_tree_defs = ai_engine.generate_file_tree_definitions(key_files, file_tree, repo_name)

            code_score = code_result.get('score', 50)
            doc_score = doc_result.get('score', 30)
            security_score = security_result.get('score', 70)
            arch_score = code_result.get('architecture', 50)
            production_score = production_result.get('score', 40)
            completeness = min(100, int(
                (code_score * 0.3 + doc_score * 0.3 + production_score * 0.2 + security_score * 0.2)
            ))

            all_code_scores.append(code_score)
            all_doc_scores.append(doc_score)
            all_security_scores.append(security_score)
            all_architecture_scores.append(arch_score)
            all_production_scores.append(production_score)
            all_completeness_scores.append(completeness)
            all_issues.extend(code_result.get('issues', []))
            all_issues.extend([issue.get('title', '') for issue in security_result.get('issues', [])])

            # Save repository record
            repo_obj = Repository.objects.create(
                report=report,
                name=repo_name,
                description=repo_data.get('description', '') or '',
                url=repo_data.get('html_url', ''),
                language=repo_data.get('language', '') or '',
                stars=repo_data.get('stargazers_count', 0),
                forks=repo_data.get('forks_count', 0),
                last_updated=repo_data.get('pushed_at', '')[:10] if repo_data.get('pushed_at') else '',
                scores={
                    'codeQuality': code_score,
                    'documentation': doc_score,
                    'architecture': arch_score,
                    'security': security_score,
                    'productionReadiness': production_score,
                    'completeness': completeness,
                },
                issues=code_result.get('issues', []) + [i.get('title', '') for i in security_result.get('issues', [])],
                strengths=code_result.get('strengths', []),
                file_tree_definitions=file_tree_defs,
            )

            repo_summaries.append({
                'name': repo_name,
                'description': repo_data.get('description', ''),
                'language': repo_data.get('language', ''),
                'stars': repo_data.get('stargazers_count', 0),
                'code_score': code_score,
                'doc_score': doc_score,
                'has_readme': bool(readme),
                'commit_count': len(commits),
            })

        # 4. Compute aggregate scores
        avg = lambda lst: int(sum(lst) / len(lst)) if lst else 50
        score_breakdown = {
            'codeQuality': avg(all_code_scores),
            'documentation': avg(all_doc_scores),
            'architecture': avg(all_architecture_scores),
            'security': avg(all_security_scores),
            'productionReadiness': avg(all_production_scores),
            'professionalism': min(100, avg(all_code_scores + all_doc_scores)),
        }
        overall_score = int(
            score_breakdown['codeQuality'] * 0.25 +
            score_breakdown['documentation'] * 0.20 +
            score_breakdown['architecture'] * 0.20 +
            score_breakdown['security'] * 0.15 +
            score_breakdown['productionReadiness'] * 0.10 +
            score_breakdown['professionalism'] * 0.10
        )

        # 5. Run cross-repo AI analyses
        report.current_step = 'AI: Detecting skills & gaps...'
        report.save()
        skills_result = ai_engine.detect_skills(all_languages, all_files_for_skills[:15], repo_summaries)
        detected_skill_names = [s.get('name', '') for s in skills_result.get('detected', [])]

        report.current_step = 'AI: Simulating recruiter perspective...'
        report.save()
        recruiter_result = ai_engine.simulate_recruiter(repo_summaries, score_breakdown, detected_skill_names)
        
        report.current_step = 'Generating recommendations & roasts...'
        report.save()
        roasts = ai_engine.generate_roasts(repo_summaries, score_breakdown, all_issues)
        recommendations = ai_engine.generate_recommendations(
            score_breakdown, all_issues, skills_result.get('missing', [])
        )

        report.current_step = 'Computing scores & benchmarks...'
        report.save()

        # Collect all security issues from repos
        security_issues = []
        for repo_data in repos:
            repo_name = repo_data.get('name', '')
            key_files = github_service.get_key_files(
                repo_data.get('owner', {}).get('login', owner), repo_name, user_token
            )
            # We already ran security analysis above, reuse issues from repo objects
        # Get security issues from saved repo records
        for repo_obj in report.repositories.all():
            for issue_text in repo_obj.issues:
                if isinstance(issue_text, str):
                    security_issues.append({
                        'severity': 'medium',
                        'title': issue_text,
                        'description': issue_text,
                        'file': repo_obj.name,
                    })

        # Get documentation checks from first repo (representative)
        doc_checks = []
        if repos:
            first_readme = github_service.fetch_readme(
                repos[0].get('owner', {}).get('login', owner),
                repos[0].get('name', ''), user_token
            )
            doc_analysis = ai_engine.analyze_documentation(first_readme, repos[0].get('name', ''))
            doc_checks = doc_analysis.get('checks', [])

        # Production checks (aggregate)
        production_checks = []
        for repo_obj in report.repositories.all():
            file_tree = github_service.fetch_repo_contents(
                owner, repo_obj.name, user_token=user_token
            )
            prod = ai_engine.analyze_production_readiness([], file_tree, repo_obj.name)
            if prod.get('checks'):
                production_checks = prod['checks']
                break

        # Benchmarks (contextual comparison)
        benchmarks = {
            'overall': [
                {'label': 'You', 'score': overall_score, 'color': 'var(--pq-primary-500)'},
                {'label': 'Avg Student', 'score': max(30, overall_score - 25), 'color': 'var(--pq-text-muted)'},
                {'label': 'Internship Level', 'score': max(50, overall_score - 10), 'color': 'var(--pq-warning)'},
                {'label': 'Industry Level', 'score': min(98, overall_score + 12), 'color': 'var(--pq-success)'},
            ],
            'categories': [
                {
                    'category': cat_name,
                    'entries': [
                        {'label': 'You', 'score': score_breakdown[cat_key], 'color': 'var(--pq-primary-500)'},
                        {'label': 'Avg Student', 'score': max(25, score_breakdown[cat_key] - 28), 'color': 'var(--pq-text-muted)'},
                        {'label': 'Internship', 'score': max(40, score_breakdown[cat_key] - 12), 'color': 'var(--pq-warning)'},
                        {'label': 'Industry', 'score': min(98, score_breakdown[cat_key] + 8), 'color': 'var(--pq-success)'},
                    ]
                }
                for cat_name, cat_key in [
                    ('Code Quality', 'codeQuality'),
                    ('Documentation', 'documentation'),
                    ('Architecture', 'architecture'),
                    ('Production Readiness', 'productionReadiness'),
                ]
            ],
            'percentile': min(99, max(10, overall_score - 5)),
        }

        # Strengths & weaknesses
        strengths = []
        weaknesses = []
        if score_breakdown['codeQuality'] >= 75:
            strengths.append(f"Strong code quality (avg {score_breakdown['codeQuality']})")
        else:
            weaknesses.append(f"Code quality needs improvement ({score_breakdown['codeQuality']})")
        if score_breakdown['documentation'] >= 70:
            strengths.append(f"Good documentation ({score_breakdown['documentation']})")
        else:
            weaknesses.append(f"Documentation needs work ({score_breakdown['documentation']})")
        if score_breakdown['architecture'] >= 75:
            strengths.append(f"Clean architecture ({score_breakdown['architecture']})")
        else:
            weaknesses.append(f"Architecture could be improved ({score_breakdown['architecture']})")
        if score_breakdown['security'] >= 80:
            strengths.append("Good security practices")
        else:
            weaknesses.append("Security vulnerabilities detected")
        if score_breakdown['productionReadiness'] >= 70:
            strengths.append("Projects are production-ready")
        else:
            weaknesses.append("Missing production-readiness practices")
        if len(repos) >= 3:
            strengths.append(f"Good variety with {len(repos)} projects")
        for repo_obj in report.repositories.all():
            for s in repo_obj.strengths[:2]:
                if s not in strengths:
                    strengths.append(s)

        # 6. Save everything to the report
        report.overall_score = overall_score
        report.letter_grade = _compute_letter_grade(overall_score)
        report.github_health = _compute_github_health(raw_repos)
        report.score_breakdown = score_breakdown
        report.strengths = strengths[:8]
        report.weaknesses = weaknesses[:8]
        report.first_impression = recruiter_result.get('first_impression', '')
        report.recruiter_score = recruiter_result.get('recruiter_score', 50)
        report.recruiter_sentiment = recruiter_result.get('overall_sentiment', 'average')
        report.recruiter_signals = recruiter_result.get('signals', [])
        report.recruiter_timeline = recruiter_result.get('timeline', [])
        report.detected_skills = skills_result.get('detected', [])
        report.missing_skills = skills_result.get('missing', [])
        report.security_issues = security_issues[:10]
        report.documentation_checks = doc_checks
        report.production_checks = production_checks
        report.recommendations = recommendations
        report.roasts = roasts
        report.benchmarks = benchmarks
        report.status = 'complete'
        report.save()

        logger.info(f'Analysis complete for {report.github_url} — Score: {overall_score}')

    except Exception as e:
        logger.exception(f'Analysis failed for {report.github_url}: {e}')
        report.status = 'failed'
        report.error_message = str(e)
        report.save()
