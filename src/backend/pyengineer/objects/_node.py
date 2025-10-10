"""Nós da estrutura"""
import numpy as np
from numpy import float64
from numpy.typing import NDArray

class Node:
    """Node of the structure.
    Observações:
        - Todos nós devem esta associados a uma barra;
        - Não pode haver nós soltos;
        - Um único nó pode ser usado para vários elementos
    """
    name: str # Name of the node
    position: NDArray[float64] # (x, y, z) coordinates of the node
    x: float # x coordinate of the node
    y: float # y coordinate of the node
    z: float # z coordinate of the node
    def __init__(self, name: str, position: list[float]):
        """Node of the structure.

        Args:
            name (str): nome para pegar dados do nó.
            coordinates (list[float]): (x, y, z) coordenada do nó.
        """
        self.name = name
        self.position = np.array(position, dtype=float64)
        self.x = float(position[0])
        self.y = float(position[1])
        self.z = float(position[2])
