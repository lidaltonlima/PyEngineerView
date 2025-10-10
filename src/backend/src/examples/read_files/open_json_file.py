"""Calculate structure from json file"""
# pylint: disable=C0413
# Add project root to sys.path for imports ////////////////////////////////////////////////////////
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, '..', '..', '..')
sys.path.append(project_root)
# /////////////////////////////////////////////////////////////////////////////////////////////////

import numpy as np

from pyengineer.tools import calculate_json#, create_json_input#, create_json_results

# Format output of numpy arrays
np.set_printoptions(formatter={'float_kind': '{: .4e}'.format}, linewidth=200)

# Calculate structure from json file
analysis = calculate_json('./src/examples/json/structures/structure_011.json')

# Print results
print(analysis.get_displacements('N2', 'L1'))
