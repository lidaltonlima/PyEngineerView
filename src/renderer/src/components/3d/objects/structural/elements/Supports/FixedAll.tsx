import { Billboard, Line } from '@react-three/drei'

interface IFixedAllProps {
	position: [number, number, number]
	color?: string
}

export const FixedAll = ({ position, color = 'magenta' }: IFixedAllProps): React.JSX.Element => {
	const size = 0.2
	const height = 0.15
	const rotationDistance = 0.1
	const linesAmount = 5
	const offset = (size / (linesAmount - 1)) * 2
	const lines: React.JSX.Element[] = []
	for (let i = 0; i < linesAmount; i++) {
		lines.push(
			<Line
				key={`FixedAll-Line${i}`}
				worldUnits
				points={[-size + i * offset, 0, 0, -size + i * offset - rotationDistance, -height, 0]}
				color={color}
				lineWidth={0.02}
			/>
		)
	}

	return (
		<Billboard position={position}>
			<Line worldUnits points={[-size, 0, 0, size, 0, 0]} color={color} lineWidth={0.02} />
			{lines}
		</Billboard>
	)
}
