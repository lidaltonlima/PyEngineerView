import { Line } from '@react-three/drei'

interface IFixedDisplacementProps {
	// value: number
	position: [number, number, number]
	direction: 'Dx' | 'Dy' | 'Dz'
	scale?: number

	color?: string
}

export const FixedDisplacement = ({
	position,
	direction,
	color = 'white',
	scale = 1
}: IFixedDisplacementProps): React.JSX.Element => {
	const size = 0.2
	const half = size / 2
	const height = (size * Math.sqrt(3)) / 2

	const trianglePoints = [
		[-half, -height / 3, 0], // canto esquerdo da base
		[half, -height / 3, 0], // canto direito da base
		[0, (2 * height) / 3, 0], // vértice oposto (topo)
		[-half, -height / 3, 0] // fecha o triângulo
	]

	const base = size * 0.3
	const offset = 0.04
	const baseLinePoints = [
		[-half - base / 2, -height / 3 - offset, 0],
		[half + base / 2, -height / 3 - offset, 0]
	]

	let rotation: [number, number, number] = [0, 0, 0]
	switch (direction) {
		case 'Dx':
			rotation = [0, 0, Math.PI]
			break
		case 'Dy':
			rotation = [0, Math.PI / 2, -Math.PI / 2]
			break
		case 'Dz':
			rotation = [Math.PI / 2, 0, -Math.PI / 2]
	}

	return (
		<group position={position} rotation={rotation} scale={scale}>
			<group position-x={(height / 3) * 2} rotation={[0, 0, Math.PI / 2]}>
				<Line worldUnits points={trianglePoints.flat()} color={color} lineWidth={0.02 * scale} />
				<Line worldUnits points={baseLinePoints.flat()} color={color} lineWidth={0.02 * scale} />
			</group>
		</group>
	)
}
