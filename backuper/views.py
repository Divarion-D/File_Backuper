from django.http import *
from django.shortcuts import render

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

    def filebrowser(request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/accounts/login/')
        data = {'title': 'Файловый менеджер', 'page_name': 'filebrowser'}
        return render(request, 'panel/index.html', context=data)