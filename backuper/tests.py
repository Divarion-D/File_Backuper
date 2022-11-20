from django.test import TestCase
from backuper.utils.filehosting import *

# Create your tests here.
class FileShareTestCase(TestCase):
    def setUp(self):
        pass

    def test_upload_file(self):
        # create a file
        file_name = 'test.txt'
        with open(file_name, 'w') as f:
            f.write('test')
        # upload file
        data = FileShareng.UploadFile(file_name)
        # check if file was uploaded
        self.assertEqual(data['status'], 'ok', 'File upload failed')
        # remove file
        os.remove(file_name)