"""
Functions to calculate reactions in bars with load in all length of the bar.
"""

from typing import Literal

from ...space_2d import root_line
from . import point

# x direction /////////////////////////////////////////////////////////////////////////////////////
# Forces ******************************************************************************************
def force_x_rec(
        length: float,
        p: float
    ) -> dict[Literal['Rxa', 'Rxb'], float]:
    """Calculates the reactions of a bar with a distributed load in x direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Rxa', 'Rxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reaction_a = -(p * l) / 2
    reaction_b = -(p * l) / 2

    return {'Rxa': reaction_a, 'Rxb': reaction_b}

def force_x_tri(
        length: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rxa', 'Rxb'], float]:
    """Calculates the reactions of a bar with a distributed load in x direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Rxa', 'Rxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reactions: dict[Literal['Rxa', 'Rxb'], float] = {'Rxa': 0, 'Rxb': 0}

    match direction:
        case 'up':
            reactions['Rxa'] = -(p * l) / 6
            reactions['Rxb'] = -(p * l) / 3
        case 'down':
            reactions['Rxa'] = -(p * l) / 3
            reactions['Rxb'] = -(p * l) / 6
        case _:
            raise ValueError('Direction only "up" and "down"')

    return reactions

def force_x_trap(
        length: float,
        p1: float, p2: float
    ) -> dict[Literal['Rxa', 'Rxb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in x direction
        and all length of the bar.
    Args:
        length (float): Length of the bar
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rxa', 'Rxb'], float]: The reactions at the two ends of the bar (A and B)
    """
    if p1 == p2 == 0:
        return {'Rxa': 0, 'Rxb': 0}

    rectangular_reactions: dict[Literal['Rxa', 'Rxb'], float] = {'Rxa': 0, 'Rxb': 0}
    triangular_reactions: dict[Literal['Rxa', 'Rxb'], float] = {'Rxa': 0, 'Rxb': 0}
    if p1 >= 0 and p2 >= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both positive loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = force_x_rec(length, min(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if p1 < p2:
            triangular_reactions = force_x_tri(length, p2 - p1, 'up')
        elif p1 > p2:
            triangular_reactions = force_x_tri(length, p1 - p2, 'down')
    elif p1 <= 0 and p2 <= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both negative loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = force_x_rec(length, max(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if abs(p1) < abs(p2):
            triangular_reactions = force_x_tri(length, -(abs(p2) - abs(p1)), 'up')
        elif abs(p1) > abs(p2):
            triangular_reactions = force_x_tri(length, -(abs(p1) - abs(p2)), 'down')
    else:
        # If the loads have different signs we have to split the trapezoid in two triangles.
        # One positive load and one negative load.
        root = root_line((0, p1), (length, p2)) # Find the root of the line

        # Add reaction directly to the start of the bar
        triangular_reactions_1 = force_x_tri(root, p1, 'down')
        triangular_reactions['Rxa'] += triangular_reactions_1['Rxa']

        # Add reaction directly to the end of the bar
        triangular_reactions_2 = force_x_tri(length - root, p2, 'up')
        triangular_reactions['Rxb'] += triangular_reactions_2['Rxb']

        # Get reaction global because the reaction force local and add
        force = -(triangular_reactions_1['Rxb'] + triangular_reactions_2['Rxa'])
        triangular_reactions_aux_1 = point.force_x(length, root, force)
        triangular_reactions['Rxa'] += triangular_reactions_aux_1['Rxa']
        triangular_reactions['Rxb'] += triangular_reactions_aux_1['Rxb']


    reactions: dict[Literal['Rxa', 'Rxb'], float] = {
        'Rxa': rectangular_reactions['Rxa'] + triangular_reactions['Rxa'],
        'Rxb': rectangular_reactions['Rxb'] + triangular_reactions['Rxb']
    }

    return reactions

# Moments *****************************************************************************************
def moment_x_rec(
        length: float,
        p: float
    ) -> dict[Literal['Mxa', 'Mxb'], float]:
    """Calculates the reactions of a bar with a distributed load in x direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Mxa', 'Mxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reaction_a = -(p * l) / 2
    reaction_b = -(p * l) / 2

    return {'Mxa': reaction_a, 'Mxb': reaction_b}

def moment_x_tri(
        length: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Mxa', 'Mxb'], float]:
    """Calculates the reactions of a bar with a distributed load in x direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Mxa', 'Mxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reactions: dict[Literal['Mxa', 'Mxb'], float] = {'Mxa': 0, 'Mxb': 0}

    match direction:
        case 'up':
            reactions['Mxa'] = -(p * l) / 6
            reactions['Mxb'] = -(p * l) / 3
        case 'down':
            reactions['Mxa'] = -(p * l) / 3
            reactions['Mxb'] = -(p * l) / 6
        case _:
            raise ValueError('Direction only "up" and "down"')

    return reactions

def moment_x_trap(
        length: float,
        p1: float, p2: float
    ) -> dict[Literal['Mxa', 'Mxb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in x direction
        and all length of the bar.
    Args:
        length (float): Length of the bar
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Mxa', 'Mxb'], float]: The reactions at the two ends of the bar (A and B)
    """
    if p1 == p2 == 0:
        return {'Mxa': 0, 'Mxb': 0}

    rectangular_reactions: dict[Literal['Mxa', 'Mxb'], float] = {'Mxa': 0, 'Mxb': 0}
    triangular_reactions: dict[Literal['Mxa', 'Mxb'], float] = {'Mxa': 0, 'Mxb': 0}
    if p1 >= 0 and p2 >= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both positive loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = moment_x_rec(length, min(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if p1 < p2:
            triangular_reactions = moment_x_tri(length, p2 - p1, 'up')
        elif p1 > p2:
            triangular_reactions = moment_x_tri(length, p1 - p2, 'down')
    elif p1 <= 0 and p2 <= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both negative loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = moment_x_rec(length, max(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if abs(p1) < abs(p2):
            triangular_reactions = moment_x_tri(length, -(abs(p2) - abs(p1)), 'up')
        elif abs(p1) > abs(p2):
            triangular_reactions = moment_x_tri(length, -(abs(p1) - abs(p2)), 'down')
    else:
        # If the loads have different signs we have to split the trapezoid in two triangles.
        # One positive load and one negative load.
        root = root_line((0, p1), (length, p2)) # Find the root of the line

        # Add reaction directly to the start of the bar
        triangular_reactions_1 = moment_x_tri(root, p1, 'down')
        triangular_reactions['Mxa'] += triangular_reactions_1['Mxa']

        # Add reaction directly to the end of the bar
        triangular_reactions_2 = moment_x_tri(length - root, p2, 'up')
        triangular_reactions['Mxb'] += triangular_reactions_2['Mxb']

        # Get reaction global because the reaction force local and add
        force = -(triangular_reactions_1['Mxb'] + triangular_reactions_2['Mxa'])
        triangular_reactions_aux_1 = point.moment_x(length, root, force)
        triangular_reactions['Mxa'] += triangular_reactions_aux_1['Mxa']
        triangular_reactions['Mxb'] += triangular_reactions_aux_1['Mxb']


    reactions: dict[Literal['Mxa', 'Mxb'], float] = {
        'Mxa': rectangular_reactions['Mxa'] + triangular_reactions['Mxa'],
        'Mxb': rectangular_reactions['Mxb'] + triangular_reactions['Mxb']
    }

    return reactions

# y direction /////////////////////////////////////////////////////////////////////////////////////
# Forces ******************************************************************************************
def force_y_rec(
        length: float,
        p: float
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a distributed load in y direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    moment_a = -(p * l**2) / 12
    moment_b = (p * l**2) / 12
    reaction_a = -(p * l) / 2
    reaction_b = -(p * l) / 2

    return {'Rya': reaction_a, 'Ryb': reaction_b, 'Mza': moment_a, 'Mzb': moment_b}

def force_y_tri(
        length: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a distributed load in y direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the direction is not 'up' or 'down'

    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = \
        {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}

    match direction:
        case 'up':
            reactions['Mza'] = -(p * l**2) / 30
            reactions['Mzb'] = (p * l**2) / 20
            reactions['Rya'] = -(3 * p * l) / 20
            reactions['Ryb'] = -(7 * p * l) / 20
        case 'down':
            reactions['Mza'] = -(p * l**2) / 20
            reactions['Mzb'] = (p * l**2) / 30
            reactions['Rya'] = -(7 * p * l) / 20
            reactions['Ryb'] = -(3 * p * l) / 20
        case _:
            raise ValueError('Direction only "up" and "down"')

    return reactions

def force_y_trap(
        length: float,
        p1: float, p2: float
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in y direction
        and all length of the bar.
    Args:
        length (float): Length of the bar
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if p1 == p2 == 0:
        return {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}

    rectangular_reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = \
        {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}
    triangular_reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = \
        {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}
    if p1 >= 0 and p2 >= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both positive loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = force_y_rec(length, min(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if p1 < p2:
            triangular_reactions = force_y_tri(length, p2 - p1, 'up')
        elif p1 > p2:
            triangular_reactions = force_y_tri(length, p1 - p2, 'down')
    elif p1 <= 0 and p2 <= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both negative loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = force_y_rec(length, max(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if abs(p1) < abs(p2):
            triangular_reactions = force_y_tri(length, -(abs(p2) - abs(p1)), 'up')
        elif abs(p1) > abs(p2):
            triangular_reactions = force_y_tri(length, -(abs(p1) - abs(p2)), 'down')
    else:
        # If the loads have different signs we have to split the trapezoid in two triangles.
        # One positive load and one negative load.
        root = root_line((0, p1), (length, p2)) # Find the root of the line

        # Add reaction directly to the start of the bar
        triangular_reactions_1 = force_y_tri(root, p1, 'down')
        triangular_reactions['Rya'] += triangular_reactions_1['Rya']
        triangular_reactions['Mza'] += triangular_reactions_1['Mza']

        # Add reaction directly to the end of the bar
        triangular_reactions_2 = force_y_tri(length - root, p2, 'up')
        triangular_reactions['Ryb'] += triangular_reactions_2['Ryb']
        triangular_reactions['Mzb'] += triangular_reactions_2['Mzb']

        # Get reaction global because the reaction force local and add
        force = -(triangular_reactions_1['Ryb'] + triangular_reactions_2['Rya'])
        triangular_reactions_aux_1 = point.force_y(length, root, force)
        triangular_reactions['Rya'] += triangular_reactions_aux_1['Rya']
        triangular_reactions['Ryb'] += triangular_reactions_aux_1['Ryb']
        triangular_reactions['Mza'] += triangular_reactions_aux_1['Mza']
        triangular_reactions['Mzb'] += triangular_reactions_aux_1['Mzb']

        # Get reaction global because the reaction moment local and add
        moment = -(triangular_reactions_1['Mzb'] + triangular_reactions_2['Mza'])
        triangular_reactions_aux_2 = point.moment_z(length, root, moment)
        triangular_reactions['Rya'] += triangular_reactions_aux_2['Rya']
        triangular_reactions['Ryb'] += triangular_reactions_aux_2['Ryb']
        triangular_reactions['Mza'] += triangular_reactions_aux_2['Mza']
        triangular_reactions['Mzb'] += triangular_reactions_aux_2['Mzb']


    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': rectangular_reactions['Rya'] + triangular_reactions['Rya'],
        'Ryb': rectangular_reactions['Ryb'] + triangular_reactions['Ryb'],
        'Mza': rectangular_reactions['Mza'] + triangular_reactions['Mza'],
        'Mzb': rectangular_reactions['Mzb'] + triangular_reactions['Mzb']
    }

    return reactions

# Moments *****************************************************************************************
def moment_y_rec(
        p: float
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a distributed load in y direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """

    moment_a = 0
    moment_b = 0
    reaction_a = -p
    reaction_b = p

    return {'Rza': reaction_a, 'Rzb': reaction_b, 'Mya': moment_a, 'Myb': moment_b}

def moment_y_tri(
        length: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a distributed load in y direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the direction is not 'up' or 'down'

    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = \
        {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}

    match direction:
        case 'up':
            reactions['Mya'] = (p * l) / 12
            reactions['Myb'] = -(p * l) / 12
            reactions['Rza'] = -p / 2
            reactions['Rzb'] = p / 2
        case 'down':
            reactions['Mya'] = -(p * l) / 12
            reactions['Myb'] = (p * l) / 12
            reactions['Rza'] = -p / 2
            reactions['Rzb'] = p / 2
        case _:
            raise ValueError('Direction only "up" and "down"')

    return reactions

def moment_y_trap(
        length: float,
        p1: float, p2: float
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in y direction
        and all length of the bar.
    Args:
        length (float): Length of the bar
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if p1 == p2 == 0:
        return {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}

    rectangular_reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = \
        {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}
    triangular_reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = \
        {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}
    if p1 >= 0 and p2 >= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both positive loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = moment_y_rec(min(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if p1 < p2:
            triangular_reactions = moment_y_tri(length, p2 - p1, 'up')
        elif p1 > p2:
            triangular_reactions = moment_y_tri(length, p1 - p2, 'down')
    elif p1 <= 0 and p2 <= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both negative loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = moment_y_rec(max(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if abs(p1) < abs(p2):
            triangular_reactions = moment_y_tri(length, -(abs(p2) - abs(p1)), 'up')
        elif abs(p1) > abs(p2):
            triangular_reactions = moment_y_tri(length, -(abs(p1) - abs(p2)), 'down')
    else:
        # If the loads have different signs we have to split the trapezoid in two triangles.
        # One positive load and one negative load.
        root = root_line((0, p1), (length, p2)) # Find the root of the line

        # Add reaction directly to the start of the bar
        triangular_reactions_1 = moment_y_tri(root, p1, 'down')
        triangular_reactions['Rza'] += triangular_reactions_1['Rza']
        triangular_reactions['Mya'] += triangular_reactions_1['Mya']

        # Add reaction directly to the end of the bar
        triangular_reactions_2 = moment_y_tri(length - root, p2, 'up')
        triangular_reactions['Rzb'] += triangular_reactions_2['Rzb']
        triangular_reactions['Myb'] += triangular_reactions_2['Myb']

        # Get reaction global because the reaction moment local and add
        moment = -(triangular_reactions_1['Myb'] + triangular_reactions_2['Mya'])
        triangular_reactions_aux_1 = point.moment_y(length, root, moment)
        triangular_reactions['Rza'] += triangular_reactions_aux_1['Rza']
        triangular_reactions['Rzb'] += triangular_reactions_aux_1['Rzb']
        triangular_reactions['Mya'] += triangular_reactions_aux_1['Mya']
        triangular_reactions['Myb'] += triangular_reactions_aux_1['Myb']

        # Get reaction global because the reaction force local and add
        force = -(triangular_reactions_1['Rzb'] + triangular_reactions_2['Rza'])
        triangular_reactions_aux_2 = point.force_z(length, root, force)
        triangular_reactions['Rza'] += triangular_reactions_aux_2['Rza']
        triangular_reactions['Rzb'] += triangular_reactions_aux_2['Rzb']
        triangular_reactions['Mya'] += triangular_reactions_aux_2['Mya']
        triangular_reactions['Myb'] += triangular_reactions_aux_2['Myb']


    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': rectangular_reactions['Rza'] + triangular_reactions['Rza'],
        'Rzb': rectangular_reactions['Rzb'] + triangular_reactions['Rzb'],
        'Mya': rectangular_reactions['Mya'] + triangular_reactions['Mya'],
        'Myb': rectangular_reactions['Myb'] + triangular_reactions['Myb']
    }

    return reactions

# z direction /////////////////////////////////////////////////////////////////////////////////////
# Forces ******************************************************************************************
def force_z_rec(
        length: float,
        p: float
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a distributed load in z direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    moment_a = (p * l**2) / 12
    moment_b = -(p * l**2) / 12
    reaction_a = -(p * l) / 2
    reaction_b = -(p * l) / 2

    return {'Rza': reaction_a, 'Rzb': reaction_b, 'Mya': moment_a, 'Myb': moment_b}

def force_z_tri(
        length: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a distributed load in z direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the direction is not 'up' or 'down'

    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = \
        {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}

    match direction:
        case 'up':
            reactions['Mya'] = (p * l**2) / 30
            reactions['Myb'] = -(p * l**2) / 20
            reactions['Rza'] = -(3 * p * l) / 20
            reactions['Rzb'] = -(7 * p * l) / 20
        case 'down':
            reactions['Mya'] = (p * l**2) / 20
            reactions['Myb'] = -(p * l**2) / 30
            reactions['Rza'] = -(7 * p * l) / 20
            reactions['Rzb'] = -(3 * p * l) / 20
        case _:
            raise ValueError('Direction only "up" and "down"')

    return reactions

def force_z_trap(
        length: float,
        p1: float, p2: float
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in z direction
        and all length of the bar.
    Args:
        length (float): Length of the bar
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if p1 == p2 == 0:
        return {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}

    rectangular_reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = \
        {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}
    triangular_reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = \
        {'Rza': 0, 'Rzb': 0, 'Mya': 0, 'Myb': 0}
    if p1 >= 0 and p2 >= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both positive loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = force_z_rec(length, min(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if p1 < p2:
            triangular_reactions = force_z_tri(length, p2 - p1, 'up')
        elif p1 > p2:
            triangular_reactions = force_z_tri(length, p1 - p2, 'down')
    elif p1 <= 0 and p2 <= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both negative loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = force_z_rec(length, max(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if abs(p1) < abs(p2):
            triangular_reactions = force_z_tri(length, -(abs(p2) - abs(p1)), 'up')
        elif abs(p1) > abs(p2):
            triangular_reactions = force_z_tri(length, -(abs(p1) - abs(p2)), 'down')
    else:
        # If the loads have different signs we have to split the trapezoid in two triangles.
        # One positive load and one negative load.
        root = root_line((0, p1), (length, p2)) # Find the root of the line

        # Add reaction directly to the start of the bar
        triangular_reactions_1 = force_z_tri(root, p1, 'down')
        triangular_reactions['Rza'] += triangular_reactions_1['Rza']
        triangular_reactions['Mya'] += triangular_reactions_1['Mya']

        # Add reaction directly to the end of the bar
        triangular_reactions_2 = force_z_tri(length - root, p2, 'up')
        triangular_reactions['Rzb'] += triangular_reactions_2['Rzb']
        triangular_reactions['Myb'] += triangular_reactions_2['Myb']

        # Get reaction global because the reaction force local and add
        force = -(triangular_reactions_1['Rzb'] + triangular_reactions_2['Rza'])
        triangular_reactions_aux_1 = point.force_z(length, root, force)
        triangular_reactions['Rza'] += triangular_reactions_aux_1['Rza']
        triangular_reactions['Rzb'] += triangular_reactions_aux_1['Rzb']
        triangular_reactions['Mya'] += triangular_reactions_aux_1['Mya']
        triangular_reactions['Myb'] += triangular_reactions_aux_1['Myb']

        # Get reaction global because the reaction moment local and add
        moment = -(triangular_reactions_1['Myb'] + triangular_reactions_2['Mya'])
        triangular_reactions_aux_2 = point.moment_y(length, root, moment)
        triangular_reactions['Rza'] += triangular_reactions_aux_2['Rza']
        triangular_reactions['Rzb'] += triangular_reactions_aux_2['Rzb']
        triangular_reactions['Mya'] += triangular_reactions_aux_2['Mya']
        triangular_reactions['Myb'] += triangular_reactions_aux_2['Myb']


    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': rectangular_reactions['Rza'] + triangular_reactions['Rza'],
        'Rzb': rectangular_reactions['Rzb'] + triangular_reactions['Rzb'],
        'Mya': rectangular_reactions['Mya'] + triangular_reactions['Mya'],
        'Myb': rectangular_reactions['Myb'] + triangular_reactions['Myb']
    }

    return reactions

# Moments *****************************************************************************************
def moment_z_rec(
        p: float
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a distributed load in z direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """

    moment_a = 0
    moment_b = 0
    reaction_a = p
    reaction_b = -p

    return {'Rya': reaction_a, 'Ryb': reaction_b, 'Mza': moment_a, 'Mzb': moment_b}

def moment_z_tri(
        length: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a distributed load in z direction and in all length
        of the bar.

    Args:
        length (float): Length of the bar
        x (float): Position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the direction is not 'up' or 'down'

    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    l = length

    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = \
        {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}

    match direction:
        case 'up':
            reactions['Mza'] = (p * l) / 12
            reactions['Mzb'] = -(p * l) / 12
            reactions['Rya'] = p / 2
            reactions['Ryb'] = -p / 2
        case 'down':
            reactions['Mza'] = -(p * l) / 12
            reactions['Mzb'] = (p * l) / 12
            reactions['Rya'] = p / 2
            reactions['Ryb'] = -p / 2
        case _:
            raise ValueError('Direction only "up" and "down"')

    return reactions

def moment_z_trap(
        length: float,
        p1: float, p2: float
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in z direction
        and all length of the bar.
    Args:
        length (float): Length of the bar
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if p1 == p2 == 0:
        return {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}

    rectangular_reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = \
        {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}
    triangular_reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = \
        {'Rya': 0, 'Ryb': 0, 'Mza': 0, 'Mzb': 0}
    if p1 >= 0 and p2 >= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both positive loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = moment_z_rec(min(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if p1 < p2:
            triangular_reactions = moment_z_tri(length, p2 - p1, 'up')
        elif p1 > p2:
            triangular_reactions = moment_z_tri(length, p1 - p2, 'down')
    elif p1 <= 0 and p2 <= 0:
        # If both loads are positive then we can have a rectangular and a triangular load.
        # Both negative loads.
        if p1 != 0 and p2 != 0:
            rectangular_reactions = moment_z_rec(max(p1, p2))

        # Verify if we have an ascending or descending triangle.
        if abs(p1) < abs(p2):
            triangular_reactions = moment_z_tri(length, -(abs(p2) - abs(p1)), 'up')
        elif abs(p1) > abs(p2):
            triangular_reactions = moment_z_tri(length, -(abs(p1) - abs(p2)), 'down')
    else:
        # If the loads have different signs we have to split the trapezoid in two triangles.
        # One positive load and one negative load.
        root = root_line((0, p1), (length, p2)) # Find the root of the line

        # Add reaction directly to the start of the bar
        triangular_reactions_1 = moment_z_tri(root, p1, 'down')
        triangular_reactions['Rya'] += triangular_reactions_1['Rya']
        triangular_reactions['Mza'] += triangular_reactions_1['Mza']

        # Add reaction directly to the end of the bar
        triangular_reactions_2 = moment_z_tri(length - root, p2, 'up')
        triangular_reactions['Ryb'] += triangular_reactions_2['Ryb']
        triangular_reactions['Mzb'] += triangular_reactions_2['Mzb']

        # Get reaction global because the reaction moment local and add
        moment = -(triangular_reactions_1['Mzb'] + triangular_reactions_2['Mza'])
        triangular_reactions_aux_1 = point.moment_z(length, root, moment)
        triangular_reactions['Rya'] += triangular_reactions_aux_1['Rya']
        triangular_reactions['Ryb'] += triangular_reactions_aux_1['Ryb']
        triangular_reactions['Mza'] += triangular_reactions_aux_1['Mza']
        triangular_reactions['Mzb'] += triangular_reactions_aux_1['Mzb']

        # Get reaction global because the reaction force local and add
        force = -(triangular_reactions_1['Ryb'] + triangular_reactions_2['Rya'])
        triangular_reactions_aux_2 = point.force_y(length, root, force)
        triangular_reactions['Rya'] += triangular_reactions_aux_2['Rya']
        triangular_reactions['Ryb'] += triangular_reactions_aux_2['Ryb']
        triangular_reactions['Mza'] += triangular_reactions_aux_2['Mza']
        triangular_reactions['Mzb'] += triangular_reactions_aux_2['Mzb']


    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': rectangular_reactions['Rya'] + triangular_reactions['Rya'],
        'Ryb': rectangular_reactions['Ryb'] + triangular_reactions['Ryb'],
        'Mza': rectangular_reactions['Mza'] + triangular_reactions['Mza'],
        'Mzb': rectangular_reactions['Mzb'] + triangular_reactions['Mzb']
    }

    return reactions
