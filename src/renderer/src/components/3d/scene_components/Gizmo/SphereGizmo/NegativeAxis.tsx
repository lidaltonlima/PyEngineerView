import { Billboard, Circle, Line, Text } from '@react-three/drei'
import { RefObject } from 'react'
import { Group, Object3DEventMap } from 'three'
import { Line2, LineSegments2 } from 'three/examples/jsm/Addons'

const interBoldFont = new URL('/fonts/Inter-Bold.woff', import.meta.url).href

interface INegativeAxisProps {
	axis: '-x' | '-y' | '-z'
	label: string
	labelRef: RefObject<Group<Object3DEventMap> | null>
	lineRef: RefObject<Line2 | LineSegments2 | null>
	cameraLooking: RefObject<'x' | 'y' | 'z' | '-x' | '-y' | '-z' | 'none'>
	isMouseEnter: RefObject<boolean>
	color: string
	rotation: [number, number, number]
	onClick: (() => void) | undefined
	onClickLooking: (() => void) | undefined
}

export const NegativeAxis = ({
	axis,
	label,
	labelRef,
	lineRef,
	cameraLooking,
	isMouseEnter,
	color,
	rotation,
	onClick,
	onClickLooking
}: INegativeAxisProps): React.JSX.Element => {
	return (
		<group rotation={rotation}>
			<Line
				ref={lineRef}
				points={[0, 0, 0, 0.3, 0, 0]}
				color={color}
				lineWidth={2}
				depthTest={false}
				depthWrite={false}
			/>
			<Billboard position={[0.4, 0, 0]}>
				<group ref={labelRef} visible={false} position={[0, 0, 0.01]}>
					<Text font={interBoldFont} fontSize={0.14}>
						{label}
						<meshBasicMaterial color={'white'} fog={false} />
					</Text>
				</group>
				<Circle
					scale={0.1}
					onPointerEnter={(event) => {
						event.stopPropagation()
						if (labelRef.current) labelRef.current.visible = true
						isMouseEnter.current = true
					}}
					onPointerLeave={() => {
						if (labelRef.current) labelRef.current.visible = false
						isMouseEnter.current = false
					}}
					onClick={(event) => {
						event.stopPropagation()
						if (onClickLooking && cameraLooking.current === axis) onClickLooking()
						else if (onClick) onClick()
					}}
				>
					<meshBasicMaterial color={color} />
				</Circle>
				<Circle scale={0.09} position={[0, 0, 0.005]}>
					<meshBasicMaterial color={'black'} transparent opacity={0.7} />
				</Circle>
			</Billboard>
		</group>
	)
}
