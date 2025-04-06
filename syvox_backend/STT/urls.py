from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('stt/<int:job_id>/', views.gen_tts),
    path('jobs/', views.fetch_jobs),
    path('create_job/', views.create_job),
    path('delete_job/<int:job_id>/', views.delete_job),
]