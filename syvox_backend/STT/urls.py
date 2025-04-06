from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('stt/<int:job_id>/', views.gen_stt),
    path('jobs/', views.fetch_jobs),
    path('create_job/', views.create_job),
    path('delete_job/<int:job_id>/', views.delete_job),
]