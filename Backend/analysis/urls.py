from django.urls import path
from . import views

urlpatterns = [
    # Analysis
    path('analysis/analyze/', views.analyze_portfolio, name='analyze'),
    path('analysis/status/<int:report_id>/', views.get_report_status, name='report_status'),
    path('analysis/reports/', views.list_reports, name='report_list'),
    path('analysis/reports/<int:report_id>/', views.get_report, name='report_detail'),

    # Dashboard & Insights
    path('dashboard/', views.dashboard, name='dashboard'),
    path('insights/', views.insights, name='insights'),

    # Profile
    path('profile/', views.profile, name='profile'),
]
