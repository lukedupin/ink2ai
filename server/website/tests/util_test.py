from django.test import TestCase
from ephae.search import searchInit, zip_unflatten

# Create your tests here.
class UtilTest(TestCase):
    @classmethod
    def setUpClass(cls):
        searchInit()

    def setUp(self):
        pass

    def test_zip_unflattent1(self):
        # Test 1
        xss = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        flat1 = [10, 20, 30, 40, 50, 60, 70, 80, 90]
        flat2 = [100, 200, 300, 400, 500, 600, 700, 800, 900]

        zipped = zip_unflatten(xss, flat1, flat2)

        expected = [
            [(1, 10, 100), (2, 20, 200), (3, 30, 300)],
            [(4, 40, 400), (5, 50, 500), (6, 60, 600)],
            [(7, 70, 700), (8, 80, 800), (9, 90, 900)]
        ]
        self.assertEquals( zipped, expected )

    def test_zip_unflattent2(self):
        # Test 2, ragged list of lists
        xss = [[1], [2, 3, 4], [5, 6]]
        flat1 = [10, 20, 30, 40, 50, 60]
        flat2 = [100, 200, 300, 400, 500, 600]
        flat3 = [1000, 2000, 3000, 4000, 5000, 6000]

        zipped = zip_unflatten(xss, flat1, flat2, flat3)

        expected = [
            [(1, 10, 100, 1000)],
            [(2, 20, 200, 2000), (3, 30, 300, 3000), (4, 40, 400, 4000)],
            [(5, 50, 500, 5000), (6, 60, 600, 6000)]
        ]
        self.assertEquals(zipped, expected)
