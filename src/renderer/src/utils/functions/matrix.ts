import { Vector3 } from 'three'

/**
 * Multiplies two matrices A and B.
 * @param A The first matrix.
 * @param B The second matrix.
 * @returns The product of the two matrices.
 */
export function multiply(A: number[][], B: number[][]): number[][] {
	const rowsA = A.length
	const colsA = A[0].length
	const colsB = B[0].length

	const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0))

	for (let i = 0; i < rowsA; i++) {
		for (let j = 0; j < colsB; j++) {
			for (let k = 0; k < colsA; k++) {
				result[i][j] += A[i][k] * B[k][j]
			}
		}
	}

	return result
}

export function trans(matriz: number[][]): number[][] {
	const linhas = matriz.length
	const colunas = matriz[0].length

	const resultado: number[][] = Array.from({ length: colunas }, () => Array(linhas).fill(0))

	for (let i = 0; i < linhas; i++) {
		for (let j = 0; j < colunas; j++) {
			resultado[j][i] = matriz[i][j]
		}
	}

	return resultado
}

/**
 * Creates a rotation matrix from two points in 3D space.
 * @param barPoints The two points defining the direction of the bar.
 * @returns The rotation matrix.
 */
export function createRotationMatrix(barPoints: [Vector3, Vector3]): number[][] {
	const x1 = barPoints[1].x
	const y1 = barPoints[1].y
	const z1 = barPoints[1].z

	let dx = barPoints[1].x - barPoints[0].x
	let dy = barPoints[1].y - barPoints[0].y
	let dz = barPoints[1].z - barPoints[0].z

	const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

	const rot_aux: [[number, number, number], [number, number, number], [number, number, number]] = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	] // Matriz auxiliar para cálculo da rotação
	rot_aux[0][0] = dx / length
	rot_aux[0][1] = dy / length
	rot_aux[0][2] = dz / length

	let aux: [number, number, number] = [0, 0, 0]
	if (dx !== 0 || dy !== 0) {
		// If not vertical
		aux = [x1, y1, z1 + 1]
	} else {
		if (dz > 0) {
			aux = [x1 - 1, y1, z1]
		} else {
			aux = [x1 + 1, y1, z1]
		}
	}

	dx = aux[0] - x1
	dy = aux[1] - y1
	dz = aux[2] - z1
	let c = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)

	const alpha = dx / c
	const beta = dy / c
	const gamma = dz / c

	dx = rot_aux[0][1] * gamma - rot_aux[0][2] * beta
	dy = rot_aux[0][2] * alpha - rot_aux[0][0] * gamma
	dz = rot_aux[0][0] * beta - rot_aux[0][1] * alpha
	c = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)

	rot_aux[2][0] = dx / c
	rot_aux[2][1] = dy / c
	rot_aux[2][2] = dz / c

	rot_aux[1][0] = rot_aux[0][2] * rot_aux[2][1] - rot_aux[0][1] * rot_aux[2][2]
	rot_aux[1][1] = rot_aux[0][0] * rot_aux[2][2] - rot_aux[0][2] * rot_aux[2][0]
	rot_aux[1][2] = rot_aux[0][1] * rot_aux[2][0] - rot_aux[0][0] * rot_aux[2][1]

	return rot_aux
}
