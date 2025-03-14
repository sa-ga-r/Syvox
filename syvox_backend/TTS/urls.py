from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('tts/', views.gen_tts),
    path('jobs/', views.fetch_jobs),
]