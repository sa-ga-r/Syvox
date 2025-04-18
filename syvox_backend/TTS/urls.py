from django.urls import path
from . import views

urlpatterns = [
    path('tts/<int:job_id>/', views.gen_tts),
    path('tts_jobs/', views.tts_fetch_jobs),
    path('tts_create_job/', views.tts_create_job),
    path('tts_delete_job/<int:job_id>/', views.tts_delete_job),
]