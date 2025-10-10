import { BillboardTextAxis } from '@renderer/components/3d/utils'
import { LineArrow } from '../../../LineArrow'
import { Vector3 } from 'three'

const interRegularFont = new URL('/fonts/Inter-Regular.woff', import.meta.url).href

interface IForceCustomProps {
	direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
	value: number
	arrowColor?: string
	textColor?: string
	label?: boolean
}

type IForceProps = IForceCustomProps & React.JSX.IntrinsicElements['group']

export const Force = ({
	direction,
	value,
	arrowColor = 'white',
	textColor = 'white',
	label = false,
	...groupProps
}: IForceProps): React.JSX.Element => {
	const billboardPosition = new Vector3()
	let anchorXLabel: 'right' | 'left' = 'left'
	let labelDirection: 'x' | 'y' | 'z' = 'x'
	const arrowDirection = new Vector3(0, 0, 0)
	const offsetLabel = 0.2
	switch (direction) {
		case 'x':
			labelDirection = 'x'
			anchorXLabel = 'right'
			billboardPosition.set(-offsetLabel, 0, 0)
			arrowDirection.set(1, 0, 0)
			break
		case 'y':
			labelDirection = 'y'
			anchorXLabel = 'right'
			billboardPosition.set(0, -offsetLabel, 0)
			arrowDirection.set(0, 1, 0)
			break
		case 'z':
			labelDirection = 'z'
			anchorXLabel = 'right'
			billboardPosition.set(0, 0, -offsetLabel)
			arrowDirection.set(0, 0, 1)
			break
		case '-x':
			labelDirection = 'x'
			billboardPosition.set(offsetLabel, 0, 0)
			arrowDirection.set(-1, 0, 0)
			break
		case '-y':
			labelDirection = 'y'
			billboardPosition.set(0, offsetLabel, 0)
			arrowDirection.set(0, -1, 0)
			break
		case '-z':
			labelDirection = 'z'
			billboardPosition.set(0, 0, offsetLabel)
			arrowDirection.set(0, 0, -1)
	}

	return (
		<group {...groupProps}>
			<LineArrow
				direction={arrowDirection}
				length={0.35}
				arrowSize={0.15}
				lineWidth={0.015}
				worldUnits
				color={arrowColor}
				endBase
			/>
			{label && (
				<BillboardTextAxis
					axis={labelDirection}
					position={billboardPosition}
					anchorX={anchorXLabel}
					anchorY='bottom'
					font={interRegularFont}
					fontSize={0.1}
					color={textColor}
				>
					{value.toString()}
				</BillboardTextAxis>
			)}
		</group>
	)
}
