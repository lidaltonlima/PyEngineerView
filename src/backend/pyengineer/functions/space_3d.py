"""Funções úteis para para manipulação de objetos no espaço tridimensional"""
import numpy as np
from numpy.typing import NDArray
from numpy import float64

def rotate_point_around_line(point_p: list[float] | np.ndarray,
                             point_a: list[float] | np.ndarray,
                             point_b: list[float] | np.ndarray,
                             angle: float) -> np.ndarray:
    """Rotaciona um ponto "p" em torno de uma reta definida pelos pontos "a" e "b"

    Args:
        point_p (list[float] | np.ndarray): (x, y, z) Ponto a ser rotacionado
        point_a (list[float] | np.ndarray): (x, y, z) Ponto da reta
        point_b (list[float] | np.ndarray): (x, y, z) Ponto da reta
        angle (float): ângulo de rotação em radianos

    Returns:
        np.ndarray: novas coordenadas do ponto "p"
    """
    point_p = np.array(point_p, dtype=float)
    point_a = np.array(point_a, dtype=float)
    point_b = np.array(point_b, dtype=float)

    # Vetor unitário da direção da reta (eixo de rotação)
    u = point_b - point_a
    u = u / np.linalg.norm(u)

    # Translada para a origem (reta passa pela origem)
    p_relative = point_p - point_a

    # Fórmula de Rodrigues para rotação em torno de um eixo arbitrário
    cos_theta = np.cos(angle)
    sin_theta = np.sin(angle)
    cross = np.cross(u, p_relative)
    dot = np.dot(u, p_relative)
    rotated = (p_relative * cos_theta +
               cross * sin_theta +
               u * dot * (1 - cos_theta))

    # Translada de volta
    return rotated + point_a

def point_in_line(point: list[float] | NDArray[float64],
                  start: list[float] | NDArray[float64],
                  end: list[float] | NDArray[float64],
                  tolerance: float = 1e-9) -> bool:
    """Verify if a point is on a line segment defined by two points.

    Args:
        point (list[float]): Point to check
        start (list[float]): Start point of the line segment
        end (list[float]): End point of the line segment
        tolerance (float, optional): Tolerance for floating point comparison. Defaults to 1e-9.

    Returns:
        bool: True if the point is on the line segment, False otherwise.
    """
    # Vectors
    v1 = (end[0] - start[0], end[1] - start[1], end[2] - start[2])
    v2 = (point[0] - start[0], point[1] - start[1], point[2] - start[2])

    # Vector cross product to check collinearity
    cross_product = (
        v1[1]*v2[2] - v1[2]*v2[1],
        v1[2]*v2[0] - v1[0]*v2[2],
        v1[0]*v2[1] - v1[1]*v2[0]
    )

    # Verify if cross product is near zero vector
    if any(abs(c) > tolerance for c in cross_product):
        return False

    # Check if point is between start and end using scalar projection
    def inside(a: float, b: float, c: float) -> bool:
        return min(a, b) - tolerance <= c <= max(a, b) + tolerance

    return (
        inside(start[0], end[0], point[0]) and
        inside(start[1], end[1], point[1]) and
        inside(start[2], end[2], point[2])
    )


def distance_two_points(first_point: list[float] | NDArray[float64],
                        second_point: list[float] | NDArray[float64]) -> float:
    """Calculate the Euclidean distance between two points in 3D space.

    Args:
        first_point (list[float] | np.ndarray): (x, y, z) Coordinates of the first point
        second_point (list[float] | np.ndarray): (x, y, z) Coordinates of the second point

    Returns:
        float: Euclidean distance between the two points
    """
    first_point = np.array(first_point, dtype=float)
    second_point = np.array(second_point, dtype=float)

    distance = np.sqrt((second_point[0] - first_point[0])**2 +
                       (second_point[1] - first_point[1])**2 +
                       (second_point[2] - first_point[2])**2)
    return distance
