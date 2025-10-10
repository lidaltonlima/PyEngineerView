type Point = [number, number]

/**
 * Creates a linear function (y = mx + b) from two points in 2D space.
 *
 * @param p1 The first point (x1, y1).
 * @param p2 The second point (x2, y2).
 * @returns A function that takes an x-coordinate and returns the corresponding y-coordinate on the line.
 */
export function createLinearFunction(p1: Point, p2: Point): (x: number) => number {
	const [x1, y1] = p1
	const [x2, y2] = p2

	// Vertical line
	if (x1 === x2) throw new Error('Vertical line: y is not defined for every x.')

	const a = (y2 - y1) / (x2 - x1) // slope
	const b = y1 - a * x1 // y-intercept

	return (x: number) => a * x + b
}

/**
 * Calculates the parameters of the linear function (y = ax + b) defined by two points.
 *
 * @param p1 The first point (x1, y1).
 * @param p2 The second point (x2, y2).
 * @returns An object containing the parameters a (slope) and b (y-intercept) of the linear function.
 */
export function parametersOfLinearFunction(p1: Point, p2: Point): { a: number; b: number } {
	const [x1, y1] = p1
	const [x2, y2] = p2

	// Vertical line
	if (x1 === x2) throw new Error('Vertical line: y is not defined for every x.')

	const a = (y2 - y1) / (x2 - x1) // slope
	const b = y1 - a * x1 // y-intercept

	return { a, b }
}

/**
 * Calculates the x-coordinate where the line defined by two points in 2D space crosses the x-axis.
 *
 * @param point1 The first point (x1, y1).
 * @param point2 The second point (x2, y2).
 * @returns The x-coordinate where the line crosses the x-axis.
 */
export function rootLinear(point1: Point, point2: Point): number {
	const [x1, y1] = point1
	const [x2, y2] = point2

	if (x1 === x2) {
		// If the points have the same x coordinate, the line is vertical.
		// A vertical line does not cross the x-axis at a finite point.
		throw new Error('Vertical line. No finite root.')
	}

	if (y1 === y2) {
		// If the points have the same y coordinate, the line is horizontal.
		if (y1 === 0) {
			// A horizontal line either lies on the x-axis (if y1 == 0)
			throw new Error('The line lies on the x-axis. Infinite roots.')
		} else {
			// A horizontal line above or below the x-axis does not cross it.
			throw new Error('Horizontal line. No root.')
		}
	}

	// Calculate the slope (m)
	const m = (y2 - y1) / (x2 - x1)
	// Calculate the y-intercept (c)
	const c = y1 - m * x1
	// Calculate the root (x when y=0)
	const root = -c / m

	return root
}
