import random
from django.core.files.storage import FileSystemStorage
fs = FileSystemStorage()

def generate_hash(length):
    """
    Generate a random hash of a given length.
    """
    return ''.join(random.choice('0123456789abcdef') for i in range(length))

def convert_bytes(num):
    """
    This function is used to convert bytes to MB.... GB... etc
    """
    for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0
    return "%3.1f %s" % (num, 'TB')

def save_file(upload_file):
    """
    Save a file to the filesystem.
    """
    fs.save('filemanager/upload_temp/'+upload_file.name, upload_file)
    print(fs.url(upload_file.name))