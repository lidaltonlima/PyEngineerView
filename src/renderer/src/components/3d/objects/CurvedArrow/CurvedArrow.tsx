import { Arc } from '../Arc'

interface ICurvedArrowCustomProps {
	direction?: 'x' | '-x' | 'y' | '-y' | 'z' | '-z'
	radius?: number
	color?: string
	scale?: number

	heightArrow?: number
	radiusArrow?: number
	lineWeight?: number
}

type ICurvedArrowProps = ICurvedArrowCustomProps & React.JSX.IntrinsicElements['group']

export const CurvedArrow = ({
	direction = 'x',
	radius = 1,
	scale = 1,
	heightArrow = 0.4,
	radiusArrow = 0.12,
	color = 'white',
	lineWeight = 0.08,
	...props
}: ICurvedArrowProps): React.JSX.Element => {
	let rotateXToDirection = 0
	let rotateYToDirection = 0
	let rotateZToDirection = 0
	let rotateAxisZEnd = 0
	switch (direction) {
		case 'x':
			rotateXToDirection = -Math.PI / 4
			rotateZToDirection = 0
			break
		case '-x':
			rotateXToDirection = -Math.PI / 4
			rotateZToDirection = Math.PI
			break
		case 'y':
			rotateYToDirection = Math.PI * (3 / 4)
			rotateZToDirection = Math.PI / 2
			break
		case '-y':
			rotateYToDirection = Math.PI * (3 / 4)
			rotateZToDirection = -Math.PI / 2
			break
		case 'z':
			rotateYToDirection = -Math.PI / 2
			rotateAxisZEnd = Math.PI / 4
			break
		case '-z':
			rotateYToDirection = Math.PI / 2
			rotateAxisZEnd = -Math.PI * (3 / 4)
	}

	return (
		<group {...props}>
			<group rotation-z={rotateAxisZEnd}>
				<group rotation={[rotateXToDirection, rotateYToDirection, rotateZToDirection]}>
					<mesh
						position={[0, -radius, -scale * (heightArrow / 2)]}
						scale={scale}
						rotation={[-Math.PI / 2, 0, 0]}
					>
						<coneGeometry args={[radiusArrow, heightArrow, 32]} />
						<meshBasicMaterial color={color} />
					</mesh>
					<Arc
						radius={radius}
						angle={Math.PI}
						worldUnits
						color={color}
						lineWidth={lineWeight * scale}
						rotation={[0, Math.PI / 2, Math.PI / 2]}
					/>
				</group>
			</group>
		</group>
	)
}
