from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    #path('STT/', views.index, name='index'),
    path('gen_stt/<int:job_id>/', views.gen_stt),
    path('stt_jobs/', views.stt_fetch_jobs),
    path('stt_create_job/', views.stt_create_job),
    path('stt_delete_job/<int:job_id>/', views.stt_delete_job),
]