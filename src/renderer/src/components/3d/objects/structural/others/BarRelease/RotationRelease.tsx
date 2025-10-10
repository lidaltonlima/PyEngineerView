import { Arc } from '../../../Arc'

interface IRotationReleaseProps {
	direction: 'x' | 'y' | 'z'
	radius?: number
}

export const RotationRelease = ({
	direction,
	radius = 0.1
}: IRotationReleaseProps): React.JSX.Element => {
	let rotation: [number, number, number] = [0, 0, 0]
	let color = 'white'
	switch (direction) {
		case 'x':
			color = 'red'
			rotation = [0, Math.PI / 2, Math.PI / 2]
			break
		case 'y':
			color = 'green'
			rotation = [Math.PI / 2, 0, Math.PI / 2]
			break
		case 'z':
			color = 'blue'
			rotation = [0, 0, 0]
			break
	}

	return (
		<>
			<Arc worldUnits rotation={rotation} radius={radius} color={color} lineWidth={0.01} />
		</>
	)
}
