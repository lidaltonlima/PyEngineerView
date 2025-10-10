"""Example generate calculate structure from Excel."""
# pylint: disable=C0413
# Add project root to sys.path for imports ////////////////////////////////////////////////////////
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, '..', '..', '..')
sys.path.append(project_root)
# /////////////////////////////////////////////////////////////////////////////////////////////////

from pyengineer.tools import create_calculated_structure, calculate_excel


# Calculate structure from json file
analysis = calculate_excel('./src/examples/excel/structure_011.xlsx', 'L1')

# Create json file from calculated structure
PATH = './src/examples/json/generate_calculated_structure/calculated_structure_011_from_excel.json'
create_calculated_structure(PATH, analysis)
