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

from pyengineer.tools import calculate_excel, create_json_results
np.set_printoptions(formatter={'float_kind': '{: .4e}'.format}, linewidth=200)

analysis = calculate_excel('./src/examples/excel/structure_011.xlsx', 'L1')

create_json_results('./src/examples/json/generate_results/structure_011_results_from_excel.json',
                    analysis)
