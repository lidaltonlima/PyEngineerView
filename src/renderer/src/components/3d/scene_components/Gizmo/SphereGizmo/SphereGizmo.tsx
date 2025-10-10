import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Line2, LineSegments2 } from 'three/examples/jsm/Addons'
import { ISphereGizmoProps } from './ISphereGizmoProps'
import { PositiveAxis } from './PositiveAxis'
import { NegativeAxis } from './NegativeAxis'

export const SphereGizmo = ({
	camera,
	onClickX = undefined,
	onClickLookingX = undefined,
	onClickXNegative = undefined,
	onClickLookingXNegative = undefined,

	onClickY = undefined,
	onClickLookingY = undefined,
	onClickYNegative = undefined,
	onClickLookingYNegative = undefined,

	onClickZ = undefined,
	onClickLookingZ = undefined,
	onClickZNegative = undefined,
	onClickLookingZNegative = undefined
}: ISphereGizmoProps): React.JSX.Element => {
	const labelX = useRef<THREE.MeshBasicMaterial>(null)
	const labelY = useRef<THREE.MeshBasicMaterial>(null)
	const labelZ = useRef<THREE.MeshBasicMaterial>(null)
	const labelXNegative = useRef<THREE.Group>(null)
	const labelYNegative = useRef<THREE.Group>(null)
	const labelZNegative = useRef<THREE.Group>(null)
	const lineXNegative = useRef<Line2 | LineSegments2>(null)
	const lineYNegative = useRef<Line2 | LineSegments2>(null)
	const lineZNegative = useRef<Line2 | LineSegments2>(null)

	const isMouseEnter = useRef(false)
	const cameraLooking = useRef<'x' | 'y' | 'z' | '-x' | '-y' | '-z' | 'none'>('none')

	useFrame(() => {
		if (camera.rotation.z === 0 && camera.rotation.y === Math.PI / 2) {
			cameraLooking.current = 'x'
		} else if (Math.abs(camera.rotation.z) === Math.PI && Math.abs(camera.rotation.y) < 0.001) {
			cameraLooking.current = 'y'
		} else if (Math.abs(camera.rotation.x) < 0.001 && Math.abs(camera.rotation.y) === 0) {
			cameraLooking.current = 'z'
		} else if (camera.rotation.z === 0 && camera.rotation.y === -Math.PI / 2) {
			cameraLooking.current = '-x'
		} else if (camera.rotation.z === 0 && camera.rotation.y === 0) {
			cameraLooking.current = '-y'
		} else if (Math.abs(camera.rotation.x) > Math.PI - 0.001 && Math.abs(camera.rotation.y) === 0) {
			cameraLooking.current = '-z'
		} else {
			cameraLooking.current = 'none'
		}

		if (cameraLooking.current !== 'none') {
			if (labelXNegative.current) labelXNegative.current.visible = true
			if (lineXNegative.current) lineXNegative.current.visible = true

			if (labelYNegative.current) labelYNegative.current.visible = true
			if (lineYNegative.current) lineYNegative.current.visible = true

			if (labelZNegative.current) labelZNegative.current.visible = true
			if (lineZNegative.current) lineZNegative.current.visible = true
		} else if (!isMouseEnter.current) {
			if (labelXNegative.current) labelXNegative.current.visible = false
			if (lineXNegative.current) lineXNegative.current.visible = false

			if (labelYNegative.current) labelYNegative.current.visible = false
			if (lineYNegative.current) lineYNegative.current.visible = false

			if (labelZNegative.current) labelZNegative.current.visible = false
			if (lineZNegative.current) lineZNegative.current.visible = false
		}
	}, 1)

	return (
		<>
			<PositiveAxis
				axis='x'
				label='X'
				labelRef={labelX}
				cameraLooking={cameraLooking}
				color='#ff3653'
				rotation={[0, 0, 0]}
				onClick={onClickX}
				onClickLooking={onClickLookingX}
			/>
			<PositiveAxis
				axis='y'
				label='Y'
				labelRef={labelY}
				cameraLooking={cameraLooking}
				color='#77b316'
				rotation={[0, 0, Math.PI * 0.5]}
				onClick={onClickY}
				onClickLooking={onClickLookingY}
			/>
			<PositiveAxis
				axis='z'
				label='Z'
				labelRef={labelZ}
				cameraLooking={cameraLooking}
				color='#317acd'
				rotation={[0, -Math.PI * 0.5, 0]}
				onClick={onClickZ}
				onClickLooking={onClickLookingZ}
			/>
			<NegativeAxis
				axis='-x'
				label='-X'
				labelRef={labelXNegative}
				lineRef={lineXNegative}
				cameraLooking={cameraLooking}
				isMouseEnter={isMouseEnter}
				color='#ff3653'
				rotation={[0, 0, Math.PI]}
				onClick={onClickXNegative}
				onClickLooking={onClickLookingXNegative}
			/>
			<NegativeAxis
				axis='-y'
				label='-Y'
				labelRef={labelYNegative}
				lineRef={lineYNegative}
				cameraLooking={cameraLooking}
				isMouseEnter={isMouseEnter}
				color='#77b316'
				rotation={[0, 0, -Math.PI / 2]}
				onClick={onClickYNegative}
				onClickLooking={onClickLookingYNegative}
			/>
			<NegativeAxis
				axis='-z'
				label='-Z'
				labelRef={labelZNegative}
				lineRef={lineZNegative}
				cameraLooking={cameraLooking}
				isMouseEnter={isMouseEnter}
				color='#317acd'
				rotation={[0, Math.PI / 2, 0]}
				onClick={onClickZNegative}
				onClickLooking={onClickLookingZNegative}
			/>
		</>
	)
}
