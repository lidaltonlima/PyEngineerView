"""Functions for 2D space calculations."""
def root_line(point_1: tuple[float, float], point_2: tuple[float, float]) -> float:
    """Calculate the root (x-intercept) of the line defined by two points in 2D space.

    Args:
        point_1 (tuple[float, float]): Initial point (x1, y1)
        point_2 (tuple[float, float]): End point (x2, y2)

    Raises:
        ValueError: If the line is vertical or horizontal and does not cross the x-axis.

    Returns:
        float: The x-coordinate where the line crosses the x-axis.
    """
    x1, y1 = point_1
    x2, y2 = point_2

    if x1 == x2:
        # If the points have the same x coordinate, the line is vertical.
        # A vertical line does not cross the x-axis at a finite point.
        raise ValueError("Vertical line. No finite root.")

    if y1 == y2:
        # If the points have the same y coordinate, the line is horizontal.
        if y1 == 0:
            # A horizontal line either lies on the x-axis (if y1 == 0)
            raise ValueError("The line lies on the x-axis. Infinite roots.")
        else:
            # A horizontal line above or below the x-axis does not cross it.
            raise ValueError("Horizontal line. No root.")

    # Calculate the slope (m)
    m = (y2 - y1) / (x2 - x1)
    # Calculate the y-intercept (c)
    c = y1 - m * x1
    # Calculate the root (x when y=0)
    root = -c / m

    return root
