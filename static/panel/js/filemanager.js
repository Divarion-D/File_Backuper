var token = $('input[name="csrfmiddlewaretoken"]').val();
var latesttap;
function open_folder(folder_id) {
    var now = new Date().getTime();
    var timesince = now - latesttap;
    if ((timesince < 600) && (timesince > 0)) {
        host = window.location.host;
        link = 'http://' + host + '/panel/filebrowser/folders/'+folder_id;
        var ajax = $.ajax(link); // Запускаем загрузку новой страницы
        ajax.done(function(data) {
            var doc = new DOMParser().parseFromString(data, "text/html");
            var html = $('#filemanager_table', doc).html();
            $('#filemanager_table').html(html);
            history.pushState(null, null, link);
        });
    }
    latesttap = new Date().getTime();
}