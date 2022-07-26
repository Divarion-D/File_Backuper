import random
import time

from backuper.models import *
from django.core.files.storage import FileSystemStorage

fs = FileSystemStorage()


def vfs_stats(user_id):
    """
    Get the size of the stored data by the user.
    """
    files = Filemanager.objects.filter(user_id=user_id)
    info = {'free': '∞', 'total': '∞', 'used': 0}
    for file in files:
        info['used'] += file.size
    return info


def vfs_features_config(user_id):
    """
    Get the configuration for the filemanager.
    """
    return {'preview': {'code': False, 'document': False, 'image': False}, 'meta': {'audio': True, 'image': True}}


def vfs_folders(user_id, path):
    """
    Get the folders of the user.
    """
    if path == '/':
        path = ''
    folders = Filemanager.objects.filter(user_id=user_id, path=path, type='folder')
    data = []
    for folder in folders:
        data.append({
            'value': folder.filename,
            'id': folder.path + '/' + folder.filename,
            'size': folder.size,
            'date': folder.date,
            'type': folder.type,
            'data': vfs_folders(user_id, folder.path + '/' + folder.filename)
        })
    return data


def vfs_files(user_id, path):
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
    return data


def vfs_makedir(user_id, path, name):
    """
    Create a new directory.
    """
    if path != '/':
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
        file_id=generate_hash(15),
        user_id=user_id,
        filename=name,
        date=date,
        parent_id=parent_id,
        size=0,
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


def vfs_move(user_id, filename, to):
    """
    Move a file to a new location.
    """
    filename = split_path(filename)
    to = split_path(to)
    date = int(time.time())

    parent_folder = Filemanager.objects.filter(user_id=user_id, path=to[0], filename=to[1], type='folder')
    parent_id = parent_folder[0].id
    parent_path = parent_folder[0].path + '/' + parent_folder[0].filename

    file = Filemanager.objects.filter(user_id=user_id, path=filename[0], filename=filename[1])
    file_size = file[0].size
    file_type = file[0].type

    # check if the file already exists
    file_check = Filemanager.objects.filter(user_id=user_id, path=parent_path, filename__contains=filename[1], type=file[0].type).order_by('-filename')
    if file_check.count() > 0:
        name = file[0].filename + '.new'
    else:
        name = file[0].filename

    file.update(filename=name, parent_id=parent_id,
                path=parent_path, date=date)
    data = {
        'value': name,
        'id': parent_path+'/'+name,
        'size': file_size,
        'date': date,
        'type': file_type
    }
    return data


def vfs_rename(user_id, filename, name):
    """
    Rename a file.
    """
    filename = split_path(filename)
    date = int(time.time())
    # check if the file already exists
    file_check = Filemanager.objects.filter(user_id=user_id, path=filename[0], filename=name)
    if file_check.count() > 0:
        name = file_check[0].filename + '.new'

    file = Filemanager.objects.filter(user_id=user_id, path=filename[0], filename=filename[1])
    file_id = file[0].path
    file.update(filename=name, date=date)
    data = {
        "invalid": False,
        "error": "",
        "id": file_id+'/'+name
    }
    return data


def vfs_search(user_id, path, query, loop=False):
    """
    Search for files and folder.
    """
    folders = vfs_folders(user_id, path)
    file = Filemanager.objects.filter(user_id=user_id, filename__contains=query)
    folder_id = []
    for folder in folders:
        folder_id.append(folder['id'])
        folder_id.extend(vfs_search(user_id, folder['id'], query, True))

    if loop:
        return folder_id
    else:
        data = []
        for file in file:
            if file.path in folder_id:
                data.append({
                    'value': file.filename,
                    'id': file.path + '/' + file.filename,
                    'size': file.size,
                    'date': file.date,
                    'type': file.type
                })
        return data


def vfs_upload(user_id, path, file):
    """
    Upload a file.
    """
    name = file.name
    type = parse_content_type(file.content_type)
    date = int(time.time())

    if path != '/':
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

    if path == '/':
        path = ''

    # check if the file already exists
    file_check = Filemanager.objects.filter(user_id=user_id, path=path, filename=name)
    if file_check.count() > 0:
        name = file_check[0].filename + '.new'

    Filemanager.objects.create(
        file_id=generate_hash(15),
        user_id=user_id,
        filename=name,
        parent_id=parent_id,
        size=file.size,
        type=type,
        path=parent_path,
        date=date
    )

    save_file(file)

    data = {
        'value': name,
        'id': parent_path+'/'+name,
        'size': file.size,
        'date': date,
        'type': type
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


def save_file(upload_file):
    """
    Save a file to the filesystem.
    """
    fs.save('filemanager/upload_temp/'+upload_file.name, upload_file)
    print(fs.url(upload_file.name))


def generate_hash(length):
    """
    Generate a random hash of a given length.
    """
    return ''.join(random.choice('0123456789abcdef') for i in range(length))


def parse_content_type(type):
    content_type = type.split('/')[0]
    if content_type == 'image':
        return 'image'
    elif content_type == 'video':
        return 'video'
    elif content_type == 'audio':
        return 'audio'
    elif content_type == 'text':
        return 'code'
    else:
        return 'file'
