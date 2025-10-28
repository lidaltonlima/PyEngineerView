"""Example structure definition in Python."""
# pylint: disable=C0413
# Add project root to sys.path for imports ////////////////////////////////////////////////////////
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, '..', '..', '..')
sys.path.append(project_root)
# /////////////////////////////////////////////////////////////////////////////////////////////////

import numpy as np

import pyengineer as pg
from pyengineer import analysis

# Output format
np.set_printoptions(formatter={'float_kind': '{: .4e}'.format}, linewidth=200)

# Materials
material = pg.Material('steel', 2e11, 7.692308e10, 0.3, 7850)

# Sections
section = pg.Section('L32x32#3.2', area=1.944e-4, ix=6.9323e-10, iy=8.8265e-8, iz=8.8265e-8)

# Nodes
nodes: list[pg.Node] = []
n1 = pg.Node('N1', [0, 0, 0])
nodes.append(n1)
n2 = pg.Node('N2', [3, 0, 0])
nodes.append(n2)

# Bars
bars: list[pg.Bar] = []
b1 = pg.Bar('B1', n1, n2, section, material, 10)
bars.append(b1)


# Loads
loads: list[pg.Load] = []
load = pg.Load('L1')
load.add_node_load('FN1', n2, fz=100)
loads.append(load)

# Supports
support = pg.Support()
support.add_support(n1, dx=True, dy=True, dz=True, rx=True, ry=True, rz=True)

# Analysis
linear_analysis = analysis.Linear(nodes, bars, loads, support)

# Results
print(linear_analysis.get_displacements('N2', 'L1'))
