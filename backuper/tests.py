from django.test import TestCase
from backuper.utils.filehosting import *
from backuper.utils.common import *

# Create your tests here.
class FileShareTestCase(TestCase):
    def setUp(self):
        pass

    # def test_upload_file(self):
    #     # create a file
    #     file_name = 'test.txt'
    #     with open(file_name, 'w') as f:
    #         f.write('test')
    #     # upload file
    #     data = FileShareng.UploadFile(file_name)
    #     # remove file
    #     os.remove(file_name)
    #     # check if file was uploaded
    #     self.assertEqual(data['status'], 'success', 'File upload failed')

class CommonTestCase(TestCase):
    def setUp(self):
        pass

    def test_split_path(self):
        path = '/1/test/test.txt'
        data = split_path(path)
        self.assertEqual(data[0], '/1/test', 'Split path failed')
        self.assertEqual(data[1], 'test.txt', 'Split path failed')

    def test_add_uploaded_file(self):
        file_id = 'test.txt'
        hosting_name = 'fileshare'
        data = add_uploaded_file(file_id, hosting_name)
        self.assertEqual(data, None, 'Add uploaded file failed')

    # def test_file_id_by_path(self):
    #     path = '/1/test/test.txt'
    #     filename = 'test.txt'
    #     data = file_id_by_path(path, filename)
    #     self.assertEqual(data, 'test.txt', 'Get file id by path failed')