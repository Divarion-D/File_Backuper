from django.conf import settings
import requests
import os
from lxml import html
import sys
import time

# Sharing files with the same api
class FileShareng:
    def UploadFile(file_name):
        # fileneme to str
        file_name = str(file_name)
        data = []
        for url in settings.FILESHARE_URL:
            file_data = {'file': open(file_name, 'rb')}
            api_url = 'https://api.'+url+'/upload'
            response = requests.post(api_url, files=file_data)
            if response.status_code == 200:
                file_response_json = response.json()
                data_return = file_response_json['data']['file']['metadata']['id']
                # close connection
                response.close()
                data.append({'url': url, 'id': data_return})
        return data
    
    def upload(url_api, file_data):
        response = requests.post(url_api, files=file_data)
        if response.status_code == 200:
            file_response_json = response.json()
            data_return = file_response_json['data']['file']['metadata']['id']
            # close connection
            response.close()
            return data_return
        else:
            return False
        


    def DownloadFile(self, file_url):
        link = str.replace(file_url, "\n", "")
        page = requests.get(link)
        tree = html.fromstring(page.content)
        dlink = tree.xpath('//a[@class="btn btn-primary btn-block"]/@href')
        fname = os.path.basename(dlink[0])

        with open(fname, "wb") as file:
            response = requests.get(dlink[0])
            file.write(response.content)


class AnonFile:
    def UploadFile(file_name):
        file_data = {'file': open(file_name, 'rb')}
        file_url = 'https://api.letsupload.cc/upload'
        file_response = requests.post(file_url, files=file_data)
        file_response_json = file_response.json()
        return file_response_json['data']['file']['metadata']['id']


    def DownloadFile(self, file_url):
        link = str.replace(file_url, "\n", "")
        page = requests.get(link)
        tree = html.fromstring(page.content)
        dlink = tree.xpath('//a[@class="btn btn-primary btn-block"]/@href')
        fname = os.path.basename(dlink[0])

        with open(fname, "wb") as file:
            response = requests.get(dlink[0])
            file.write(response.content)