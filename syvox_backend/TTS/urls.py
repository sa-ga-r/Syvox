from django.urls import path
from . import views

urlpatterns = [
    path('TTS/', views.index1, name='index1'),
    path('tts/<int:job_id>/', views.gen_tts),
    path('jobs/', views.fetch_jobs),
    path('create_job/', views.create_job),
    path('delete_job/<int:job_id>/', views.delete_job),
]