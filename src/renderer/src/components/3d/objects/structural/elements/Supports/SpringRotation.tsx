import { Billboard, Line, Text } from '@react-three/drei'
import { linSpace } from '@renderer/utils/functions/others'

const interRegularFont = new URL('/fonts/Inter-Regular.woff', import.meta.url).href

interface ISpringRotationProps {
	value: number
	position: [number, number, number]
	direction: 'Rx' | 'Ry' | 'Rz'
	scale?: number
	color?: string
	textColor?: string
	label?: boolean
}

export const SpringRotation = ({
	value,
	position,
	direction,
	scale = 1,
	color = 'white',
	textColor = 'white',
	label = true
}: ISpringRotationProps): React.JSX.Element => {
	const size = 0.15

	const pointsLine = [
		[0, 0, 0],
		[size, 0, 0]
	]

	const pointsNumber = 100
	const initialRadius = 0.0001
	const endRadius = size
	const lapsNumber = 3

	const theta = linSpace(0, 2 * Math.PI * lapsNumber, pointsNumber)
	const raio = linSpace(initialRadius, endRadius, pointsNumber)

	const pointsSpiral: number[][] = []
	for (let i = 0; i < pointsNumber; i++) {
		// Coordenada X é fixa para cada ponto da espiral
		const x = size
		// Coordenadas Y e Z calculadas com base no raio e ângulo
		const y = raio[i] * Math.cos(theta[i])
		const z = raio[i] * Math.sin(theta[i])
		// Adiciona o novo ponto ao array
		pointsSpiral.push([x, y, z])
	}

	let labelRotation = 0
	let rotation: [number, number, number] = [0, 0, 0]
	switch (direction) {
		case 'Rx':
			break
		case 'Ry':
			rotation = [0, 0, Math.PI / 2]
			break
		case 'Rz':
			labelRotation = Math.PI / 2
			rotation = [0, -Math.PI / 2, 0]
	}

	return (
		<group position={position} rotation={rotation} scale={scale}>
			<Line worldUnits points={pointsLine.flat()} color={color} lineWidth={0.02 * scale} />
			<Line worldUnits points={pointsSpiral.flat()} color={color} lineWidth={0.02 * scale} />
			{label && (
				<Billboard position={[0.25, 0, 0]}>
					<Text
						rotation-z={labelRotation}
						renderOrder={10}
						anchorX={'left'}
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
