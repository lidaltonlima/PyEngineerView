"""Calculate structure from excel file"""
# pylint: disable=C0413
# Add project root to sys.path for imports ////////////////////////////////////////////////////////
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, '..', '..', '..')
sys.path.append(project_root)
# /////////////////////////////////////////////////////////////////////////////////////////////////

import numpy as np

from pyengineer.tools import calculate_excel

# Format output of numpy arrays
np.set_printoptions(formatter={'float_kind': '{: .4e}'.format}, linewidth=200)

# Calculate structure from excel file
analysis = calculate_excel(path='./src/examples/excel/structure_011.xlsx', load_name='L1')

# Print results
print(analysis.get_displacements('N2', 'L1'))
