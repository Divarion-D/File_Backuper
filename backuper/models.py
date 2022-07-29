from django.db import models

# Create db tables for the backuper app

class Filemanager(models.Model):
    file_id = models.CharField(max_length=100)
    user_id = models.IntegerField()
    filename = models.CharField(max_length=255)
    parent_id = models.IntegerField(default=0)
    date = models.IntegerField()
    size = models.IntegerField()
    type = models.CharField(max_length=20)
    path = models.CharField(max_length=255, null=True)

class Filemanager_hosting(models.Model):
    file_id = models.CharField(max_length=255)
    hosting_name = models.CharField(max_length=255)
    hosting_file_id = models.CharField(max_length=255, null=True)
