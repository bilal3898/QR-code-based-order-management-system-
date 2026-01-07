import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_secret(key: str, default=None):
    """
    Retrieves a secret value from environment variables.

    :param key: The name of the environment variable.
    :param default: Optional default value if the key is not found.
    :return: The secret value or the default.
    """
    value = os.getenv(key)
    if value is None and default is not None:
        return default
    if value is None:
        raise KeyError(f"Secret key '{key}' not found in environment variables.")
    return value
