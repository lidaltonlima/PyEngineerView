function isClose(a, b, relTol = 1e-9, absTol = 1e-9) {
	return Math.abs(a - b) <= Math.max(relTol * Math.max(Math.abs(a), Math.abs(b)), absTol)
}

console.log(isClose(0.1 + 0.2 - 0.3, 0)) // true
console.log(0.1 + 0.2 - 0.3 === 0) // false
