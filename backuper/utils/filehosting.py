from django.conf import settings
import requests
import os
from lxml import html
from celery import shared_task
from celery_progress.backend import ProgressRecorder


def UploadFile(self):
    # fileneme to str
    self = str(self)
    data = []
    for url in settings.FILESHARE_URL:
        file_data = {'file': open(self, 'rb')}
        api_url = f'https://api.{url}/upload'
        response = requests.post(api_url, files=file_data)
        if response.json()['status'] == True:
            file_response_json = response.json()
            data_return = file_response_json['data']['file']['metadata']['id']
            # close connection
            response.close()
        else:
            data_return = 'false'
        data.append({'url': url, 'id': data_return})
    return {'status': 'success', 'data': data}


@shared_task(bind=True)
def DownloadFile(self, user_id, file_url, file_name):
    progress_recorder = ProgressRecorder(self)

    link = str.replace(file_url, "\n", "")
    page = requests.get(link)
    tree = html.fromstring(page.content)
    dlink = tree.xpath('//a[@class="btn btn-primary btn-block"]/@href')
    fname = os.path.basename(dlink[0])
    path = settings.TEMP_PATH / 'filemanager' / 'download_temp' / str(user_id)
    # check path
    if not os.path.exists(path):
        os.makedirs(path)

    with open(path/fname, "wb") as f:
        print("Downloading %s" % fname)
        response = requests.get(dlink[0], stream=True)
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
                progress_recorder.set_progress(
                    progres, 100, description="Downloading")
    # rename file
    os.rename(path/fname, path/file_name)
    return {'status': 'success', 'data': {'file': path/file_name}}


def FileInfo(self, file_id):
    api_url = f'https://api.{self}/v2/file/{file_id}/info'
    response = requests.get(api_url)
    return response.json()['status'] == True
