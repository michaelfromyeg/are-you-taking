from src.helpers import is_valid_uuid


def test_is_valid_uuid():
    uuid = "289d76f6-d8f1-4019-b4a7-ac23d6ad6318"

    assert is_valid_uuid(uuid) == True
    assert is_valid_uuid("Hello, world") == False
    assert is_valid_uuid("definitely-not-a-uuid") == False
