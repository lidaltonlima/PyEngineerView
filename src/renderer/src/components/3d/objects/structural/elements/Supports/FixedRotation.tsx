import { Line } from '@react-three/drei'

interface IFixedRotationProps {
	position: [number, number, number]
	direction: 'Rx' | 'Ry' | 'Rz'
	scale?: number
	color?: string
}

export const FixedRotation = ({
	position,
	direction,
	scale = 1,
	color = 'white'
}: IFixedRotationProps): React.JSX.Element => {
	const size = 0.1
	const pointsLine = [
		[0.0, 0.0, 0.0],
		[1.5 * size, 0.0, 0.0]
	]

	const pointsSquare = [
		[1.5 * size, size, size],
		[1.5 * size, -size, size],
		[1.5 * size, -size, -size],
		[1.5 * size, size, -size],
		[1.5 * size, size, size]
	]

	let rotation: [number, number, number] = [0, 0, 0]
	switch (direction) {
		case 'Rx':
			break
		case 'Ry':
			rotation = [0, 0, Math.PI / 2]
			break
		case 'Rz':
			rotation = [0, -Math.PI / 2, 0]
	}

	return (
		<group position={position} rotation={rotation}>
			<Line worldUnits points={pointsLine.flat()} color={color} lineWidth={0.02 * scale} />
			<Line worldUnits points={pointsSquare.flat()} color={color} lineWidth={0.02 * scale} />
		</group>
	)
}
