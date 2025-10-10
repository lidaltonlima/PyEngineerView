import { Line, LineProps } from '@react-three/drei'
import { Vector3, Quaternion } from 'three'
import { BillboardAxis } from '../../utils'

interface ILineArrowCustomProps {
	position?: Vector3
	direction?: Vector3
	length?: number
	arrowSize?: number

	endBase?: boolean
	notLine?: boolean
}

type ILineArrowProps = ILineArrowCustomProps & Omit<LineProps, 'points'>

export const LineArrow = ({
	position = new Vector3(0, 0, 0),
	direction = new Vector3(1, 0, 0),
	length = 1,
	arrowSize = 0.25,

	endBase = false,
	notLine = false,
	...props
}: ILineArrowProps): React.JSX.Element => {
	// Normalize direction
	const dir = direction.clone().normalize()

	// Create quaternion that rotates X to "direction"
	const quat = new Quaternion()
	quat.setFromUnitVectors(new Vector3(1, 0, 0), dir)

	const linePoints = [
		[0, 0, 0],
		[length, 0, 0]
	]

	const arrowPoints = [
		[length, 0, 0],
		[length - arrowSize, arrowSize * 0.4, 0],
		[length, 0, 0],
		[length - arrowSize, -arrowSize * 0.4, 0]
	]

	const arrowPosition = position.clone().sub(direction.clone().normalize().multiplyScalar(length))

	return (
		<>
			<BillboardAxis axis={direction} position={position}>
				<group rotation-z={direction.x === 0 && direction.y === 0 ? Math.PI / 2 : 0}>
					{!notLine && (
						<Line
							points={linePoints.flat()}
							position={endBase ? arrowPosition.toArray() : [0, 0, 0]}
							lineWidth={2}
							quaternion={quat}
							{...props}
						/>
					)}
					<Line
						points={arrowPoints.flat()}
						position={endBase ? arrowPosition.toArray() : [0, 0, 0]}
						lineWidth={2}
						quaternion={quat}
						{...props}
					/>
				</group>
			</BillboardAxis>
		</>
	)
}
