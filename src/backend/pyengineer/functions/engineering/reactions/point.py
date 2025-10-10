"""
Functions to calculate reactions in bars with point load.
All functions fo point loads in "Análise de Estruturas" by
    Umberto Lima Soriano and Silvio de Souza Lima.
"""
from typing import Literal


# Forces //////////////////////////////////////////////////////////////////////////////////////////
# Force in x direction ****************************************************************************
def force_x(
        length: float,
        x: float,
        p: float
    ) -> dict[Literal['Rxa', 'Rxb'], float]:
    """Calculates the reactions of a bar with a point axial load in x direction.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the position is not in the range 0 <= x <= L

    Returns:
        dict[Literal['Rxa', 'Rxb'], float]: The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x <= length) is False:
        raise ValueError("Need 0 <= x <= L.")

    a = x
    b = length - x
    l = length
    reaction_a = -p * b / l
    reaction_b = -p * a / l

    return {'Rxa': reaction_a, 'Rxb': reaction_b}

# Force in y direction ****************************************************************************
def force_y(
        length: float,
        x: float,
        p: float
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a point transverse load in y direction.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the position is not in the range 0 <= x <= L

    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x <= length) is False:
        raise ValueError("Need 0 <= x <= L.")

    a = x
    b = length - x
    l = length

    moment_a = -(p * a * b**2) / l**2
    moment_b = (p * a**2 * b) / l**2
    reaction_a = -((p * b / l) - (moment_a + moment_b) / l)
    reaction_b = -((p * a / l) + (moment_a + moment_b) / l)

    return {'Rya': reaction_a, 'Ryb': reaction_b, 'Mza': moment_a, 'Mzb': moment_b}

# Force in z direction ****************************************************************************
def force_z(
        length: float,
        x: float,
        p: float
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a point transverse load in z direction.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the position is not in the range 0 <= x <= L

    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x <= length) is False:
        raise ValueError("Need 0 <= x <= L.")

    a = x
    b = length - x
    l = length

    moment_a = (p * a * b**2) / l**2
    moment_b = -(p * a**2 * b) / l**2
    reaction_a = -((p * b / l) + (moment_a + moment_b) / l)
    reaction_b = -((p * a / l) - (moment_a + moment_b) / l)

    return {'Rza': reaction_a, 'Rzb': reaction_b, 'Mya': moment_a, 'Myb': moment_b}

# Moments /////////////////////////////////////////////////////////////////////////////////////////
# Moment in x direction ***************************************************************************
def moment_x(
        length: float,
        x: float,
        m: float
    ) -> dict[Literal['Mxa', 'Mxb'], float]:
    """Calculates the reactions of a bar with a point moment around x axis.
    Args:
        length (float): Length of the bar
        x (float): Position of the moment
        m (float): Intensity of the moment
    Raises:
        ValueError: If the position is not in the range 0 <= x <= L
    Returns:
        dict[Literal['Mxa', 'Mxb'], float]: The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x <= length) is False:
        raise ValueError("Need 0 <= x <= L.")

    a = x
    b = length - x
    l = length

    torque_a = -m * b / l
    torque_b = -m * a / l

    return {'Mxa': torque_a, 'Mxb': torque_b}

# Moment in y direction ***************************************************************************
def moment_y(
        length: float,
        x: float,
        m: float
    ) -> dict[Literal['Mya', 'Myb', 'Rza', 'Rzb'], float]:
    """Calculates the reactions of a bar with a point moment around y axis.
    Args:
        length (float): Length of the bar
        x (float): Position of the moment
        m (float): Intensity of the moment
    Raises:
        ValueError: If the position is not in the range 0 <= x <= L
    Returns:
        dict[Literal['Mya', 'Myb', 'Rza', 'Rzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x <= length) is False:
        raise ValueError("Need 0 <= x <= L.")

    a = x
    b = length - x
    l = length

    moment_a = ((m * b) / l**2) * (2*a - b)
    moment_b = ((m * a) / l**2) * (2*b - a)
    reaction_a = -(6 * m * a * b) / l**3
    reaction_b = (6 * m * a * b) / l**3

    return {'Mya': moment_a, 'Myb': moment_b, 'Rza': reaction_a, 'Rzb': reaction_b}

# Moment in z direction ***************************************************************************
def moment_z(
        length: float,
        x: float,
        m: float
    ) -> dict[Literal['Mza', 'Mzb', 'Rya', 'Ryb'], float]:
    """Calculates the reactions of a bar with a point moment around z axis.
    Args:
        length (float): Length of the bar
        x (float): Position of the moment
        m (float): Intensity of the moment
    Raises:
        ValueError: If the position is not in the range 0 <= x <= L
    Returns:
        dict[Literal['Mza', 'Mzb', 'Rya', 'Ryb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x <= length) is False:
        raise ValueError("Need 0 <= x <= L.")

    a = x
    b = length - x
    l = length

    moment_a = ((m * b) / l**2) * (2*a - b)
    moment_b = ((m * a) / l**2) * (2*b - a)
    reaction_a = (6 * m * a * b) / l**3
    reaction_b = -(6 * m * a * b) / l**3

    return {'Mza': moment_a, 'Mzb': moment_b, 'Rya': reaction_a, 'Ryb': reaction_b}
