import { BillboardTextAxis } from '@renderer/components/3d/utils'
import { Vector3 } from 'three'
import { CurvedArrow } from '../../../CurvedArrow'

const interRegularFont = new URL('/fonts/Inter-Regular.woff', import.meta.url).href

interface IMomentCustomProps {
	direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
	value: number
	radius?: number
	scale?: number
	arrowColor?: string
	labelColor?: string

	label?: boolean
}

type IMomentProps = IMomentCustomProps & React.JSX.IntrinsicElements['group']

export const Moment = ({
	direction,
	value,
	radius = 0.4,
	scale = 0.35,
	arrowColor = 'white',
	labelColor = 'white',
	label = false,
	...groupProps
}: IMomentProps): React.JSX.Element => {
	const billboardPosition = new Vector3()
	let anchorXLabel: 'right' | 'left' = 'left'
	let labelDirection: 'x' | 'y' | 'z' = 'x'
	const offsetLabel1 = 0.28 * (radius / 0.4)
	const offsetLabel2 = 0.3 * (radius / 0.4)
	const offsetNegativeLabel = 0.03 * (radius / 0.4)
	switch (direction) {
		case 'x':
			labelDirection = 'x'
			billboardPosition.set(0, offsetLabel1, -offsetLabel2)
			break
		case 'y':
			billboardPosition.set(offsetLabel1, 0, offsetLabel2)
			labelDirection = 'y'
			break
		case 'z':
			labelDirection = 'z'
			billboardPosition.set(-offsetLabel1, offsetLabel2, 0)
			break
		case '-x':
			labelDirection = 'x'
			anchorXLabel = 'right'
			billboardPosition.set(0, -offsetLabel1, offsetLabel2 - offsetNegativeLabel)
			break
		case '-y':
			labelDirection = 'y'
			anchorXLabel = 'right'
			billboardPosition.set(-offsetLabel1, 0, -offsetLabel2 + offsetNegativeLabel)
			break
		case '-z':
			labelDirection = 'z'
			anchorXLabel = 'right'
			billboardPosition.set(offsetLabel1, -offsetLabel2 + offsetNegativeLabel, 0)
	}

	return (
		<group {...groupProps}>
			<CurvedArrow radius={radius} color={arrowColor} direction={direction} scale={scale} />
			{label && (
				<BillboardTextAxis
					axis={labelDirection}
					position={billboardPosition}
					offsetX={0.03}
					anchorX={anchorXLabel}
					anchorY='middle'
					font={interRegularFont}
					fontSize={0.1}
					color={labelColor}
				>
					{value.toString()}
				</BillboardTextAxis>
			)}
		</group>
	)
}
