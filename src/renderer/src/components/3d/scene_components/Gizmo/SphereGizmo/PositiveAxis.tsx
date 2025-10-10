import { Billboard, Circle, Line, Text } from '@react-three/drei'
import { RefObject } from 'react'
import { MeshBasicMaterial } from 'three'

const interBoldFont = new URL('/fonts/Inter-Bold.woff', import.meta.url).href

interface IPositiveAxisProps {
	axis: 'x' | 'y' | 'z'
	label: string
	labelRef: RefObject<MeshBasicMaterial | null>
	cameraLooking: RefObject<'x' | 'y' | 'z' | '-x' | '-y' | '-z' | 'none'>
	color: string
	rotation: [number, number, number]
	onClick: (() => void) | undefined
	onClickLooking: (() => void) | undefined
}

export const PositiveAxis = ({
	axis,
	label,
	labelRef,
	cameraLooking,
	color,
	rotation,
	onClick,
	onClickLooking
}: IPositiveAxisProps): React.JSX.Element => {
	return (
		<group rotation={rotation}>
			<Line fog points={[0, 0, 0, 0.3, 0, 0]} color={color} lineWidth={2} />
			<Billboard position={[0.4, 0, 0]}>
				<Text position={[0, 0, 0.01]} font={interBoldFont} fontSize={0.14}>
					{label}
					<meshBasicMaterial ref={labelRef} color={'black'} fog={false} />
				</Text>
				<Circle
					scale={0.1}
					onPointerEnter={(event) => {
						event.stopPropagation()
						labelRef.current?.color.set('white')
					}}
					onPointerLeave={() => {
						labelRef.current?.color.set('black')
					}}
					onClick={(event) => {
						event.stopPropagation()
						if (onClickLooking && cameraLooking.current === axis) onClickLooking()
						else if (onClick) onClick()
					}}
				>
					<meshBasicMaterial color={color} />
				</Circle>
			</Billboard>
		</group>
	)
}
