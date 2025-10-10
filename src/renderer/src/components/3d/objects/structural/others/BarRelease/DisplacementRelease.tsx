import { Line } from '@react-three/drei'

interface IDisplacementReleaseProps {
	direction: 'x' | 'y' | 'z'
}

export const DisplacementRelease = ({
	direction
}: IDisplacementReleaseProps): React.JSX.Element => {
	const length = 0.08
	const offset = 0.02

	let rotation: [number, number, number] = [0, 0, 0]
	let color = 'white'
	switch (direction) {
		case 'x':
			color = 'red'
			rotation = [0, 0, 0]
			break
		case 'y':
			color = 'green'
			rotation = [0, 0, Math.PI / 2]
			break
		case 'z':
			color = 'blue'
			rotation = [Math.PI / 2, 0, Math.PI / 2]
			break
	}

	return (
		<group rotation={rotation}>
			<Line
				worldUnits
				points={[-length, 0, offset, length, 0, offset]}
				color={color}
				lineWidth={0.01}
			/>
			<Line
				worldUnits
				points={[-length, 0, -offset, length, 0, -offset]}
				color={color}
				lineWidth={0.01}
			/>
		</group>
	)
}
