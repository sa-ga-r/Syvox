from django.shortcuts import render
from . import views


def index(request):
    return render(request, 'index.html')

