import { Text, TextProps } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { BillboardAxis } from '../BillboardAxis'

interface IBillboardTextAxisCustomProps {
	children: React.ReactNode
	axis: 'x' | 'y' | 'z'
	position?: [number, number, number] | THREE.Vector3
	anchorX?: 'left' | 'center' | 'right'
	anchorY?: 'top' | 'middle' | 'bottom'
	offsetX?: number
	offsetY?: number
}

type IBillboardTextAxisProps = IBillboardTextAxisCustomProps &
	Omit<
		TextProps,
		'children' | 'rotation' | 'rotateX' | 'rotateY' | 'rotateZ' | 'anchorX' | 'anchorY' | 'position'
	>

export const BillboardTextAxis = ({
	axis,
	children,
	position = [0, 0, 0],
	anchorX = 'center',
	anchorY = 'middle',
	offsetX = 0,
	offsetY = 0,
	...textProps
}: IBillboardTextAxisProps): React.JSX.Element => {
	const { camera } = useThree()
	const groupRef = useRef<THREE.Group>(null!)
	const textRef = useRef<THREE.Object3D>(null!)
	// Removed unused textState
	const [textBoxSize, setTextBoxSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

	const rotation = new THREE.Euler()
	const axisToBillboard = new THREE.Vector3(0, 0, 0)

	switch (axis) {
		case 'x':
			rotation.set(0, 0, 0)
			axisToBillboard.set(1, 0, 0)
			break
		case 'y':
			rotation.set(0, Math.PI, Math.PI / 2)
			axisToBillboard.set(0, 1, 0)
			break
		case 'z':
			rotation.set(Math.PI / 2, Math.PI, Math.PI / 2)
			axisToBillboard.set(0, 0, 1)
			break
	}

	useEffect(() => {
		textRef.current?.position.setX(
			(textBoxSize.w + offsetX) * (anchorX === 'left' ? 0.5 : anchorX === 'center' ? 0 : -0.5)
		)
		textRef.current?.position.setY(
			(textBoxSize.h + offsetY) * (anchorY === 'bottom' ? 0.5 : anchorY === 'middle' ? 0 : -0.5)
		)
	}, [anchorX, anchorY, textBoxSize, offsetX, offsetY])

	useFrame(() => {
		if (!groupRef.current || !textRef.current) return

		// Reset text rotation every frame to avoid accumulation
		textRef.current.rotation.set(0, 0, 0)

		// Get the world quaternion of the text (including parent rotation)
		const worldQuat = groupRef.current.getWorldQuaternion(new THREE.Quaternion())

		// Get the text's up vector in world space
		const textUp = new THREE.Vector3(0, 1, 0).applyQuaternion(worldQuat)
		// Get the camera's up vector in world space
		const cameraUpWorld = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
		// If the text "up" and the camera "up" point in opposite directions → it's upside down
		const dotUp = textUp.dot(cameraUpWorld)
		if (dotUp < 0) {
			textRef.current.rotation.z = Math.PI
		}

		// Get the text's forward vector in world space
		const textForward = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuat)
		// Vector from text to camera
		const toCamera = camera.position
			.clone()
			.sub(groupRef.current.getWorldPosition(new THREE.Vector3()))
			.normalize()
		// If the text's forward vector points toward the camera, it's front; otherwise, it's back
		const dotForward = textForward.dot(toCamera)
		if (dotForward < 0) {
			textRef.current.rotation.y = Math.PI
		}
	})

	return (
		<BillboardAxis axis={axisToBillboard} position={position}>
			<group ref={groupRef} rotation={rotation}>
				<Text
					ref={textRef}
					anchorX={'center'}
					anchorY={'middle'}
					{...textProps}
					onSync={(mesh) => {
						mesh.geometry.computeBoundingBox()
						const box = mesh.geometry.boundingBox
						if (box) {
							const v = new THREE.Vector3()
							box.getSize(v)
							setTextBoxSize({ w: v.x, h: v.y })
						}
					}}
				>
					{children}
				</Text>
			</group>
		</BillboardAxis>
	)
}
