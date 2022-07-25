import random
from django.core.files.storage import FileSystemStorage
from backuper.models import *
import time
fs = FileSystemStorage()

def generate_hash(length):
    """
    Generate a random hash of a given length.
    """
    return ''.join(random.choice('0123456789abcdef') for i in range(length))

def vfs_stats(user_id):
    """
    Get the size of the stored data by the user.
    """
    files = Filemanager.objects.filter(user_id=user_id)
    info = {'free': '∞', 'total': '∞', 'used': 0}
    for file in files:
        info['used'] += file.size
    return info

def vsf_features_config(user_id):
    """
    Get the configuration for the filemanager.
    """
    return {'preview': {'code': False, 'document': False, 'image': False}, 'meta': {'audio': True, 'image': True}}

def vsf_files(user_id, path):
    """
    Get the files of the user.
    """
    if path == '/':
        path = ''
    files = Filemanager.objects.filter(user_id=user_id, path=path)
    data = []
    for file in files:
        data.append({
            'value': file.filename,
            'size': file.size,
            'date': file.date,
            'type': file.type,
            'id': file.path + '/' + file.filename
        })
    # return [{"value":"Code","id":"/Code","size":4096,"date":1658379600,"type":"folder"},{...}]
    return data

def vsf_makedir(user_id, path, name):
    """
    Create a new directory.
    """
    if path != '/':
        # print count (/) path
        if len(path.split('/')) < 3:
            parent_folder = Filemanager.objects.filter(user_id=user_id, path='', filename=path.split('/')[1], type='folder')
        else:
            split_dir = split_path(path)
            parent_folder = Filemanager.objects.filter(user_id=user_id, path=split_dir[0], filename=split_dir[1], type='folder')
        parent_id = parent_folder[0].id
        parent_path = parent_folder[0].path + '/' + parent_folder[0].filename
    else:
        parent_id = 0
        parent_path = ''

    date = int(time.time())
    # check if the directory already exists
    path = '' if path == '/' else path
    folder = Filemanager.objects.filter(user_id=user_id, path=path, filename__contains=name, type='folder').order_by('-filename')
    if folder.count() > 0:
        name = folder[0].filename + '.new'

    Filemanager.objects.create(
        file_id = generate_hash(15),
        user_id=user_id,
        filename=name,
        date=date,
        parent_id=parent_id,
        size = 0,
        type='folder',
        path=parent_path
    )
    data = {
        'value': name,
        'id': parent_path+'/'+name,
        'size': 0,
        'date': date,
        'type': 'folder'
        }
    return data

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