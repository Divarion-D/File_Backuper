import os
import cmd

config = os.path.dirname(os.path.abspath(__file__))+"/app/rclone.conf"
# check if config file exists
if not os.path.isfile(config):
    # make config file
    open(config, 'a').close()
    
# run rclone configure
cmd = "rclone config --config "+config
os.system(cmd)