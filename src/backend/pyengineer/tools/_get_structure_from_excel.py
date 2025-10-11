"""Create JSON results file for calculated structure"""
import json
from typing import Any

from ._calculate_excel import calculate_excel
from ._create_calculated_structure import create_calculated_structure


def get_structure_from_excel(path: str) -> dict[str, Any]:
    """Create a JSON results file for the linear analysis.

    Args:
        path (str): The path to the JSON file to create.
        analysis (Linear): The linear analysis object containing results.
    """
    # Calculate structure from json file
    analysis = calculate_excel(path, 'L1', False)

    # Create json file from calculated structure
    temp_path = './pyengineer/temp/structure_calculated.json'
    create_calculated_structure(temp_path, analysis)

    with open(temp_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    return data
