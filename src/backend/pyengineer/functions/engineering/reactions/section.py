"""
Functions to calculate reactions in bars with section load.
"""

from typing import Literal

from . import point, all_length

# x direction /////////////////////////////////////////////////////////////////////////////////////
# Forces ******************************************************************************************
def force_x_rec(
        length: float,
        x1: float, x2: float,
        p: float
    ) -> dict[Literal['Rxa', 'Rxb'], float]:
    """Calculates the reactions of a bar with a distributed axial load in x direction.

    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L

    Returns:
        dict[Literal['Rxa', 'Rxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_x_rec(x2 - x1, p)

    # For local reaction calculate global reactions
    aux_1 = point.force_x(length, x1, -reactions_local['Rxa'])
    aux_2 = point.force_x(length, x2, -reactions_local['Rxb'])


    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rxa', 'Rxb'], float] = {
        'Rxa': aux_1['Rxa'] + aux_2['Rxa'],
        'Rxb': aux_1['Rxb'] + aux_2['Rxb'],
    }

    return reactions

def force_x_tri(
        length: float,
        x1: float, x2: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rxa', 'Rxb'], float]:
    """Calculates the reactions of a bar with a triangular distributed axial load in x direction.
        Ascending or descending.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load at the larger end
        direction (Literal['up', 'down']): Direction of the load.
            'up' for ascending, 'down' for descending.
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
        ValueError: If the direction is not 'up' or 'down'
    Returns:
        dict[Literal['Rxa', 'Rxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_x_tri(x2 - x1, p, direction)

    # For local reaction calculate global reactions
    aux_1 = point.force_x(length, x1, -reactions_local['Rxa'])
    aux_2 = point.force_x(length, x2, -reactions_local['Rxb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rxa', 'Rxb'], float] = {
        'Rxa': aux_1['Rxa'] + aux_2['Rxa'],
        'Rxb': aux_1['Rxb'] + aux_2['Rxb'],
    }

    return reactions

def force_x_trap(length: float,
                      x1: float, x2: float,
                      p1: float, p2: float) -> dict[Literal['Rxa', 'Rxb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in x direction.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rxa', 'Rxb', float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_x_trap(x2 - x1, p1, p2)

    # For local reaction calculate global reactions
    aux_1 = point.force_x(length, x1, -reactions_local['Rxa'])
    aux_2 = point.force_x(length, x2, -reactions_local['Rxb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rxa', 'Rxb'], float] = {
        'Rxa': aux_1['Rxa'] + aux_2['Rxa'],
        'Rxb': aux_1['Rxb'] + aux_2['Rxb'],
    }

    return reactions

# Moments *****************************************************************************************
def moment_x_rec(
        length: float,
        x1: float, x2: float,
        p: float
    ) -> dict[Literal['Mxa', 'Mxb'], float]:
    """Calculates the reactions of a bar with a distributed axial load in x direction.

    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L

    Returns:
        dict[Literal['Mxa', 'Mxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_x_rec(x2 - x1, p)

    # For local reaction calculate global reactions
    aux_1 = point.moment_x(length, x1, -reactions_local['Mxa'])
    aux_2 = point.moment_x(length, x2, -reactions_local['Mxb'])


    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Mxa', 'Mxb'], float] = {
        'Mxa': aux_1['Mxa'] + aux_2['Mxa'],
        'Mxb': aux_1['Mxb'] + aux_2['Mxb'],
    }

    return reactions

def moment_x_tri(
        length: float,
        x1: float, x2: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Mxa', 'Mxb'], float]:
    """Calculates the reactions of a bar with a triangular distributed axial load in x direction.
        Ascending or descending.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load at the larger end
        direction (Literal['up', 'down']): Direction of the load.
            'up' for ascending, 'down' for descending.
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
        ValueError: If the direction is not 'up' or 'down'
    Returns:
        dict[Literal['Mxa', 'Mxb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_x_tri(x2 - x1, p, direction)

    # For local reaction calculate global reactions
    aux_1 = point.moment_x(length, x1, -reactions_local['Mxa'])
    aux_2 = point.moment_x(length, x2, -reactions_local['Mxb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Mxa', 'Mxb'], float] = {
        'Mxa': aux_1['Mxa'] + aux_2['Mxa'],
        'Mxb': aux_1['Mxb'] + aux_2['Mxb'],
    }

    return reactions

def moment_x_trap(length: float,
                      x1: float, x2: float,
                      p1: float, p2: float) -> dict[Literal['Mxa', 'Mxb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in x direction.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Mxa', 'Mxb', float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_x_trap(x2 - x1, p1, p2)

    # For local reaction calculate global reactions
    aux_1 = point.moment_x(length, x1, -reactions_local['Mxa'])
    aux_2 = point.moment_x(length, x2, -reactions_local['Mxb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Mxa', 'Mxb'], float] = {
        'Mxa': aux_1['Mxa'] + aux_2['Mxa'],
        'Mxb': aux_1['Mxb'] + aux_2['Mxb'],
    }

    return reactions

# y direction /////////////////////////////////////////////////////////////////////////////////////
# Forces ******************************************************************************************
def force_y_rec(
        length: float,
        x1: float, x2: float,
        p: float
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a distributed axial load in y direction.

    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L

    Returns:
        dict[Literal['Rxa', 'Rxb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_y_rec(x2 - x1, p)

    # For local reaction calculate global reactions
    aux_1 = point.force_y(length, x1, -reactions_local['Rya'])
    aux_2 = point.force_y(length, x2, -reactions_local['Ryb'])
    aux_3 = point.moment_z(length, x1, -reactions_local['Mza'])
    aux_4 = point.moment_z(length, x2, -reactions_local['Mzb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': aux_1['Rya'] + aux_2['Rya'] + aux_3['Rya'] + aux_4['Rya'],
        'Ryb': aux_1['Ryb'] + aux_2['Ryb'] + aux_3['Ryb'] + aux_4['Ryb'],
        'Mza': aux_1['Mza'] + aux_2['Mza'] + aux_3['Mza'] + aux_4['Mza'],
        'Mzb': aux_1['Mzb'] + aux_2['Mzb'] + aux_3['Mzb'] + aux_4['Mzb']
    }

    return reactions

def force_y_tri(
        length: float,
        x1: float, x2: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a triangular distributed axial load in y direction.
        Ascending or descending.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load at the larger end
        direction (Literal['up', 'down']): Direction of the load.
            'up' for ascending, 'down' for descending.
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
        ValueError: If the direction is not 'up' or 'down'
    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_y_tri(x2 - x1, p, direction)

    # For local reaction calculate global reactions
    aux_1 = point.force_y(length, x1, -reactions_local['Rya'])
    aux_2 = point.force_y(length, x2, -reactions_local['Ryb'])
    aux_3 = point.moment_z(length, x1, -reactions_local['Mza'])
    aux_4 = point.moment_z(length, x2, -reactions_local['Mzb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': aux_1['Rya'] + aux_2['Rya'] + aux_3['Rya'] + aux_4['Rya'],
        'Ryb': aux_1['Ryb'] + aux_2['Ryb'] + aux_3['Ryb'] + aux_4['Ryb'],
        'Mza': aux_1['Mza'] + aux_2['Mza'] + aux_3['Mza'] + aux_4['Mza'],
        'Mzb': aux_1['Mzb'] + aux_2['Mzb'] + aux_3['Mzb'] + aux_4['Mzb']
    }

    return reactions

def force_y_trap(length: float,
                      x1: float, x2: float,
                      p1: float, p2: float) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in y direction.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_y_trap(x2 - x1, p1, p2)

    # For local reaction calculate global reactions
    aux_1 = point.force_y(length, x1, -reactions_local['Rya'])
    aux_2 = point.force_y(length, x2, -reactions_local['Ryb'])
    aux_3 = point.moment_z(length, x1, -reactions_local['Mza'])
    aux_4 = point.moment_z(length, x2, -reactions_local['Mzb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': aux_1['Rya'] + aux_2['Rya'] + aux_3['Rya'] + aux_4['Rya'],
        'Ryb': aux_1['Ryb'] + aux_2['Ryb'] + aux_3['Ryb'] + aux_4['Ryb'],
        'Mza': aux_1['Mza'] + aux_2['Mza'] + aux_3['Mza'] + aux_4['Mza'],
        'Mzb': aux_1['Mzb'] + aux_2['Mzb'] + aux_3['Mzb'] + aux_4['Mzb']
    }

    return reactions

# Moments *****************************************************************************************
def moment_y_rec(
        length: float,
        x1: float, x2: float,
        p: float
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a distributed axial load in y direction.

    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L

    Returns:
        dict[Literal['Rxa', 'Rxb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_y_rec(p)

    # For local reaction calculate global reactions
    aux_1 = point.force_z(length, x1, -reactions_local['Rza'])
    aux_2 = point.force_z(length, x2, -reactions_local['Rzb'])
    aux_3 = point.moment_y(length, x1, -reactions_local['Mya'])
    aux_4 = point.moment_y(length, x2, -reactions_local['Myb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': aux_1['Rza'] + aux_2['Rza'] + aux_3['Rza'] + aux_4['Rza'],
        'Rzb': aux_1['Rzb'] + aux_2['Rzb'] + aux_3['Rzb'] + aux_4['Rzb'],
        'Mya': aux_1['Mya'] + aux_2['Mya'] + aux_3['Mya'] + aux_4['Mya'],
        'Myb': aux_1['Myb'] + aux_2['Myb'] + aux_3['Myb'] + aux_4['Myb']
    }

    return reactions

def moment_y_tri(
        length: float,
        x1: float, x2: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a triangular distributed axial load in y direction.
        Ascending or descending.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load at the larger end
        direction (Literal['up', 'down']): Direction of the load.
            'up' for ascending, 'down' for descending.
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
        ValueError: If the direction is not 'up' or 'down'
    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_y_tri(x2 - x1, p, direction)

    # For local reaction calculate global reactions
    aux_1 = point.force_z(length, x1, -reactions_local['Rza'])
    aux_2 = point.force_z(length, x2, -reactions_local['Rzb'])
    aux_3 = point.moment_y(length, x1, -reactions_local['Mya'])
    aux_4 = point.moment_y(length, x2, -reactions_local['Myb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': aux_1['Rza'] + aux_2['Rza'] + aux_3['Rza'] + aux_4['Rza'],
        'Rzb': aux_1['Rzb'] + aux_2['Rzb'] + aux_3['Rzb'] + aux_4['Rzb'],
        'Mya': aux_1['Mya'] + aux_2['Mya'] + aux_3['Mya'] + aux_4['Mya'],
        'Myb': aux_1['Myb'] + aux_2['Myb'] + aux_3['Myb'] + aux_4['Myb']
    }

    return reactions

def moment_y_trap(length: float,
                      x1: float, x2: float,
                      p1: float, p2: float) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in y direction.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_y_trap(x2 - x1, p1, p2)

    # For local reaction calculate global reactions
    aux_1 = point.force_z(length, x1, -reactions_local['Rza'])
    aux_2 = point.force_z(length, x2, -reactions_local['Rzb'])
    aux_3 = point.moment_y(length, x1, -reactions_local['Mya'])
    aux_4 = point.moment_y(length, x2, -reactions_local['Myb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': aux_1['Rza'] + aux_2['Rza'] + aux_3['Rza'] + aux_4['Rza'],
        'Rzb': aux_1['Rzb'] + aux_2['Rzb'] + aux_3['Rzb'] + aux_4['Rzb'],
        'Mya': aux_1['Mya'] + aux_2['Mya'] + aux_3['Mya'] + aux_4['Mya'],
        'Myb': aux_1['Myb'] + aux_2['Myb'] + aux_3['Myb'] + aux_4['Myb']
    }

    return reactions

# z direction /////////////////////////////////////////////////////////////////////////////////////
# Forces ******************************************************************************************
def force_z_rec(
        length: float,
        x1: float, x2: float,
        p: float
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a distributed axial load in z direction.

    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L

    Returns:
        dict[Literal['Rxa', 'Rxb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_z_rec(x2 - x1, p)

    # For local reaction calculate global reactions
    aux_1 = point.force_z(length, x1, -reactions_local['Rza'])
    aux_2 = point.force_z(length, x2, -reactions_local['Rzb'])
    aux_3 = point.moment_y(length, x1, -reactions_local['Mya'])
    aux_4 = point.moment_y(length, x2, -reactions_local['Myb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': aux_1['Rza'] + aux_2['Rza'] + aux_3['Rza'] + aux_4['Rza'],
        'Rzb': aux_1['Rzb'] + aux_2['Rzb'] + aux_3['Rzb'] + aux_4['Rzb'],
        'Mya': aux_1['Mya'] + aux_2['Mya'] + aux_3['Mya'] + aux_4['Mya'],
        'Myb': aux_1['Myb'] + aux_2['Myb'] + aux_3['Myb'] + aux_4['Myb']
    }

    return reactions

def force_z_tri(
        length: float,
        x1: float, x2: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a triangular distributed axial load in z direction.
        Ascending or descending.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load at the larger end
        direction (Literal['up', 'down']): Direction of the load.
            'up' for ascending, 'down' for descending.
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
        ValueError: If the direction is not 'up' or 'down'
    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_z_tri(x2 - x1, p, direction)

    # For local reaction calculate global reactions
    aux_1 = point.force_z(length, x1, -reactions_local['Rza'])
    aux_2 = point.force_z(length, x2, -reactions_local['Rzb'])
    aux_3 = point.moment_y(length, x1, -reactions_local['Mya'])
    aux_4 = point.moment_y(length, x2, -reactions_local['Myb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': aux_1['Rza'] + aux_2['Rza'] + aux_3['Rza'] + aux_4['Rza'],
        'Rzb': aux_1['Rzb'] + aux_2['Rzb'] + aux_3['Rzb'] + aux_4['Rzb'],
        'Mya': aux_1['Mya'] + aux_2['Mya'] + aux_3['Mya'] + aux_4['Mya'],
        'Myb': aux_1['Myb'] + aux_2['Myb'] + aux_3['Myb'] + aux_4['Myb']
    }

    return reactions

def force_z_trap(length: float,
                      x1: float, x2: float,
                      p1: float, p2: float) -> dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in z direction.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.force_z_trap(x2 - x1, p1, p2)

    # For local reaction calculate global reactions
    aux_1 = point.force_z(length, x1, -reactions_local['Rza'])
    aux_2 = point.force_z(length, x2, -reactions_local['Rzb'])
    aux_3 = point.moment_y(length, x1, -reactions_local['Mya'])
    aux_4 = point.moment_y(length, x2, -reactions_local['Myb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rza', 'Rzb', 'Mya', 'Myb'], float] = {
        'Rza': aux_1['Rza'] + aux_2['Rza'] + aux_3['Rza'] + aux_4['Rza'],
        'Rzb': aux_1['Rzb'] + aux_2['Rzb'] + aux_3['Rzb'] + aux_4['Rzb'],
        'Mya': aux_1['Mya'] + aux_2['Mya'] + aux_3['Mya'] + aux_4['Mya'],
        'Myb': aux_1['Myb'] + aux_2['Myb'] + aux_3['Myb'] + aux_4['Myb']
    }

    return reactions

# Moments *****************************************************************************************
def moment_z_rec(
        length: float,
        x1: float, x2: float,
        p: float
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a distributed axial load in y direction.

    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load

    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L

    Returns:
        dict[Literal['Rxa', 'Rxb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_z_rec(p)

    # For local reaction calculate global reactions
    aux_1 = point.force_y(length, x1, -reactions_local['Rya'])
    aux_2 = point.force_y(length, x2, -reactions_local['Ryb'])
    aux_3 = point.moment_z(length, x1, -reactions_local['Mza'])
    aux_4 = point.moment_z(length, x2, -reactions_local['Mzb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': aux_1['Rya'] + aux_2['Rya'] + aux_3['Rya'] + aux_4['Rya'],
        'Ryb': aux_1['Ryb'] + aux_2['Ryb'] + aux_3['Ryb'] + aux_4['Ryb'],
        'Mza': aux_1['Mza'] + aux_2['Mza'] + aux_3['Mza'] + aux_4['Mza'],
        'Mzb': aux_1['Mzb'] + aux_2['Mzb'] + aux_3['Mzb'] + aux_4['Mzb']
    }

    return reactions

def moment_z_tri(
        length: float,
        x1: float, x2: float,
        p: float,
        direction: Literal['up', 'down']
    ) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a triangular distributed axial load in z direction.
        Ascending or descending.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p (float): Intensity of the load at the larger end
        direction (Literal['up', 'down']): Direction of the load.
            'up' for ascending, 'down' for descending.
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
        ValueError: If the direction is not 'up' or 'down'
    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_z_tri(x2 - x1, p, direction)

    # For local reaction calculate global reactions
    aux_1 = point.force_y(length, x1, -reactions_local['Rya'])
    aux_2 = point.force_y(length, x2, -reactions_local['Ryb'])
    aux_3 = point.moment_z(length, x1, -reactions_local['Mza'])
    aux_4 = point.moment_z(length, x2, -reactions_local['Mzb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': aux_1['Rya'] + aux_2['Rya'] + aux_3['Rya'] + aux_4['Rya'],
        'Ryb': aux_1['Ryb'] + aux_2['Ryb'] + aux_3['Ryb'] + aux_4['Ryb'],
        'Mza': aux_1['Mza'] + aux_2['Mza'] + aux_3['Mza'] + aux_4['Mza'],
        'Mzb': aux_1['Mzb'] + aux_2['Mzb'] + aux_3['Mzb'] + aux_4['Mzb']
    }

    return reactions

def moment_z_trap(length: float,
                      x1: float, x2: float,
                      p1: float, p2: float) -> dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
    """Calculates the reactions of a bar with a trapezoidal distributed axial load in z direction.
    Args:
        length (float): Length of the bar
        x1 (float): Start position of the load
        x2 (float): End position of the load
        p1 (float): Intensity of the load at the start position
        p2 (float): Intensity of the load at the end position
    Raises:
        ValueError: If the positions are not in the range 0 <= x1 < x2 <= L
    Returns:
        dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float]:
            The reactions at the two ends of the bar (A and B)
    """
    if (0 <= x1 < x2 <= length) is False:
        raise ValueError("Need 0 <= x1 < x2 <= L.")

    reactions_local = all_length.moment_z_trap(x2 - x1, p1, p2)

    # For local reaction calculate global reactions
    aux_1 = point.force_y(length, x1, -reactions_local['Rya'])
    aux_2 = point.force_y(length, x2, -reactions_local['Ryb'])
    aux_3 = point.moment_z(length, x1, -reactions_local['Mza'])
    aux_4 = point.moment_z(length, x2, -reactions_local['Mzb'])

    # Sum all reactions with principle of superposition of effects
    reactions: dict[Literal['Rya', 'Ryb', 'Mza', 'Mzb'], float] = {
        'Rya': aux_1['Rya'] + aux_2['Rya'] + aux_3['Rya'] + aux_4['Rya'],
        'Ryb': aux_1['Ryb'] + aux_2['Ryb'] + aux_3['Ryb'] + aux_4['Ryb'],
        'Mza': aux_1['Mza'] + aux_2['Mza'] + aux_3['Mza'] + aux_4['Mza'],
        'Mzb': aux_1['Mzb'] + aux_2['Mzb'] + aux_3['Mzb'] + aux_4['Mzb']
    }

    return reactions
