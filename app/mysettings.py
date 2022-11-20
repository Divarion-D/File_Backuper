from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")

TEMP_PATH = BASE_DIR / "temp"


usedb = "sqlite"

if usedb == "mysql":
    import pymysql
    pymysql.install_as_MySQLdb()   

# Database conection
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'ru'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Cron secret key
CRON_KEY = '2Wis0oaB3hLJg4t95mM0goZRYLiBfK'

#FileShare URL array
FILESHARE_URL = [
    'filechan.org',
    'anonfiles.com',
    'letsupload.cc',
    'share-online.is',
    'vshare.is',
    'hotfile.io',
    'myfile.is',
    'megaupload.nz',
    'upvid.cc',
    'lolabits.se',
    'rapidshare.nu'
]