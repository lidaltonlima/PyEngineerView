"""Work loads system"""
import numpy as np
from numpy import float64
from numpy.typing import NDArray

from ....types import PtLoad

def global2local_pt(load: PtLoad, rotation_matrix: NDArray[float64]) -> PtLoad:
    """Convert global loads to local loads using the rotation matrix"""
    if load['system'] == 'local':
        raise ValueError("Load is already in local system")

    fx = load['Fx']
    fy = load['Fy']
    fz = load['Fz']
    mx = load['Mx']
    my = load['My']
    mz = load['Mz']

    fx, fy, fz, mx, my, mz = rotation_matrix[0:6, 0:6] @ np.array([fx, fy, fz, mx, my, mz])

    return {'position': load['position'],
            'system': 'local',
            'Fx': fx, 'Fy': fy, 'Fz': fz,
            'Mx': mx, 'My': my, 'Mz': mz}
