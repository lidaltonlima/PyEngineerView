"""Sections for elements of the structure"""
from typing import TypedDict

class ISectionProperties(TypedDict):
    """Typing for section properties"""
    area: float
    Ix: float
    Iy: float
    Iz: float

class Section:
    """Section for elements of the structure"""
    name: str # Name of the section
    properties: ISectionProperties # Properties of the section

    def __init__(self,
                 name: str,
                 area: float,
                 ix: float, iy: float, iz: float):
        """Section for elements of the structure

        Args:
            name (str): Section name
            area (float): Section area
            ix (float): Inertia in 'x' of the section (polar inertia)
            iy (float): Inertia in 'y' of the section
            iz (float): Inertia in 'z' of the section
        """
        self.name = name
        self.properties = {'area': area, 'Ix': ix, 'Iy': iy, 'Iz': iz}
