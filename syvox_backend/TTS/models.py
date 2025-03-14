from django.db import models

class TTSJob(models.Model):
    job_name = models.CharField(max_length=150)
    description = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    file_location = models.CharField(max_length=255, blank=True, default = 'N/A')
    download_link = models.CharField(max_length=255, blank=True, default = 'N/A')
    status = models.CharField(max_length=20, default='PENDING')

    def __str__(self):
        return self.job_name