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
            if response.status_code == 200:
                file_response_json = response.json()
                data_return = file_response_json['data']['file']['metadata']['id']
                # close connection
                response.close()
            else:
                data_return = 'false'
            data.append({'url': url, 'id': data_return})
        return {'status': 'ok', 'data': data}

    def DownloadFile(self, file_url):
        link = str.replace(file_url, "\n", "")
        page = requests.get(link)
        tree = html.fromstring(page.content)
        dlink = tree.xpath('//a[@class="btn btn-primary btn-block"]/@href')
        fname = os.path.basename(dlink[0])

        with open(fname, "wb") as file:
            response = requests.get(dlink[0])
            file.write(response.content)