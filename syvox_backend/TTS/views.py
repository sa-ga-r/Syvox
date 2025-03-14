from django.shortcuts import render
from django.http import HttpResponse
from gtts import gTTS
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