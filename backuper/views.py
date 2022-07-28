from django.conf import settings
from django.http import *
from django.shortcuts import render
from backuper.models import *
from backuper.utils.filemanager import *
from django.contrib.auth import authenticate, login, logout
from backuper.forms import *
import os

class Home():
    def index(request):
        data = {'title': 'Главная страница', 'page_name': 'index'}
        return render(request, 'index.html', context=data)

class Auth():
    def login(request):
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            remember = request.POST.get('remember')
            user = authenticate(request, username = username, password = password)
            if user is not None:
                login(request, user)
                if remember == 'on':
                    request.session.set_expiry(60 * 60 * 24 * 7)
                return HttpResponseRedirect('/panel/')
            else:
                return render(request, 'user/login.html', context={'error': 'Неверный логин или пароль'})
        else:
            data = {'title': 'Авторизация', 'page_name': 'login'}
            return render(request, 'user/login.html', context=data)
    def signup(request):
        if request.method == 'POST':
            form = SignUpForm(request.POST)
            if form.is_valid():
                form.save()
                user = authenticate(request, username = form.cleaned_data['username'], password = form.cleaned_data['password1'])
                login(request, user)
                return HttpResponseRedirect('/panel/')
            else:
                error = form.errors.get_json_data()
                error = list(error.values())[0]                
                data = {'title': 'Регистрация', 'page_name': 'signup', 'error': error}
                return render(request, 'user/signup.html', context=data)
        else:
            data = {'title': 'Регистрация', 'page_name': 'signup'}
            return render(request, 'user/signup.html', context=data)
    def logout(request):
        logout(request)
        return HttpResponseRedirect('/')

class Panel():   
    def index(request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        data = {'title': 'Главная страница', 'page_name': 'dashboard'}
        return render(request, 'panel/index.html', context=data)

    def filemanager(request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        data = {'title': 'Главная страница', 'page_name': 'filemanager',}
        return render(request, 'panel/index.html', context=data)

    def filemanager_icons(request, size=None, type=None, file='', format=None):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        icons_dir = os.path.join(settings.BASE_DIR, "static") + '/filemanager/icons'
        if size == 'small':
            icon_file = icons_dir + '/small/' + file + '.svg'
            # check if file exists
            if os.path.isfile(icon_file):
                return HttpResponse(open(icon_file, 'rb'), content_type='image/svg+xml')
            else:
                if type == "undefined":
                    return HttpResponse(open(icons_dir + '/small/types/file.svg', 'rb'), content_type='image/svg+xml')
                else:
                    return HttpResponse(open(icons_dir + '/small/types/'+type+'.svg', 'rb'), content_type='image/svg+xml')
        elif size == 'big':
            icon_file = icons_dir + '/big/' + type + '.svg'
            # check if file exists
            if os.path.isfile(icon_file):
                return HttpResponse(open(icon_file, 'rb'), content_type='image/svg+xml')
    
    def filemanager_backend(request, metod=None):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        if metod == 'info':
            stats = vfs_stats(request.user.id)
            features = vfs_features_config(request.user.id)
            data = {"stats":stats,"features":features}
            return JsonResponse(data)
        elif metod == 'folders':
            data = vfs_folders(request.user.id, request.GET.get('id'))
            return JsonResponse(data, safe=False)
        elif metod == 'files':
            if request.GET.get('search'):
                data = vfs_search(request.user.id, request.GET.get('id'), request.GET.get('search'))
            else:
                data = vfs_files(request.user.id, request.GET.get('id'))
            return JsonResponse(data, safe=False)
        elif metod == 'makedir':
            data = vfs_makedir(request.user.id, request.POST.get('id'), request.POST.get('name'))
            return JsonResponse(data)
        elif metod == 'move':
            data = vfs_move(request.user.id, request.POST.get('id'), request.POST.get('to'))
            return JsonResponse(data)
        elif metod == 'rename':
            data = vfs_rename(request.user.id, request.POST.get('id'), request.POST.get('name'))
            return JsonResponse(data)
        elif metod == 'upload':
            data = vfs_upload(request.user.id, request.GET.get('id'), request.FILES.get('upload'))
            return JsonResponse(data)

