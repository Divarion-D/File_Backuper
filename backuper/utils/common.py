from django.conf import settings
from backuper.utils.filehosting import *
from backuper.models import *
import os
import random
import threading

def cron_upload_file():
    temp_path = settings.TEMP_PATH / "filemanager" / "upload_temp"

    #ccheck if file exists
    if not os.path.exists(temp_path):
        temp_path.mkdir(parents=True)

    # get all files in temp folder:
    for path, subdirs, files in os.walk(temp_path):
        for name in files:
            file = os.path.join(path, name)
            # get file size:
            file_size = os.path.getsize(file)
            for url in settings.FILESHARE_URL:
                thread = threading.Thread(target=UploadFile, args = [file, name, url], name=f"{name}_{url}").start()
            #remove file
            #os.remove(file)

def cron_cleartmp():
    Download_task.objects.filter(data_created__lte=int(time.time()) - 86400).delete()
    path_arr = []
    for path, subdirs, files in os.walk(settings.TEMP_PATH / "filemanager" / "download_temp"):
        for name in files:
            path_arr.append(os.path.join(path, name))
    for file in path_arr:
        file_temp = Download_task.objects.filter(file_path=file)
        if not file_temp:
            os.remove(file)
            

def split_path(path):
    """
    Split the path into a list.
    return: [path, filename]
    """
    path_request = path.split('/')
    split_count = len(path_request)
    filename_req = path_request[split_count-1]
    path_req = path_request[:split_count-1]
    path_req = '/'.join(path_req)
    return [path_req, filename_req]

def file_id_by_path(path, filename):
    """
    Get file id by path in db
    return: file id
    """
    user_id = path.split('/')[1]
    path = path.replace(f"/{user_id}", "")
    file = Filemanager.objects.filter(user_id=user_id, path=path, filename=filename)
    return file[0].file_id

def generate_hash(length):
    """
    Generate a random hash of a given length.
    """
    return ''.join(random.choice('0123456789abcdef') for _ in range(length))