import random
import time

from backuper.models import *
from backuper.utils.common import *
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
    return [
        {
            'value': folder.filename,
            'id': f'{folder.path}/{folder.filename}',
            'size': folder.size,
            'date': folder.date,
            'type': folder.type,
            'data': vfs_folders(user_id, f'{folder.path}/{folder.filename}'),
        }
        for folder in folders
    ]


def vfs_files(user_id, path):
    """
    Get the files of the user.
    """
    if path == '/':
        path = ''
    files = Filemanager.objects.filter(user_id=user_id, path=path)
    return [
        {
            'value': file.filename,
            'size': file.size,
            'date': file.date,
            'type': file.type,
            'id': f'{file.path}/{file.filename}',
        }
        for file in files
    ]


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
        parent_path = f'{parent_folder[0].path}/{parent_folder[0].filename}'
    else:
        parent_id = 0
        parent_path = ''

    date = int(time.time())
    # check if the directory already exists
    path = '' if path == '/' else path
    folder = Filemanager.objects.filter(user_id=user_id, path=path, filename__contains=name, type='folder').order_by('-filename')
    if folder.count() > 0:
        name = f"new.{folder[0].filename}"

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
    return {
        'value': name,
        'id': f'{parent_path}/{name}',
        'size': 0,
        'date': date,
        'type': 'folder',
    }


def vfs_move(user_id, filename, to):
    """
    Move a file to a new location.
    """
    filename = split_path(filename)
    to = split_path(to)
    date = int(time.time())

    parent_folder = Filemanager.objects.filter(user_id=user_id, path=to[0], filename=to[1], type='folder')
    parent_id = parent_folder[0].id
    parent_path = f'{parent_folder[0].path}/{parent_folder[0].filename}'

    file = Filemanager.objects.filter(user_id=user_id, path=filename[0], filename=filename[1])
    file_size = file[0].size
    file_type = file[0].type

    # check if the file already exists
    file_check = Filemanager.objects.filter(user_id=user_id, path=parent_path, filename__contains=filename[1], type=file[0].type).order_by('-filename')
    if file_check.count() > 0:
        name = f"new.{file[0].filename}"
    else:
        name = file[0].filename

    file.update(filename=name, parent_id=parent_id,
                path=parent_path, date=date)
    return {
        'value': name,
        'id': f'{parent_path}/{name}',
        'size': file_size,
        'date': date,
        'type': file_type,
    }


def vfs_rename(user_id, filename, name):
    """
    Rename a file.
    """
    filename = split_path(filename)
    date = int(time.time())
    # check if the file already exists
    file_check = Filemanager.objects.filter(user_id=user_id, path=filename[0], filename=name)
    if file_check.count() > 0:
        name = f"new.{file_check[0].filename}"

    file = Filemanager.objects.filter(user_id=user_id, path=filename[0], filename=filename[1])
    file_id = file[0].path
    file.update(filename=name, date=date)
    return {"invalid": False, "error": "", "id": f'{file_id}/{name}'}


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
        return [
            {
                'value': file.filename,
                'id': f'{file.path}/{file.filename}',
                'size': file.size,
                'date': file.date,
                'type': file.type,
            }
            for file in file
            if file.path in folder_id
        ]


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
        parent_path = f'{parent_folder[0].path}/{parent_folder[0].filename}'
    else:
        parent_id = 0
        parent_path = ''

    if path == '/':
        path = ''

    # check if the file already exists
    file_check = Filemanager.objects.filter(user_id=user_id, path=path, filename__contains=name)
    if file_check.count() > 0:
        # add name new in count to avoid duplicates
        for _ in range(1, file_check.count()+1):
            name = f"new.{name}"

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

    save_file(user_id, file, parent_path, name)

    return {
        'value': name,
        'id': f'{parent_path}/{name}',
        'size': file.size,
        'date': date,
        'type': type,
    }


def save_file(user_id, upload_file, parent_path, filename):
    """
    Save a file to the filesystem.
    """
    if parent_path == '':
        path = f"temp/filemanager/upload_temp/{user_id}/{filename}"
    else:
        path = f"temp/filemanager/upload_temp/{user_id}/{parent_path}/{filename}"
    fs.save(path, upload_file)
    print(fs.url(upload_file.name))


def generate_hash(length):
    """
    Generate a random hash of a given length.
    """
    return ''.join(random.choice('0123456789abcdef') for _ in range(length))


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
