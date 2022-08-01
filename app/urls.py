"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from backuper import views
from django.views.decorators.csrf import csrf_exempt
 
urlpatterns = [
    ######## General #########
    # path('', views.Home.index),
    path('', views.auth_login, name='login'),
    path('admin/', admin.site.urls),
    path('panel/', views.panel_index),
    ######## Filemanager #########
    path('panel/filemanager/', views.panel_filemanager),
    path('panel/filemanager_backend/<slug:metod>', csrf_exempt(views.panel_filemanager_backend)),
    path('panel/filemanager_backend/icons/<slug:size>/<slug:type>/<slug:file>.<slug:format>', views.panel_filemanager_icons),
    path('panel/filemanager_backend/icons/<slug:size>/<slug:type>/.<slug:format>', views.panel_filemanager_icons),
    ######## User Auth System ########
    path('login/', views.auth_login, name ='login'),
    path('logout/', views.auth_logout, name ='logout'),
    path('signup/', views.auth_signup, name ='signup'),
    ######## CRON ########
    path('cron/', views.cron_index, name ='cron'),
    path('cron/upload_file/', views.cron_upload_file, name ='upload_file'),
]