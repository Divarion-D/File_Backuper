from django.conf import settings
from backuper.models import *
from backuper.utils.common import *
import requests
import os
import time
from lxml import html
from celery import shared_task
from celery_progress.backend import ProgressRecorder

def UploadFile(self, name, url):
    # fileneme to str
    self = str(self)
    file_data = {'file': open(self, 'rb')}
    api_url = f'https://api.{url}/upload'
    response = requests.post(api_url, files=file_data)
    if response.json()['status'] == True:
        file_response_json = response.json()
        data_return = file_response_json['data']['file']['metadata']['id']
        # close connection
        response.close()
        Filemanager_hosting.objects.create(file_id=name, hosting_name=url, hosting_file_id=data_return).save()
        print(f"File uploaded to {url} with id: {data_return}")
    

def DownloadFile(user_id, file_url, file_name):
    link = str.replace(file_url, "\n", "")
    page = requests.get(link)
    tree = html.fromstring(page.content)
    file_url = tree.xpath('//a[@class="btn btn-primary btn-block"]/@href')[0]
    path_tmp = os.path.join(settings.TEMP_PATH, 'filemanager', 'download_temp', str(user_id))

    # check path
    if not os.path.exists(path_tmp):
        os.makedirs(path_tmp)

    task = DownloadFileTask.delay(file_url, path_tmp, file_name, user_id)

    return {'status': 'success', 'data': {'task_id': task.task_id}}


@shared_task(bind=True)
def DownloadFileTask(self, file_url, path_tmp, file_name, user_id):
    print('Task started')
    progress_recorder = ProgressRecorder(self)
    print('Start')
    with open(f'{path_tmp}/{file_name}', 'wb') as f:
        print(f"Downloading {file_name}")
        response = requests.get(file_url, stream=True)
        total_length = response.headers.get('content-length')

        if total_length is None:  # no content length header
            f.write(response.content)
        else:
            dl = 0
            total_length = int(total_length)
            for data in response.iter_content(chunk_size=4096):
                dl += len(data)
                f.write(data)
                # print file download percentage
                progres = round(dl/total_length*100, 2)
                progres_description = f'Downloading ({str(progres)}%)'
                print(progres_description)
                progress_recorder.set_progress(
                    progres, 100, description=progres_description)

        print('End')
        Download_task.objects.create(
            task = self.request.id,
            user_id = user_id,
            file_path = os.path.join(path_tmp, file_name),
            data_created = int(time.time())
        )


def FileInfo(self, file_id):
    api_url = f'https://api.{self}/v2/file/{file_id}/info'
    response = requests.get(api_url)
    return response.json()['status'] == True
