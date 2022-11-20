from django.conf import settings
import requests
import os
from lxml import html

# Sharing files with the same api
class FileShareng:
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

    def DownloadFile(user_id, file_url, file_name):
        link = str.replace(file_url, "\n", "")
        page = requests.get(link)
        tree = html.fromstring(page.content)
        dlink = tree.xpath('//a[@class="btn btn-primary btn-block"]/@href')
        fname = os.path.basename(dlink[0])
        path = settings.TEMP_PATH / 'filemanager' / 'download_temp'/ str(user_id)
        #check path
        if not os.path.exists(path):
            os.makedirs(path)

        with open(path/fname, "wb") as file:
            response = requests.get(dlink[0])
            file.write(response.content)
        #rename file
        os.rename(path/fname, path/file_name)
        return {'status': 'success', 'data': {'file': path/file_name}}

    def FileInfo(host, file_id):
        api_url = f'https://api.{host}/v2/file/{file_id}/info'
        response = requests.get(api_url)
        if response.json()['status'] == True:
            return True
        else:
            return False
        