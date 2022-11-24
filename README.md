# Бейкапер
## Описание
Этот скрипт нужен для того чтобы хранить файлы, пароли и избранное из соц. сетей (VK, Telegram) на нескольких файлообмениках для гарантии сохраности данных. Естественно мы файлообменикам не доверяем поэтому дополнительно шифруем все данные которые туда будем отправлять. Для избранного из соц. сетей будут использоватся чат боты, а для всего остального планируется использовать крос платформенное приложениие.

## Запланированно

### Сервер
- [x] Авторизация клиентов
- [ ] Шифрование присланных материалов
- [x] Интеграция файлообмеников
- [x] Отправка файлов
- [ ] Получение файлов
- [ ] Менеджер файлов(В процессе)
- [ ] Менеджер паролей

### Боты
- [ ] Бот для ВК
- [ ] Бот для Telegram

Список будет дополнятся и обновлятся

## Ограничения
- Максимальный размер файла 20Гб

# test
```
apt install redis-server
pip3 install redis
pip3 install celery-progress
pip3 install celery
```
create config file 6379.conf

paste this:
```
port              6379
daemonize         yes
save              60 1
bind              127.0.0.1
tcp-keepalive     300
dir               /home/daliman/redis/
dbfilename        dump.rdb
rdbcompression    yes
pidfile           redis.pid
loglevel          notice
logfile           "redis.log"
```
run redis server
```
redis-server /home/daliman/redis/6379.conf 
```

run celery worker
```
celery -A app worker --loglevel=info


## Запуск
- Клонируем репозиторий
```
git clone https://github.com/Divarion-D/File_Backuper.git
cd File_Backuper
```
- Устанавливаем зависимости
```
pip3 install -r requirements.txt
```
- После запускаем configure_app.py 
```
python3 configure_app.py
```
- Потом нужно выполнить один раз команду
```
python3 manage.py migrate
```
- Создаем Администратора
```
python3 manage.py createsuperuser
```
- После того как вы ее сконфигурировали запускаем саму панель
```
python3 manage.py runserver 
```