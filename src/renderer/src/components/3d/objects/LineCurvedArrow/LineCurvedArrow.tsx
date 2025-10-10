import { Line } from '@react-three/drei'
import { Quaternion, Vector3 } from 'three'
import { Arc } from '../Arc'
import { BillboardAxis } from '../../utils'

interface ILineCurvedArrowCustomProps {
	position?: Vector3
	direction?: Vector3
	arrowSize?: number
	radius?: number
	scale?: number
	color?: string
	lineWidth?: number

	endBase?: boolean
	notLine?: boolean
}

type ILineCurvedArrowProps = ILineCurvedArrowCustomProps & React.JSX.IntrinsicElements['group']

export const LineCurvedArrow = ({
	direction = new Vector3(1, 0, 0),
	arrowSize = 0.25,
	radius = 1,
	scale = 1,
	color = 'white',
	lineWidth = 0.015,

	...groupProps
}: ILineCurvedArrowProps): React.JSX.Element => {
	// Normalize direction
	const dir = direction.clone().normalize()

	// Create quaternion that rotates X to "direction"
	const quat = new Quaternion()
	quat.setFromUnitVectors(new Vector3(1, 0, 0), dir)

	const arrowPoints = [
		[0, 0, 0],
		[-arrowSize, arrowSize * 0.4, 0],
		[0, 0, 0],
		[-arrowSize, -arrowSize * 0.4, 0]
	]

	return (
		<group {...groupProps}>
			<group quaternion={quat}>
				<Arc
					radius={radius}
					angle={Math.PI}
					worldUnits
					color={color}
					lineWidth={lineWidth * scale}
					rotation={[0, Math.PI / 2, Math.PI / 2]}
				/>
				<group rotation={[0, Math.PI / 2, 0]} position={[0, -radius, 0]}>
					<BillboardAxis axis={new Vector3(1, 0, 0)}>
						<Line
							points={arrowPoints.flat()}
							lineWidth={lineWidth * scale}
							color={color}
							worldUnits
						/>
					</BillboardAxis>
				</group>
			</group>
		</group>
	)
}
