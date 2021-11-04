import unittest
from src.helpers import is_valid_uuid


class TestHelpers(unittest.TestCase):
    def test_is_valid_uuid(self):
        """
        Tests for checking if a given UUID is invalid or not.
        """
        uuid = "289d76f6-d8f1-4019-b4a7-ac23d6ad6318"

        self.assertTrue(is_valid_uuid(uuid))
        self.assertFalse(is_valid_uuid("Hello, world"))
        self.assertFalse(is_valid_uuid("definitely-not-a-uuid"))


if __name__ == "__main__":
    unittest.main()
