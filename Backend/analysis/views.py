import threading
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import AnalysisReport
from .serializers import (
    AnalysisReportListSerializer,
    AnalysisReportDetailSerializer,
    AnalyzeRequestSerializer,
)
from .analyzer import run_analysis
from accounts.serializers import UserDetailsSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_portfolio(request):
    """Start a new portfolio analysis."""
    serializer = AnalyzeRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    github_url = serializer.validated_data['github_url']

    # Create the report record
    report = AnalysisReport.objects.create(
        user=request.user,
        github_url=github_url,
        status='pending',
    )

    # Get user's GitHub token if available
    user_token = None
    if hasattr(request.user, 'profile') and request.user.profile.github_access_token:
        user_token = request.user.profile.github_access_token

    # Run analysis in a background thread
    thread = threading.Thread(
        target=run_analysis,
        args=(report,),
        kwargs={'user_token': user_token},
        daemon=True,
    )
    thread.start()

    return Response(
        AnalysisReportListSerializer(report).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_report_status(request, report_id):
    """Check the status of an analysis."""
    try:
        report = AnalysisReport.objects.get(id=report_id, user=request.user)
    except AnalysisReport.DoesNotExist:
        return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(AnalysisReportListSerializer(report).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_reports(request):
    """List all reports for the current user."""
    reports = AnalysisReport.objects.filter(user=request.user)
    return Response(AnalysisReportListSerializer(reports, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_report(request, report_id):
    """Get full report details."""
    try:
        report = AnalysisReport.objects.get(id=report_id, user=request.user)
    except AnalysisReport.DoesNotExist:
        return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(AnalysisReportDetailSerializer(report).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    """Get dashboard summary — latest report + recent analyses."""
    reports = AnalysisReport.objects.filter(user=request.user)
    latest = reports.filter(status='complete').first()
    recent = reports[:5]

    return Response({
        'latest_report': AnalysisReportDetailSerializer(latest).data if latest else None,
        'recent_analyses': AnalysisReportListSerializer(recent, many=True).data,
        'total_reports': reports.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def insights(request):
    """Get insights data from the latest complete report."""
    latest = AnalysisReport.objects.filter(
        user=request.user, status='complete'
    ).first()

    if not latest:
        return Response({'error': 'No completed analysis found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'recruiter_view': {
            'first_impression': latest.first_impression,
            'overall_sentiment': latest.recruiter_sentiment,
            'recruiter_score': latest.recruiter_score,
            'signals': latest.recruiter_signals,
            'timeline': latest.recruiter_timeline,
        },
        'skills': {
            'detected': latest.detected_skills,
            'missing': latest.missing_skills,
        },
        'benchmarks': latest.benchmarks,
    })


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get or update user profile."""
    if request.method == 'GET':
        data = UserDetailsSerializer(request.user).data
        # Add analysis history
        reports = AnalysisReport.objects.filter(user=request.user)
        data['analysis_history'] = AnalysisReportListSerializer(reports, many=True).data
        data['total_reports'] = reports.count()
        return Response(data)

    elif request.method == 'PATCH':
        user = request.user
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        user.save()

        if hasattr(user, 'profile'):
            profile = user.profile
            if 'github_username' in request.data:
                profile.github_username = request.data['github_username']
            if 'bio' in request.data:
                profile.bio = request.data['bio']
            profile.save()

        return Response(UserDetailsSerializer(user).data)
