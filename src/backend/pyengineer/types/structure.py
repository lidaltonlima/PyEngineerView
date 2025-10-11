"""Typing for structure"""
from typing import Literal

from pydantic import BaseModel


class IMaterial(BaseModel):
    """Interface for material"""
    name: str
    properties: dict[Literal['E', 'G', 'nu', 'rho'], float]

class ISection(BaseModel):
    """Interface for section"""
    name: str
    area: float
    inertias: dict[Literal['Ix', 'Iy', 'Iz'], float]

class IStructure(BaseModel):
    """Interface"""
    materials: list[IMaterial]
    sections: list[ISection]
