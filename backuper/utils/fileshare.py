from backuper.utils.rclone import *
from backuper.utils.filehosting import *
import re


###############################################################################
# # get all name of remote from config file
# with open('rclone.conf') as f:
#     config = f.read()
# remote = re.findall(r'\[(.*?)\]', config)
# print(remote)
###############################################################################


rclone = RClone(cfg_path="rclone.conf")

# copy index.jpeg to remote:
result  = rclone.copy("filemanager", "mega:backuper")
print(result)

# print(result.get('out'))
# # b'local:\n'
# print(result.get('code'))
# # 0
# print(result.get('error'))
