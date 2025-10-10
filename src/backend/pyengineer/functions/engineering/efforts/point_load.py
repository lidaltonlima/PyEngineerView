"""Efforts in segment"""
from math import isclose

import numpy as np
from numpy import float64
from numpy.typing import NDArray

from ....types import PtLoad
from ..loads.system import global2local_pt


def normal(x: float,
           length: float,
           pt_loads: list[PtLoad],
           rotation_matrix: NDArray[float64],
           extreme_forces: NDArray[float64] = \
               np.array([0, 0, 0, 0, 0, 0,
                         0, 0, 0, 0, 0, 0], dtype=float64)) -> NDArray[float64]:
    """Normal force at position x due to point loads"""
    if x < 0 or x > length:
        raise ValueError("Position x is out of bounds")

    # Convert loads to local coordinates if necessary
    for i, load in enumerate(pt_loads):
        if load['system'] == 'global':
            pt_loads[i] = global2local_pt(load, rotation_matrix)

    # Calculate normal force at position x due to point loads
    if x == 0:
        return np.array([0, extreme_forces[0]], dtype=float64)
    if isclose(x, length):
        return np.array([extreme_forces[6], 0], dtype=float64)

    n = np.array([extreme_forces[0], extreme_forces[0]], dtype=float64)
    for load in pt_loads:
        if load['position'] < x:
            n[0] -= load['Fx']
        if load['position'] <= x:
            n[1] -= load['Fx']
    return n

def shear_y(x: float,
            length: float,
            pt_loads: list[PtLoad],
            rotation_matrix: NDArray[float64],
            extreme_forces: NDArray[float64] = \
                np.array([0, 0, 0, 0, 0, 0,
                          0, 0, 0, 0, 0, 0], dtype=float64)) -> NDArray[float64]:
    """Shear force at position x due to point loads"""
    if x < 0 or x > length:
        raise ValueError("Position x is out of bounds")

    # Convert loads to local coordinates if necessary
    for i, load in enumerate(pt_loads):
        if load['system'] == 'global':
            pt_loads[i] = global2local_pt(load, rotation_matrix)

    # Calculate shear force at position x due to point loads
    if x == 0:
        return np.array([0, extreme_forces[1]], dtype=float64)
    if isclose(x, length):
        return np.array([extreme_forces[7], 0], dtype=float64)

    vy = np.array([extreme_forces[1], extreme_forces[1]], dtype=float64)
    for load in pt_loads:
        if load['position'] < x:
            vy[0] += load['Fy']
        if load['position'] <= x:
            vy[1] += load['Fy']
    return vy

def shear_z(x: float,
            length: float,
            pt_loads: list[PtLoad],
            rotation_matrix: NDArray[float64],
            extreme_forces: NDArray[float64] = \
                np.array([0, 0, 0, 0, 0, 0,
                          0, 0, 0, 0, 0, 0], dtype=float64)) -> NDArray[float64]:
    """Shear force at position x due to point loads"""
    if x < 0 or x > length:
        raise ValueError("Position x is out of bounds")

    # Convert loads to local coordinates if necessary
    for i, load in enumerate(pt_loads):
        if load['system'] == 'global':
            pt_loads[i] = global2local_pt(load, rotation_matrix)

    # Calculate shear force at position x due to point loads

    if x == 0:
        return np.array([0, extreme_forces[2]], dtype=float64)
    if isclose(x, length):
        return np.array([extreme_forces[8], 0], dtype=float64)

    vz = np.array([extreme_forces[2], extreme_forces[2]], dtype=float64)
    for load in pt_loads:
        if load['position'] < x:
            vz[0] += load['Fz']
        if load['position'] <= x:
            vz[1] += load['Fz']
    return vz

def moment_x(x: float,
             length: float,
             pt_loads: list[PtLoad],
             rotation_matrix: NDArray[float64],
             extreme_forces: NDArray[float64] = \
                 np.array([0, 0, 0, 0, 0, 0,
                           0, 0, 0, 0, 0, 0], dtype=float64)) -> NDArray[float64]:
    """Bending moment at position x due to point loads"""
    if x < 0 or x > length:
        raise ValueError("Position x is out of bounds")

    # Convert loads to local coordinates if necessary
    for i, load in enumerate(pt_loads):
        if load['system'] == 'global':
            pt_loads[i] = global2local_pt(load, rotation_matrix)

    # Calculate moment force at position x due to point loads
    if x == 0:
        return np.array([0, extreme_forces[3]], dtype=float64)
    if isclose(x, length):
        return np.array([extreme_forces[9], 0], dtype=float64)

    mx = np.array([extreme_forces[3], extreme_forces[3]], dtype=float64)
    for load in pt_loads:
        if load['position'] < x:
            mx[0] += load['Mx']
        if load['position'] <= x:
            mx[1] += load['Mx']

    return mx

def moment_y(x: float,
             length: float,
             pt_loads: list[PtLoad],
             rotation_matrix: NDArray[float64],
             extreme_forces: NDArray[float64] = \
                 np.array([0, 0, 0, 0, 0, 0,
                           0, 0, 0, 0, 0, 0], dtype=float64)) -> NDArray[float64]:
    """Bending moment at position x due to point loads"""
    if x < 0 or x > length:
        raise ValueError("Position x is out of bounds")

    # Convert loads to local coordinates if necessary
    for i, load in enumerate(pt_loads):
        if load['system'] == 'global':
            pt_loads[i] = global2local_pt(load, rotation_matrix)

    # Calculate moment force at position x due to point loads
    if x == 0:
        return np.array([0, extreme_forces[4]], dtype=float64)
    if isclose(x, length):
        return np.array([extreme_forces[10], 0], dtype=float64)

    disc = sorted([load['position'] for load in pt_loads if 0 < load['position'] < length])
    my = np.array([extreme_forces[4], extreme_forces[4]], dtype=float64)
    for load in pt_loads:
        if load['position'] < x:
            my[0] += load['My']
        if load['position'] <= x:
            my[1] += load['My']

    for i in range(len(disc) + 1):
        # Initial position of the segment
        if i == 0:
            x0 = 0
        else:
            x0 = disc[i - 1]

        # Final position of the segment
        if i == len(disc):
            x1 = length
        else:
            x1 = disc[i]

        # Rotation matrix is identity because the loads have already been converted
        # to local coordinates
        if x0 < x <= x1:
            my[0] += shear_z(x, length, pt_loads, np.eye(12), extreme_forces)[0] * (x - x0)
            my[1] += shear_z(x, length, pt_loads, np.eye(12), extreme_forces)[0] * (x - x0)
            break

        my[0] += shear_z(x1, length, pt_loads, np.eye(12), extreme_forces)[0] * (x1 - x0)
        my[1] += shear_z(x1, length, pt_loads, np.eye(12), extreme_forces)[0] * (x1 - x0)


    return my

def moment_z(x: float,
             length: float,
             pt_loads: list[PtLoad],
             rotation_matrix: NDArray[float64],
             extreme_forces: NDArray[float64] = \
                 np.array([0, 0, 0, 0, 0, 0,
                           0, 0, 0, 0, 0, 0], dtype=float64)) -> NDArray[float64]:
    """Bending moment at position x due to point loads"""
    if x < 0 or x > length:
        raise ValueError("Position x is out of bounds")

    # Convert loads to local coordinates if necessary
    for i, load in enumerate(pt_loads):
        if load['system'] == 'global':
            pt_loads[i] = global2local_pt(load, rotation_matrix)

    # Calculate moment force at position x due to point loads
    if x == 0:
        return np.array([0, extreme_forces[5]], dtype=float64)
    if isclose(x, length):
        return np.array([extreme_forces[11], 0], dtype=float64)

    disc = sorted([load['position'] for load in pt_loads if 0 < load['position'] < length])
    mz = np.array([extreme_forces[5], extreme_forces[5]], dtype=float64)
    for load in pt_loads:
        if load['position'] < x:
            mz[0] -= load['Mz']
        if load['position'] <= x:
            mz[1] -= load['Mz']

    for i in range(len(disc) + 1):
        # Initial position of the segment
        if i == 0:
            x0 = 0
        else:
            x0 = disc[i - 1]

        # Final position of the segment
        if i == len(disc):
            x1 = length
        else:
            x1 = disc[i]

        if x0 < x <= x1:
            mz[0] += shear_y(x, length, pt_loads, np.eye(12), extreme_forces)[0] * (x - x0)
            mz[1] += shear_y(x, length, pt_loads, np.eye(12), extreme_forces)[0] * (x - x0)
            break

        mz[0] += shear_y(x1, length, pt_loads, np.eye(12), extreme_forces)[0] * (x1 - x0)
        mz[1] += shear_y(x1, length, pt_loads, np.eye(12), extreme_forces)[0] * (x1 - x0)


    return mz
