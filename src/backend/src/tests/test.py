"""Example generate calculate structure from Excel."""
# pylint: disable=C0413
# Add project root to sys.path for imports ////////////////////////////////////////////////////////
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, '..', '..')
sys.path.append(project_root)
# /////////////////////////////////////////////////////////////////////////////////////////////////
from pyengineer.tools import calculate_excel


analysis = calculate_excel('./src/examples/excel/wrong_structure.xlsx', 'L1', calculate=True)
print(analysis.bars)
