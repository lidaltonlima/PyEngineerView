/**
 * Creates an array of linearly spaced numbers between start and end.
 * @param start Initial value
 * @param end Final value
 * @param quantity Quantity of numbers to generate
 * @returns Array of linearly spaced numbers
 */
export function linSpace(start: number, end: number, quantity: number): number[] {
	if (quantity <= 0) {
		return []
	}
	if (quantity === 1) {
		return [start]
	}
	const result = new Array<number>(quantity)
	const step = (end - start) / (quantity - 1)
	for (let i = 0; i < quantity; i++) {
		result[i] = start + step * i
	}
	return result
}

/**
 * Checks if two numbers are approximately equal.
 * @param a First number to compare
 * @param b Second number to compare
 * @param relTol Relative tolerance
 * @param absTol Absolute tolerance
 * @returns True if the numbers are approximately equal, false otherwise
 */
export function isClose(a: number, b: number, relTol = 1e-9, absTol = 1e-9): boolean {
	return Math.abs(a - b) <= Math.max(relTol * Math.max(Math.abs(a), Math.abs(b)), absTol)
}
