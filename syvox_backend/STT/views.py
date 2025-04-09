from django.shortcuts import render
from django.apps import apps
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import speech_recognition as sr
from pydub import AudioSegment
from .models import STTJob
from django.conf import settings
import os
import datetime

def index(request):
    return render(request, 'index.html')

def stt_fetch_jobs(request):
    jobs = STTJob.objects.order_by('-created_date')
    job_list = []
    for job in jobs:
        job_list.append({
            'id' : job.id,
            'job_name': job.job_name,
            'description' : job.description,
            'created_date' : job.created_date.strftime('%Y-%m-%d %H:%M:%S'),
            'file_location' : job.file_location,
            'text_file' : job.text_file,
            'download_link' : job.download_link,
            'status' : job.status,
        })
    return JsonResponse({'jobs':job_list})

@csrf_exempt
def stt_create_job(request):
    if request.method == "POST":
        try:
            job_name = request.POST.get("job_name")
            description = request.POST.get('description')
            audio_file = request.FILES.get('upload_file')
            audio_path = ''
            if audio_file:
                app_dir = apps.get_app_config('STT').path
                static_dir = os.path.join(app_dir, 'static')
                os.makedirs(static_dir, exist_ok=True)
                audio_filename = audio_file.name
                audio_path = os.path.join(static_dir, audio_filename)
                with open(audio_path, 'wb+') as f:
                    for chunk in audio_file.chunks():
                        f.write(chunk)
                download_link = f"/static/{audio_filename}"
            new_job = STTJob.objects.create(job_name=job_name, description=description, file_location=audio_path, download_link = download_link)
            return JsonResponse({'New job created; ID':new_job.id})
        except Exception as e:
            return JsonResponse({'error':str(e)})
    else:
        return JsonResponse({'Error':'Invalid request method'})
        
@csrf_exempt  
def stt_delete_job(request, job_id):
    if request.method == 'DELETE':
        job = STTJob.objects.get(id=job_id)
        job.delete()
    return JsonResponse({'status':'success', 'message':'Job deleted successfully'})

'''
@csrf_exempt
def gen_tts(request, job_id):
    if request.method == 'POST':
        job = TTSJob.objects.get(id=job_id)
        text = job.description
        if not text:
            return JsonResponse({'status':'error', 'message':'Description is empty.'})
        tts = gTTS(text=text, lang='en')
        file_name = f"{job.job_name.replace(' ', '_')}_{job_id}.mp3"
        file_path = os.path.join('TTS/','static/', file_name)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        tts.save(file_path)
        #job.file_location=os.path.join(file_path)
        job.file_location=f'static/{file_name}'
        job.audio_file=f'static/{file_name}'
        job.status='DONE'
        job.save()
        #TTSJob.objects.create(file_location=job.file_location, audio_file=job.audio_file)
        return JsonResponse({'status':'success', 'audio_file':job.audio_file, 'file_location':job.file_location})
    return JsonResponse({'status':'error', 'message':'Invalid request method'})
'''

@csrf_exempt
def gen_stt(request, job_id):
    if request.method == "POST" and request.FILES.get('audio_file'):
        audio_file = request.FILES['audio_file']
        og_filename = audio_file.name
        ext = os.path.splitext(og_filename)[1].lower()
        static_dir = os.path.join(settings.BASE_DIR, 'static')
        os.makedirs(static_dir, exist_ok=True)
        audio_path = os.path.join(static_dir, og_filename)
        with open(audio_path, 'wb+') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)
            if ext == '.mp3':
                sound = AudioSegment.from_mp3(audio_path)
                wav_path = audio_path.replace('.mp3', '.wav')
                sound.export(wav_path, format="wav")
            else:
                wav_path = audio_path
            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
            try:
                stt = recognizer.recognize_google(audio_data)
            except sr.UnknownValueError:
                stt = "Could not understand audio."
            except sr.RequestError as e:
                stt = f"Speech recognition error:{e}"
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            base_name = os.path.splitext(og_filename)[0]
            txt_filename = f"job{base_name}_{job_id}.txt"
            txt_path = os.path.join(static_dir, txt_filename)
            with open(txt_path, 'w', encoding='utf-8') as text_file:
                txt_file.write(stt)
                return JsonResponse({"status":"success", "job_id":job_id, "filename":txt_filename, "file_path":txt_path, "download_link":f"/static/{txt_filename}", "datetime":timestamp})
    return JsonResponse({"status":"error"})