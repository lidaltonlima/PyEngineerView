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

from pyengineer.tools import calculate_json, create_json_results

np.set_printoptions(formatter={'float_kind': '{: .4e}'.format}, linewidth=200)

analysis = calculate_json('./src/examples/json/structures/structure_010.json')

create_json_results('./src/examples/json/generate_results/structure_010_results_from_json.json',
                    analysis)
