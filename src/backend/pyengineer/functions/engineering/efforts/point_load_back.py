"""Stresses due to point loads on beams"""
from typing import TypedDict, Literal

import numpy as np
from numpy import float64
from numpy.typing import NDArray

class IForceEffort(TypedDict):
    """Interface for force efforts on beams"""
    N: NDArray[float64]  # Axial force
    Vy: NDArray[float64]  # Shear force in y direction
    Vz: NDArray[float64]  # Shear force in z direction
    T: NDArray[float64]  # Torsional moment
    My: NDArray[float64]  # Bending moment around y axis
    Mz: NDArray[float64]  # Bending moment around z axis

def force_effort(x: float,
                 length: float,
                 position: float,
                 forces: dict[Literal['Fx', 'Fy', 'Fz',
                                      'Mx', 'My', 'Mz'],
                              float],
                 reactions: dict[Literal['RFx', 'RFy', 'RFz',
                                         'RMx', 'RMy', 'RMz'],
                                 float]) -> IForceEffort:
    """Calculate the internal forces and moments at a given point along a beam.

    Args:
        x (float): Position along the beam where the efforts are calculated
        length (float): Length of the beam
        position (float): Position of the point load along the beam
        forces (dict[Literal['Fx', 'Fy', 'Fz', 'Mx', 'My', 'Mz'], float]):
            External forces applied to the beam
        reactions (dict[Literal['RFx', 'RFy', 'RFz', 'RMx', 'RMy', 'RMz'], float]):
            Support reactions at the beam's ends

    Raises:
        ValueError: If x is not between 0 and the length of the beam

    Returns:
        IForceEffort: Internal forces and moments at the given point
    """
    if x < 0 or x > length:
        raise ValueError('x must be between 0 and the length of the beam')

    efforts: IForceEffort = {
        'N': np.array([0, 0], dtype=float64),
        'Vy': np.array([0, 0], dtype=float64),
        'Vz': np.array([0, 0], dtype=float64),
        'T': np.array([0, 0], dtype=float64),
        'My': np.array([0, 0], dtype=float64),
        'Mz': np.array([0, 0], dtype=float64)
    }

    # Variables for functions /////////////////////////////////////////////////////////////////////
    # Forces *************************************************************************************
    fx = forces['Fx']
    fy = forces['Fy']
    fz = forces['Fz']
    mx = forces['Mx']
    my = forces['My']
    mz = forces['Mz']

    # Reactions ***********************************************************************************
    rfx = reactions['RFx']
    rfy = reactions['RFy']
    rfz = reactions['RFz']
    rmx = reactions['RMx']
    rmy = reactions['RMy']
    rmz = reactions['RMz']

    # Axial ///////////////////////////////////////////////////////////////////////////////////////
    # x direction *********************************************************************************
    if x == 0:
        efforts['N'] += np.array([0, -rfx], dtype=float64)
    elif x == position:
        efforts['N'] += np.array([-rfx, -rfx - fx], dtype=float64)
    elif x == length:
        efforts['N'] += np.array([-rfx - fx, 0], dtype=float64)
    elif x < position:
        efforts['N'] += np.array([-rfx, -rfx], dtype=float64)
    elif x > position:
        efforts['N'] += np.array([-rfx - fx, -rfx - fx], dtype=float64)

    # Shear ///////////////////////////////////////////////////////////////////////////////////////
    # y direction *********************************************************************************
    if x == 0:
        efforts['Vy'] += np.array([0, rfy], dtype=float64)
    elif x == position:
        efforts['Vy'] += np.array([rfy, rfy + fy], dtype=float64)
    elif x == length:
        efforts['Vy'] += np.array([rfy + fy, 0], dtype=float64)
    elif x < position:
        efforts['Vy'] += np.array([rfy, rfy], dtype=float64)
    elif x > position:
        efforts['Vy'] += np.array([rfy + fy, rfy + fy], dtype=float64)

    # z direction *********************************************************************************
    if x == 0:
        efforts['Vz'] += np.array([0, rfz], dtype=float64)
    elif x == position:
        efforts['Vz'] += np.array([rfz, rfz + fz], dtype=float64)
    elif x == length:
        efforts['Vz'] += np.array([rfz + fz, 0], dtype=float64)
    elif x < position:
        efforts['Vz'] += np.array([rfz, rfz], dtype=float64)
    elif x > position:
        efforts['Vz'] += np.array([rfz + fz, rfz + fz], dtype=float64)

    # Moment ///////////////////////////////////////////////////////////////////////////////////////
    # x direction *********************************************************************************
    # Because Mx ----------------------------------------------------------------------------------
    if x == 0:
        efforts['T'] += np.array([0, rmx], dtype=float64)
    elif x == position:
        efforts['T'] += np.array([rmx, rmx + mx], dtype=float64)
    elif x == length:
        efforts['T'] += np.array([rmx + mx, 0], dtype=float64)
    elif x < position:
        efforts['T'] += np.array([rmx, rmx], dtype=float64)
    elif x > position:
        efforts['T'] += np.array([rmx + mx, rmx + mx], dtype=float64)

    # y direction *********************************************************************************
    # Because the Fz ------------------------------------------------------------------------------
    if x == 0:
        efforts['My'] += np.array([0, rmy], dtype=float64)
    elif x == position:
        value = rmy + rfz * x
        efforts['My'] += np.array([value, value], dtype=float64)
    elif x == length:
        value = rmy - fz * position + (rfz + fz) * x
        efforts['My'] += np.array([value, 0], dtype=float64)
    elif x < position:
        value = rmy + rfz * x
        efforts['My'] += np.array([value, value], dtype=float64)
    elif x > position:
        value = rmy - fz * position + (rfz + fz) * x
        efforts['My'] += np.array([value, value], dtype=float64)

    # Because the My ------------------------------------------------------------------------------
    if x == 0:
        # This 0 because the moment at the start is already considered previously
        pass
    elif x == position:
        # Not adding rfz * x because it is already considered previously
        efforts['My'] += np.array([0, my], dtype=float64)
    elif x == length:
        # Not adding rfz * x because it is already considered previously
        efforts['My'] += np.array([my, 0], dtype=float64)
    elif x < position:
        # This 0 because the moment at the start is already considered previously
        pass
    elif x > position:
        # Not adding rfz * x because it is already considered previously
        efforts['My'] += np.array([my, my], dtype=float64)

    # z direction *********************************************************************************
    # Because the Fy ------------------------------------------------------------------------------
    if x == 0:
        efforts['Mz'] += np.array([0, -rmz], dtype=float64)
    elif x == position:
        value1 = -rmz + rfy * x
        value2 = -rmz - fy * position + (rfy + fy) * x
        efforts['Mz'] += np.array([value1, value2], dtype=float64)
    elif x == length:
        value = -rmz - fy * position + (rfy + fy) * x
        efforts['Mz'] = np.array([value, 0], dtype=float64)
    elif x < position:
        value = -rmz + rfy * x
        efforts['Mz'] = np.array([value, value], dtype=float64)
    elif x > position:
        value = -rmz - fy * position + (rfy + fy) * x
        efforts['Mz'] = np.array([value, value], dtype=float64)

    # Because the Mz ------------------------------------------------------------------------------
    if x == 0:
        # This 0 because the moment at the start is already considered previously
        pass
    elif x == position:
        efforts['Mz'] += np.array([0, -mz], dtype=float64)
    elif x == length:
        efforts['Mz'] += np.array([-mz, 0], dtype=float64)
    elif x < position:
        # This 0 because the moment at the start is already considered previously
        pass
    elif x > position:
        efforts['Mz'] += np.array([-mz, -mz], dtype=float64)

    # Return //////////////////////////////////////////////////////////////////////////////////////
    return efforts

# Test Fx /////////////////////////////////////////////////////////////////////////////////////////
# print(force_effort(4,
#                    5,
#                    2,
#                    {'Fx': 100, 'Fy': 0, 'Fz': 0, 'Mx': 0, 'My': 0, 'Mz': 0},
#                    {'RFx': -60, 'RFy': 0, 'RFz': 0, 'RMx': 0, 'RMy': 0, 'RMz': 0})['N'])

# Test Fy /////////////////////////////////////////////////////////////////////////////////////////
# print(force_effort(5,
#                    5,
#                    2,
#                    {'Fx': 0, 'Fy': 100, 'Fz': 0, 'Mx': 0, 'My': 0, 'Mz': 0},
#                    {'RFx': 0, 'RFy': -64.8, 'RFz':0, 'RMx': 0, 'RMy': 0, 'RMz': -72})['Mz'])

# Test Fz /////////////////////////////////////////////////////////////////////////////////////////
# print(force_effort(5,
#                    5,
#                    2,
#                    {'Fx': 0, 'Fy': 0, 'Fz': 100, 'Mx': 0, 'My': 0, 'Mz': 0},
#                    {'RFx': 0, 'RFy': 0, 'RFz': -64.8, 'RMx': 0, 'RMy': 72, 'RMz': 0})['My'])

# Test Mx /////////////////////////////////////////////////////////////////////////////////////////
# print(force_effort(5,
#                    5,
#                    2,
#                    {'Fx': 0, 'Fy': 0, 'Fz': 0, 'Mx': 100, 'My': 0, 'Mz': 0},
#                    {'RFx': 0, 'RFy': 0, 'RFz': 0, 'RMx': -60, 'RMy': 0, 'RMz': 0})['T'])

# Test My /////////////////////////////////////////////////////////////////////////////////////////
# print(force_effort(2,
#                    5,
#                    2,
#                    {'Fx': 0, 'Fy': 0, 'Fz': 0, 'Mx': 0, 'My': 100, 'Mz': 0},
#                    {'RFx': 0, 'RFy': 0, 'RFz': -28.8, 'RMx': 0, 'RMy': 12, 'RMz': 0})['Vz'])

# Test Mz /////////////////////////////////////////////////////////////////////////////////////////
# print(force_effort(3,
#                    5,
#                    2,
#                    {'Fx': 0, 'Fy': 0, 'Fz': 0, 'Mx': 0, 'My': 0, 'Mz': 100},
#                    {'RFx': 0, 'RFy': 28.8, 'RFz': 0, 'RMx': 0, 'RMy': 0, 'RMz': 12})['Vy'])

# Test All ////////////////////////////////////////////////////////////////////////////////////////
# print(force_effort(0,
#                    5,
#                    2,
#                    {'Fx': 100, 'Fy': 100, 'Fz': 100,
#                     'Mx': 0, 'My': 0, 'Mz': 0},
#                    {'RFx': -100, 'RFy': -100, 'RFz': -100,
#                     'RMx': 0, 'RMy': 200, 'RMz': -200})['Mz'])
print(force_effort(2,
                   5,
                   2,
                   {'Fx': 100, 'Fy': 100, 'Fz': 100,
                    'Mx': 100, 'My': 100, 'Mz': 100},
                   {'RFx': -60, 'RFy': -36, 'RFz': -93.6,
                    'RMx': -60, 'RMy': 84, 'RMz': -60})['Mz'])
