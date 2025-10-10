import { Line, LineProps } from '@react-three/drei'
import { linSpace } from '@renderer/utils/functions/others'

interface IArcCustomProps {
	radius?: number
	angle?: number
}

type IArcProps = IArcCustomProps & Omit<LineProps, 'points'>

export const Arc = ({
	radius = 1,
	angle = Math.PI * 2,
	...props
}: IArcProps): React.JSX.Element => {
	const anglesToLinePoints = linSpace(0, angle, 64)
	const linePoints = anglesToLinePoints.map((value) => [
		radius * Math.cos(value),
		radius * Math.sin(value),
		0
	])

	return <Line points={linePoints.flat()} {...props} />
}
