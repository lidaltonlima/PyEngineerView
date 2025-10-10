import { Billboard, Line, Text } from '@react-three/drei'

const interRegularFont = new URL('/fonts/Inter-Regular.woff', import.meta.url).href

interface ISpringDisplacementProps {
	value: number
	position: [number, number, number]
	direction: 'Dx' | 'Dy' | 'Dz'
	scale?: number

	color?: string
	textColor?: string

	label?: boolean
}

export const SpringDisplacement = ({
	value,
	position,
	direction,
	scale = 1,
	color = 'white',
	textColor = 'white',
	label = false
}: ISpringDisplacementProps): React.JSX.Element => {
	const size = 0.05
	const points = [
		[0.0, 0.0, 0.0],
		[size, size, 0.0],
		[2 * size, -size, 0.0],
		[3 * size, size, 0.0],
		[4 * size, -size, 0.0],
		[5 * size, 0.0, 0.0],
		[5 * size, 2 * size, 0.0],
		[5 * size, -2 * size, 0.0]
	]

	let anchorXLabel: 'right' | 'left' = 'left'
	let labelRotation = 0
	let rotation: [number, number, number] = [0, 0, 0]
	switch (direction) {
		case 'Dx':
			anchorXLabel = 'right'
			rotation = [0, 0, Math.PI]
			break
		case 'Dy':
			rotation = [0, Math.PI / 2, -Math.PI / 2]
			break
		case 'Dz':
			anchorXLabel = 'right'
			labelRotation = Math.PI / 2
			rotation = [Math.PI / 2, 0, -Math.PI / 2]
	}

	return (
		<group position={position} scale={scale} rotation={rotation}>
			<Line worldUnits points={points.flat()} color={color} lineWidth={0.02 * scale} />
			{label && (
				<Billboard position={[0.4, 0, 0]}>
					<Text
						rotation-z={labelRotation}
						renderOrder={10}
						anchorX={anchorXLabel}
						font={interRegularFont}
						fontSize={0.1}
					>
						{value.toString()}
						<meshBasicMaterial color={textColor} depthTest={false} />
					</Text>
				</Billboard>
			)}
		</group>
	)
}
