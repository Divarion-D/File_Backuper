var token = $('input[name="csrfmiddlewaretoken"]').val();
var host = window.location.origin;
var latesttap;
function open_folder(folder_id) {
    var now = new Date().getTime();
    var timesince = now - latesttap;
    if ((timesince < 600) && (timesince > 0)) {
        link = host + '/panel/filebrowser/folders/' + folder_id;
        var ajax = $.ajax(link); // Запускаем загрузку новой страницы
        ajax.done(function (data) {
            var doc = new DOMParser().parseFromString(data, "text/html");
            var html = $('#filemanager_table', doc).html();
            $('#filemanager_table').html(html);
            history.pushState(null, null, link);
        });
    }
    latesttap = new Date().getTime();
}

function upload_file(e, folder_id) {
    e.preventDefault();
    fileobj = e.dataTransfer.files[0];
    ajax_file_upload(fileobj, folder_id);
}

function file_explorer(folder_id) {
    document.getElementById('selectfile').click();
    document.getElementById('selectfile').onchange = function () {
        fileobj = document.getElementById('selectfile').files[0];
        ajax_file_upload(fileobj, folder_id);
    };
}

function ajax_file_upload(file_obj, folder_id) {
    if (file_obj != undefined) {
        var formData = new FormData();
        formData.append('action', 'upload');
        formData.append('file', file_obj);
        formData.append('csrfmiddlewaretoken', token);
        formData.append('folder_id', folder_id);

        $.ajax({
            url: host + '/panel/filebrowser_api/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                alert('Файл успешно загружен');
            }
        });
    }
}