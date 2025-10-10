"""Módulo para carregamentos/esforços"""
from __future__ import annotations

from typing import TYPE_CHECKING, Literal, TypedDict

from ._node import Node

if TYPE_CHECKING:
    from ._bar import Bar

class INodalLoadData(TypedDict):
    """Type of loads"""
    Fx: float
    Fy: float
    Fz: float
    Mx: float
    My: float
    Mz: float

class IBarLoadPointData(TypedDict):
    """Type of point loads in bars"""
    position: float
    system: Literal['local', 'global']
    Fx: float
    Fy: float
    Fz: float
    Mx: float
    My: float
    Mz: float

class IBarLoadDistributedData(TypedDict):
    """Type of point loads in bars"""
    x1: float
    x2: float
    system: Literal['local', 'global']
    Fx: tuple[float, float]
    Fy: tuple[float, float]
    Fz: tuple[float, float]
    Mx: tuple[float, float]
    My: tuple[float, float]
    Mz: tuple[float, float]

class Load:
    """Load cases used in the analysis"""
    name: str # Name of the load
    nodes_loads: dict[Node, dict[str, INodalLoadData]] # Node loads
    bars_loads_pt: dict[Bar, dict[str, IBarLoadPointData]] # Point loads in bars
    bars_loads_dist: dict[Bar, dict[str, IBarLoadDistributedData]] # Distributed loads in bars

    def __init__(self, name: str):
        """Load cases used in the analysis

        Args:
            name (str): Name of the load
        """
        self.name = name
        self.nodes_loads = {}
        self.bars_loads_pt = {}
        self.bars_loads_dist = {}

    def add_node_load(self, name: str, node: Node,
                      fx: float = 0, fy: float = 0, fz: float = 0,
                      mx: float = 0, my: float = 0, mz: float = 0):
        """Adds loads and efforts

        Args:
            name (str): Name of the load
            node (Node): Node where the load will be applied
            fx (float, optional): Force in "x". Defaults to 0.
            fy (float, optional): Force in "y". Defaults to 0.
            fz (float, optional): Force in "z". Defaults to 0.
            mx (float, optional): Moment in "x". Defaults to 0.
            my (float, optional): Moment in "y". Defaults to 0.
            mz (float, optional): Moment in "z". Defaults to 0.
        """

        if not node in self.nodes_loads:
            self.nodes_loads[node] = {}

        self.nodes_loads[node][name] = {'Fx': fx, 'Fy': fy, 'Fz': fz, 'Mx': mx, 'My': my, 'Mz': mz}

    def add_bar_load_pt(self, name: str, bar: Bar,
                           position: float,
                           system: Literal['local', 'global'] = 'local',
                           fx: float = 0, fy: float = 0, fz: float = 0,
                           mx: float = 0, my: float = 0, mz: float = 0):
        """Adds point loads in bar

        Args:
            name (str): Name of the load
            bar (Bar): Bar where the load will be applied
            position (float): Position of the load in the bar
            fx (float, optional): Force in "x". Defaults to 0.
            fy (float, optional): Force in "y". Defaults to 0.
            fz (float, optional): Force in "z". Defaults to 0.
            mx (float, optional): Moment in "x". Defaults to 0.
            my (float, optional): Moment in "y". Defaults to 0.
            mz (float, optional): Moment in "z". Defaults to 0.
        """
        if not bar in self.bars_loads_pt:
            self.bars_loads_pt[bar] = {}

        self.bars_loads_pt[bar][name] = {'position': position,
                                         'system': system,
                                         'Fx': fx, 'Fy': fy, 'Fz': fz,
                                         'Mx': mx, 'My': my, 'Mz': mz}

    def add_bar_load_dist(self, name: str, bar: Bar,
                           x1: float, x2: float,
                           system: Literal['local', 'global'] = 'local',
                           fx: tuple[float, float] = (0, 0),
                           fy: tuple[float, float] = (0, 0),
                           fz: tuple[float, float] = (0, 0),
                           mx: tuple[float, float] = (0, 0),
                           my: tuple[float, float] = (0, 0),
                           mz: tuple[float, float] = (0, 0)):
        """Adds distributed loads in bar

        Args:
            name (str): Name of the load
            bar (Bar): Bar where the load will be applied
            x1 (float): Start position of the load in the bar
            x2 (float): End position of the load in the bar
            system (Literal['local', 'global'], optional):
                Coordinate system of the load. Defaults to 'local'.
            fx (Tuple[float, float], optional):
                Force in "x" at the start and end of the load. Defaults to (0, 0).
            fy (Tuple[float, float], optional):
                Force in "y" at the start and end of the load. Defaults to (0, 0).
            fz (Tuple[float, float], optional):
                Force in "z" at the start and end of the load. Defaults to (0, 0).
            mx (Tuple[float, float], optional):
                Moment in "x" at the start and end of the load. Defaults to (0, 0).
            my (Tuple[float, float], optional):
                Moment in "y" at the start and end of the load. Defaults to (0, 0).
            mz (Tuple[float, float], optional):
                Moment in "z" at the start and end of the load. Defaults to (0, 0).
        """
        if not bar in self.bars_loads_dist:
            self.bars_loads_dist[bar] = {}

        self.bars_loads_dist[bar][name] = {'x1': x1, 'x2': x2,
                                           'system': system,
                                           'Fx': fx, 'Fy': fy, 'Fz': fz,
                                           'Mx': mx, 'My': my, 'Mz': mz}
