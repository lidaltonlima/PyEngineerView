"""Calculate shear forces"""


def shear(x: float, length: float, v1: float, w1: float, w2: float) -> float:
    """Calculate the shear force at a given position along a beam.

    Args:
        x (float): Position along the beam where shear force is calculated.
        length (float): Total length of the beam.
        v1 (float): Shear force at the left end of the beam.
        w1 (float): Uniformly distributed load on the left segment of the beam.
        w2 (float): Uniformly distributed load on the right segment of the beam.

    Raises:
        ValueError: If the position x is outside the beam length.

    Returns:
        float: Shear force at position x.
    """
    if x < 0 or x > length:
        raise ValueError('Position x must be within the length of the beam (0 <= x <= L).')

    vx = v1 + w1*x + (x**2 * (w2 - w1)) / (2 * length)

    return vx

print(shear(5, 5, -400, 100, 300))
