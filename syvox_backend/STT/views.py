from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import speech_recognition as sr
import os

def index(request):
    return render(request, 'index.html')

