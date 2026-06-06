from rest_framework import serializers
from .models import AnalysisReport, Repository


class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        fields = [
            'id', 'name', 'description', 'url', 'language',
            'stars', 'forks', 'last_updated', 'scores', 'issues', 'strengths',
            'file_tree_definitions',
        ]


class AnalysisReportListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for report list views."""
    class Meta:
        model = AnalysisReport
        fields = [
            'id', 'github_url', 'status', 'overall_score', 'letter_grade',
            'created_at', 'error_message', 'current_step',
        ]


class AnalysisReportDetailSerializer(serializers.ModelSerializer):
    """Full serializer with all analysis data."""
    repositories = RepositorySerializer(many=True, read_only=True)

    class Meta:
        model = AnalysisReport
        fields = [
            'id', 'github_url', 'status',
            'overall_score', 'letter_grade', 'github_health', 'score_breakdown',
            'strengths', 'weaknesses',
            'first_impression', 'recruiter_score', 'recruiter_sentiment',
            'recruiter_signals', 'recruiter_timeline',
            'detected_skills', 'missing_skills',
            'security_issues', 'documentation_checks', 'production_checks',
            'recommendations', 'roasts', 'benchmarks',
            'repositories',
            'error_message', 'current_step', 'created_at', 'updated_at',
        ]


class AnalyzeRequestSerializer(serializers.Serializer):
    github_url = serializers.URLField(
        help_text='GitHub profile or repository URL to analyze.'
    )

    def validate_github_url(self, value):
        if 'github.com' not in value:
            raise serializers.ValidationError('URL must be a GitHub URL.')
        return value


class DashboardSerializer(serializers.Serializer):
    """Dashboard summary data."""
    latest_report = AnalysisReportDetailSerializer(allow_null=True)
    recent_analyses = AnalysisReportListSerializer(many=True)
    total_reports = serializers.IntegerField()
