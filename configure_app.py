import os
import random

defaultsettings = 'default_settings.txt'
setting_file = 'app/settings.py'

print('How to use db?')
print('1 - sqlite3')
print('2 - mysql')
db = input('Enter number: ')

if db == '1':
    conect = """{
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }"""
elif db == '2':
    print('Enter mysql user:')
    user = input('Enter user: ')
    print('Enter mysql password:')
    password = input('Enter password: ')
    print('Enter mysql host:')
    host = input('Enter host (default: localhost): ') or 'localhost'
    print('Enter mysql port:')
    port = input('Enter port (default: 3306): ') or '3306'
    print('Enter mysql db name:')
    db_name = input('Enter db name: ')

    conect = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': db_name,
            'USER': user,
            'PASSWORD': password,
            'HOST': host,
            'PORT': port,
        }
    }

# remove settings.py
if os.path.exists(setting_file):
    os.remove(setting_file)
# create new settings.py
with open(setting_file, 'w') as f:
    with open(defaultsettings, "r") as file2:
        f.write(file2.read())

with open(setting_file, "r") as file:
    lines = file.readlines()
    if lines.index("DATABASES = {}\n") != -1:
        lines[lines.index("DATABASES = {}\n")] = f"DATABASES = {conect}\n"
        with open(setting_file, "w") as file:
            file.writelines(lines)
    # set database type
    if db == '2' and lines.index("USE_DB = 'sqlite3'\n") != -1:
        lines[lines.index("USE_DB = 'sqlite3'\n")] = f"USE_DB = 'mysql'\n"
        with open(setting_file, "w") as file:
            file.writelines(lines)
    # set cron key
    if lines.index("CRON_KEY = ''\n") != -1:
        lines[lines.index(
            "CRON_KEY = ''\n")] = f"CRON_KEY = '{''.join(random.choice('0123456789abcdef') for _ in range(32))}'\n"
        with open(setting_file, "w") as file:
            file.writelines(lines)
