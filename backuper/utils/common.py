from django.conf import settings
from backuper.utils.rclone import *
from backuper.utils.filehosting import *
from backuper.models import *
import re
import os
import json
import glob

config_path = settings.RCLONE_CONFIG
rclone = RClone(cfg_path=config_path)

def cron_upload_file():
    temp_path = settings.TEMP_PATH / "filemanager" / "upload_temp"

    if not temp_path.exists():
        temp_path.mkdir(parents=True)

    # get all name of remote from config file
    with open(config_path) as f:
        config = f.read()
    remotes = re.findall(r'\[(.*?)\]', config)

    for remote in remotes:
        # get free space on remote:
        result = rclone.about(remote+":", ["--json"])
        data = json.loads(json.dumps(json.loads(result.get('out')), ensure_ascii=False))
        free_space = data['free']
        # get all files in temp folder:
        for path, subdirs, files in os.walk(temp_path):
            for name in files:
                file = os.path.join(path, name)
                # get file size:
                file_size = os.path.getsize(file)
                # if free space is enough:
                if file_size < free_space:
                    # remove file from temp_path:
                    remote_dir = file.split(str(temp_path))[1]
                    remote_path_split = split_path(remote_dir)
                    # remove first data slash:
                    remote_dir = remote_path_split[0]
                    file_name = remote_path_split[1]
                    # upload file:
                    #rclone.copy(file, remote+":backuper/"+remote_dir)
                    file_id = file_id_by_path(remote_dir, file_name)
                    add_uploaded_file(file_id, remote)
                else:
                    print("Not enough space on remote: " + remote)
                    break


def split_path(path):
    """
    Split the path into a list.
    return: [path, filename]
    """
    path_request = path.split('/')
    split_count = len(path_request)
    filename_req = path_request[split_count-1]
    path_req = path_request[0:split_count-1]
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

def add_uploaded_file(file_id, hosting_name, hosting_file_id = None):
    """
    Add uploaded file to db
    """
    file = Filemanager_hosting.objects.create(file_id=file_id, hosting_name=hosting_name, hosting_file_id=hosting_file_id)
    file.save()