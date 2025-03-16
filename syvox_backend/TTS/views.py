from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from gtts import gTTS
from .models import TTSJob
import os
import json

def index(request):
    return render(request, 'index.html')

@csrf_exempt
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
    jobs = TTSJob.objects.order_by('-created_date')
    job_list = []
    for job in jobs:
        job_list.append({
            'id' : job.id,
            'job_name': job.job_name,
            'description' : job.description,
            'created_date' : job.created_date.strftime('%Y-%m-%d %H:%M:%S'),
            'file_location' : job.file_location,
            'download_link' : job.download_link,
            'status' : job.status,
        })
    return JsonResponse({'jobs':job_list})

@csrf_exempt
def create_job(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            job_name = data.get('job_name')
            description = data.get('description')
            new_job = TTSJob.objects.create(job_name=job_name, description=description)
            return JsonResponse({'New job created; ID':new_job.id})
        except Exception as e:
            return JsonResponse({'error':str(e)})
    else:
        return JsonResponse({'Error':'Invalid request method'})
    
def delete_job(job_id):
    if request.method == 'DELETE':
        job = TTSJob.objects.get(id=job_id)
        job.delete()