import { Line } from '@react-three/drei'

interface IArrowCustomProps {
	direction?: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
	length?: number
	color?: string
	scale?: number
	rotation?: [number, number, number]

	heightArrow?: number
	radiusArrow?: number
	lineWeight?: number

	endBase?: boolean
	notLine?: boolean
}

type IArrowProps = IArrowCustomProps & React.JSX.IntrinsicElements['group']

export const Arrow = ({
	direction = 'x',
	length = 1,
	color = 'white',
	scale = 1,
	heightArrow = 0.4,
	radiusArrow = 0.12,
	lineWeight = 0.08,
	endBase = false,
	notLine = false,
	...props
}: IArrowProps): React.JSX.Element => {
	const moveBase = endBase ? length : 0

	let rotateZToDirection = 0
	let rotateXToDirection = 0
	switch (direction) {
		case 'x':
			rotateZToDirection = -Math.PI / 2
			break
		case 'y':
			break
		case 'z':
			rotateXToDirection = Math.PI / 2
			break
		case '-x':
			rotateZToDirection = Math.PI / 2
			break
		case '-y':
			rotateZToDirection = Math.PI
			break
		case '-z':
			rotateXToDirection = -Math.PI / 2
	}

	return (
		<group {...props}>
			<group rotation={[rotateXToDirection, 0, rotateZToDirection]}>
				<mesh position={[0, length - moveBase - scale * (heightArrow / 2), 0]} scale={scale}>
					<coneGeometry args={[radiusArrow, heightArrow, 32]} />
					<meshBasicMaterial color={color} />
				</mesh>
				{!notLine && (
					<Line
						worldUnits
						points={[0, 0, 0, 0, length - scale * (heightArrow / 2), 0]}
						lineWidth={lineWeight * scale}
						color={color}
						position={[0, -moveBase, 0]}
					/>
				)}
			</group>
		</group>
	)
}
