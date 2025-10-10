"""Módulo para materiais que serão usados na estrutura"""
from typing import TypedDict

class IMaterialProperties(TypedDict):
    """Typing for properties attribute"""
    E: float
    G: float
    nu: float
    rho: float

class Material:
    """Material for elements of the structure"""
    name: str # Name of the material
    properties: IMaterialProperties # Properties of the material

    def __init__(self, name: str, e: float, g: float, nu: float, rho: float):
        """Construtor

        Args:
            name (str): Name of the material
            e (float): Elastic modulus
            g (float): Transverse elastic modulus
            nu (float): Poisson's ratio
            rho (float): Density
        """
        self.name = name
        self.properties = {'E': e, 'G': g, 'nu': nu, 'rho': rho}
