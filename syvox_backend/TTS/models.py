from django.db import models

class TTSJob(models.Model):
    job_name = models.CharField(max_length=150)
    description = models.TextField()
    created_data = models.DateTimeField(auto_now_add=True)
    file_location = models.CharField(max_length=255)
    download_link = models.CharField(max_length=255, blank=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.job_name