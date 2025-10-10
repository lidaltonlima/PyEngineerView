import { Billboard, Line } from '@react-three/drei'

interface IFixedAllDisplacementProps {
	position: [number, number, number]
	scale?: number
	color?: string
}

export const FixedAllDisplacement = ({
	position,
	scale = 1,
	color = 'magenta'
}: IFixedAllDisplacementProps): React.JSX.Element => {
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
	const baseLinePoints = [
		[-half - base / 2, -height / 3, 0],
		[half + base / 2, -height / 3, 0]
	]

	// Lines
	const lineSize = (size + base) / 2
	const lineHeight = 0.05
	const rotationDistance = 0.05
	const linesAmount = 5
	const lineOffset = (lineSize / (linesAmount - 1)) * 2
	const lines: React.JSX.Element[] = []
	for (let i = 0; i < linesAmount; i++) {
		lines.push(
			<Line
				key={`OnlyDisplacement-Line${i}`}
				worldUnits
				points={[
					-lineSize + i * lineOffset,
					-(height + 0.005) / 3,
					0,
					-lineSize + i * lineOffset - rotationDistance,
					-lineHeight - height / 2,
					0
				]}
				color={color}
				lineWidth={0.02}
			/>
		)
	}

	return (
		<Billboard position={position}>
			<group scale={scale}>
				<group position={[0, -(height / 3) * 2, 0]}>
					<Line worldUnits points={trianglePoints.flat()} color={color} lineWidth={0.02 * scale} />
					<Line worldUnits points={baseLinePoints.flat()} color={color} lineWidth={0.02 * scale} />
					{lines}
				</group>
			</group>
		</Billboard>
	)
}
