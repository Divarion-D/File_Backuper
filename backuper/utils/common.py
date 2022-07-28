from django.conf import settings
from gevent import config
from backuper.utils.rclone import *
from backuper.utils.filehosting import *
import re
import os
import json

config_path = settings.RCLONE_CONFIG
rclone = RClone(cfg_path=config_path)


def cron_upload_file():
    # get all name of remote from config file
    with open(config_path) as f:
        config = f.read()
    remote = re.findall(r'\[(.*?)\]', config)
    print(remote)

    







###############################################################################
# # get all name of remote from config file
# with open('rclone.conf') as f:
#     config = f.read()
# remote = re.findall(r'\[(.*?)\]', config)
# print(remote)
###############################################################################
# copy folder to remote:
#result  = rclone.copy("filemanager", "mega:backuper")
###############################################################################
# # get free space on remote:
# result = rclone.about("onedrive:", ["--json"])
# data = json.dumps(json.loads(result.get('out')), ensure_ascii=False).replace("\"","")
# print(data)
# return data
###############################################################################