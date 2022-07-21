import email
from django.conf import settings
from django.http import *
from django.shortcuts import render
from backuper.models import *
from utils.filemanager import *
from django.contrib.auth import authenticate, login, logout
from backuper.forms import *
import json

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

    def filebrowser(request, slug=None):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        if slug:
            data = []
            folder = Filemanager.objects.filter(file_id=slug, user_id=request.user.id)
            if folder:
                files = Filemanager.objects.filter(parent_id=folder[0].id)
                for file in files:
                    data.append({
                        'id': file.file_id,
                        'filename': file.filename,
                        'type': file.type,
                        'parent_id': file.parent_id,
                        'last_update': file.last_update,
                        'size': convert_bytes(file.size),
                        'type': file.type
                    })
                if request.META.get('HTTP_REFERER'):
                    return render(request, 'panel/filebrowser.html', context={'data': data, 'path': json.loads(folder[0].file_path)})
                else:
                    data = {'title': 'Главная страница', 'page_name': 'filebrowser','data': data, 'path': json.loads(folder[0].file_path)}
                    return render(request, 'panel/index.html', context=data)
            else:
                return HttpResponseRedirect('/panel/filebrowser/')
        else:
            files = Filemanager.objects.filter(user_id=request.user.id, parent_id=0)
            data = []
            for file in files:
                data.append({
                    'id': file.file_id,
                    'filename': file.filename,
                    'type': file.type,
                    'parent_id': file.parent_id,
                    'last_update': file.last_update,
                    'size': convert_bytes(file.size),
                    'type': file.type
                })
            data = {'title': 'Главная страница', 'page_name': 'filebrowser','data': data}
            return render(request, 'panel/index.html', context=data)
    
    def filebrowser_api(request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        if request.method == 'POST':
            if request.POST.get('action') == 'create_folder':
                folder = Filemanager.objects.create(
                    filename=request.POST.get('filename'),
                    type='folder',
                    user_id=request.user.id,
                    parent_id=request.POST.get('parent_id')
                )
                return JsonResponse({'status': 'success', 'id': folder.file_id})
            elif request.POST.get('action') == 'create_file':
                file = Filemanager.objects.create(
                    filename=request.POST.get('filename'),
                    type='file',
                    user_id=request.user.id,
                    parent_id=request.POST.get('parent_id')
                )
                return JsonResponse({'status': 'success', 'id': file.file_id})
            elif request.POST.get('action') == 'delete':
                file = Filemanager.objects.filter(file_id=request.POST.get('id'), user_id=request.user.id)
                if file:
                    file.delete()
                    return JsonResponse({'status': 'success'})
                else:
                    return JsonResponse({'status': 'error'})
            elif request.POST.get('action') == 'rename':
                file = Filemanager.objects.filter(file_id=request.POST.get('id'), user_id=request.user.id)
                if file:
                    file.update(filename=request.POST.get('filename'))
                    return JsonResponse({'status': 'success'})
                else:
                    return JsonResponse({'status': 'error'})
            elif request.POST.get('action') == 'upload':
                folder = Filemanager.objects.filter(file_id=request.POST.get('folder_id'), user_id=request.user.id)
                file = request.FILES.get('file')
                Filemanager.objects.create(
                    file_id = generate_hash(15),
                    user_id=request.user.id,
                    filename=file.name,
                    parent_id=folder[0].id,
                    size = file.size,
                    type='file'
                )
                save_file(file)                      
                return JsonResponse({'status': 'success'})

