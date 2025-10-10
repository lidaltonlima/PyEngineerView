"""Typing"""
from typing import TypedDict, Literal

ReleasesType = Literal['Dxi', 'Dyi', 'Dzi', 'Rxi', 'Ryi', 'Rzi',
                       'Dxj', 'Dyj', 'Dzj', 'Rxj', 'Ryj', 'Rzj']

class PtLoad(TypedDict):
    """Point load in segment"""
    position: float  # Position of the load in the segment (0 to 1)
    system: Literal['global', 'local']  # Coordinate system of the load
    Fx: float      # Force in X direction
    Fy: float      # Force in Y direction
    Fz: float      # Force in Z direction
    Mx: float      # Moment about X axis
    My: float      # Moment about Y axis
    Mz: float      # Moment about Z axis
