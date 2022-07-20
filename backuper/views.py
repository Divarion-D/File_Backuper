from django.http import *
from django.shortcuts import render
from backuper.models import *
import json

class Home():
    def index(request):
        data = {'title': 'Главная страница', 'page_name': 'index'}
        return render(request, 'index.html', context=data)

class Panel():   
    def index(request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/accounts/login/')
        data = {'title': 'Главная страница', 'page_name': 'dashboard'}
        return render(request, 'panel/index.html', context=data)

    def filebrowser(request, slug=None):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/accounts/login/')
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
                        'size': file.size,
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
                    'size': file.size,
                    'type': file.type
                })
            data = {'title': 'Главная страница', 'page_name': 'filebrowser','data': data}
            return render(request, 'panel/index.html', context=data)
    
    def filebrowser_api(request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/accounts/login/')
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

