from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from gtts import gTTS
from .models import TTSJob
import os

def index(request):
    return render(request, 'index.html')

def gen_tts(request):
    if request.method == "POST":
        text = request.POST.get('text')
        if text:
            tts=gTTS(text, lang='en')
            file_path = os.path.join('TTS/static', 'output.mp3')
            tts.save(file_path)
            return render(request, 'index.html', {'audio_file':'output.mp3'})
    return HttpResponse("Error:No text provided")

def fetch_jobs(request):
    jobs = TTSJob.objects.all().order_by('-created_date')
    job_list = []
    for job in jobs:
        job_list.append({
            'job_name': job.job_name,
            'description' : job.description,
            'created_date' : job.created_data.strftime('$Y-$m-$d $H:$M:$S'),
            'file_location' : job.file_location,
            'download_link' : job.download_link,
            'status' : job.status,
        })
    return JsonResponse({'jobs':job_list})