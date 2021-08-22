from uuid import UUID


def is_valid_uuid(to_test: str, version=4):
    try:
        UUID(to_test, version=version)
    except ValueError:
        return False
    return True
