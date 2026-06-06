from django.db import models
from django.contrib.auth.models import User


class AnalysisReport(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing'),
        ('complete', 'Complete'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    github_url = models.URLField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Overall scores
    overall_score = models.IntegerField(default=0)
    letter_grade = models.CharField(max_length=5, default='')
    github_health = models.CharField(max_length=20, default='')
    score_breakdown = models.JSONField(default=dict)

    # Analysis results
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)

    # Recruiter view
    first_impression = models.TextField(default='')
    recruiter_score = models.IntegerField(default=0)
    recruiter_sentiment = models.CharField(max_length=20, default='')
    recruiter_signals = models.JSONField(default=list)
    recruiter_timeline = models.JSONField(default=list)

    # Skills
    detected_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)

    # Security, documentation, production
    security_issues = models.JSONField(default=list)
    documentation_checks = models.JSONField(default=list)
    production_checks = models.JSONField(default=list)

    # Recommendations & roasts
    recommendations = models.JSONField(default=list)
    roasts = models.JSONField(default=list)

    # Benchmarks
    benchmarks = models.JSONField(default=dict)

    # GitHub user profile data
    github_profile = models.JSONField(default=dict)

    # Error tracking
    error_message = models.TextField(blank=True, default='')

    # Real-time progress tracking
    current_step = models.CharField(max_length=100, default='Fetching GitHub repositories...')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} - {self.github_url} ({self.status})'


class Repository(models.Model):
    report = models.ForeignKey(AnalysisReport, on_delete=models.CASCADE, related_name='repositories')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    url = models.URLField()
    language = models.CharField(max_length=50, blank=True, default='')
    stars = models.IntegerField(default=0)
    forks = models.IntegerField(default=0)
    last_updated = models.CharField(max_length=30, default='')
    scores = models.JSONField(default=dict)
    issues = models.JSONField(default=list)
    strengths = models.JSONField(default=list)
    file_tree_definitions = models.JSONField(default=list)

    def __str__(self):
        return self.name
