"""Functions for general use."""
from typing import Any


def is_number(value: Any) -> bool:
    """Check if value is a number (int or float).

    Args:
        value (Any): The value to check.

    Returns:
        bool: True if value is a number, False otherwise.
    """
    return (isinstance(value, (int, float, complex)) and not isinstance(value, bool))
