"""Typing for structure"""
from typing import Literal

from pydantic import BaseModel

# Material Interface //////////////////////////////////////////////////////////////////////////////
class IMaterialProperties(BaseModel):
    """Interface for material properties"""
    E: float
    G: float
    nu: float
    rho: float

class IMaterial(BaseModel):
    """Interface for material"""
    name: str
    properties: IMaterialProperties

# Section Interface ///////////////////////////////////////////////////////////////////////////////
class ISectionInertias(BaseModel):
    """Interface for inertias"""
    Ix: float
    Iy: float
    Iz: float

class ISection(BaseModel):
    """Interface for section"""
    name: str
    area: float
    inertias: ISectionInertias

# Node Interface //////////////////////////////////////////////////////////////////////////////////
class INode(BaseModel):
    """Interface for nodes"""
    name: str
    position: list[float]  # [x, y, z]

# Bar Interface ///////////////////////////////////////////////////////////////////////////////////
class IBar(BaseModel):
    """Interface for bars"""
    name: str
    start_node: str
    end_node: str
    section: str
    material: str
    rotation: float
    releases: list[Literal['Dxi', 'Dyi', 'Dzi',
                           'Rxi', 'Ryi', 'Rzi',
                           'Dxj', 'Dyj', 'Dzj',
                           'Rxj', 'Ryj', 'Rzj']]

# Support Interface ///////////////////////////////////////////////////////////////////////////////
class ISupportType(BaseModel):
    """Interface for support types"""
    Dx: bool | float
    Dy: bool | float
    Dz: bool | float
    Rx: bool | float
    Ry: bool | float
    Rz: bool | float

class ISupport(BaseModel):
    """Interface for supports"""
    node: str
    supports: ISupportType

# Loads Interface /////////////////////////////////////////////////////////////////////////////////
class INodeLoadType(BaseModel):
    """Interface for node load types"""
    Fx: float
    Fy: float
    Fz: float
    Mx: float
    My: float
    Mz: float

class INodeLoads(BaseModel):
    """Interface for point loads"""
    name: str
    node: str
    loads: INodeLoadType

class IBarPtLoadType(BaseModel):
    """Interface for bar load types"""
    Fx: float
    Fy: float
    Fz: float
    Mx: float
    My: float
    Mz: float

class IBarPointLoads(BaseModel):
    """Interface for bar point loads"""
    name: str
    bar: str
    position: float
    system: Literal['local', 'global']
    loads: IBarPtLoadType

class IBarDistLoadType(BaseModel):
    """Interface for bar load types"""
    Fx: tuple[float, float] # [start, end]
    Fy: tuple[float, float] # [start, end]
    Fz: tuple[float, float] # [start, end]
    Mx: tuple[float, float] # [start, end]
    My: tuple[float, float] # [start, end]
    Mz: tuple[float, float] # [start, end]

class IBarDistLoads(BaseModel):
    """Interface for bar distributed loads"""
    name: str
    bar: str
    position: tuple[float, float]  # [start, end]
    system: Literal['local', 'global']
    loads: IBarDistLoadType

class IBarLoads(BaseModel):
    """Interface for bar loads"""
    point: list[IBarPointLoads]
    distributed: list[IBarDistLoads]

class ILoad(BaseModel):
    """Interface for loads"""
    name: str
    nodes: list[INodeLoads]
    bars: IBarLoads

# Structure Interface /////////////////////////////////////////////////////////////////////////////
class IStructure(BaseModel):
    """Interface"""
    materials: list[IMaterial]
    sections: list[ISection]
    nodes: list[INode]
    bars: list[IBar]
    supports: list[ISupport]
    loads: list[ILoad]
