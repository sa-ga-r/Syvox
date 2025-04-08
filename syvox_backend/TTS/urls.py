from django.urls import path
from TTS import views

urlpatterns = [
    path('TTS/', views.index1, name='index1'),
    path('tts/<int:job_id>/', views.gen_tts),
    path('TTS/jobs/', views.fetch_jobs),
    path('TTS/create_job/', views.create_job),
    path('TTS/delete_job/<int:job_id>/', views.delete_job),
]