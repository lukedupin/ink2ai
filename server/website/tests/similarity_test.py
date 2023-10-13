from django.test import TestCase
from ephae.similarity import find_spans
import numpy as np


class UtilTest(TestCase):
    @classmethod
    def setUpClass(cls):
        pass

    def setUp(self):
        pass

    def test_find_spans(self):
        # Test with no elements over the threshold
        self.assertEquals(find_spans(np.array([0, 0, 0, 0])), [])

        # Test with all elements over the threshold
        self.assertEquals(find_spans(np.array([1, 1, 1, 1])), [(0, 3)])

        # Test with a span starting at the first element
        self.assertEquals(find_spans(np.array([1, 1, 0, 0])), [(0, 1)])

        # Test with a span ending at the last element
        self.assertEquals(find_spans(np.array([0, 0, 1, 1])), [(2, 3)])

        # Test with multiple spans
        self.assertEquals(find_spans(np.array([0, 1, 1, 0, 0, 1, 1, 1, 0])), [(1, 2), (5, 7)])

        # Test with spans separated by a single element under the threshold
        self.assertEquals(find_spans(np.array([1, 1, 0, 1, 1])), [(0, 1), (3, 4)])
