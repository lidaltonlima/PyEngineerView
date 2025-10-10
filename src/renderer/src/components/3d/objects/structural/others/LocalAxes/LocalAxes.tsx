import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { Axes } from '../../../Axes'

interface ILocalAxesCustomProps {
	direction: THREE.Vector3
	rotationAroundDirection?: number
	yUp?: boolean
	scale?: number
	label?: boolean
}

type ILocalAxesProps = ILocalAxesCustomProps & React.JSX.IntrinsicElements['group']

export const LocalAxes = ({
	direction,
	rotationAroundDirection = 0,
	yUp = false,
	scale = 1,
	label,
	...props
}: ILocalAxesProps): React.JSX.Element => {
	const axesRef = useRef<THREE.AxesHelper>(null)
	const groupRef = useRef<THREE.Group>(null)

	useEffect(() => {
		if (!axesRef.current) return

		// Origen of helper
		const pos = axesRef.current.position.clone()

		// Vector X local -> direction to the point
		const xDir = new THREE.Vector3().subVectors(direction, pos).normalize()

		const yDir = new THREE.Vector3()
		const zDir = new THREE.Vector3()
		if (yUp) {
			const yGlobal = new THREE.Vector3(0, 1, 0)

			// Z local = X × Y_global
			zDir.copy(new THREE.Vector3().crossVectors(xDir, yGlobal).normalize())

			// Y local adjusted = Z × X
			yDir.copy(new THREE.Vector3().crossVectors(zDir, xDir).normalize())
		} else {
			const zGlobal = new THREE.Vector3(0, 0, 1)
			if (direction.x == 0 && direction.y == 0) zGlobal.set(-1, 0, 0)

			// Y local = Z_global × X
			yDir.copy(new THREE.Vector3().crossVectors(zGlobal, xDir).normalize())

			// Z local adjusted = X × Y
			zDir.copy(new THREE.Vector3().crossVectors(xDir, yDir).normalize())
		}

		// Assemble rotation matrix
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Apply to helper
		axesRef.current.setRotationFromMatrix(matrixRotation)

		// Rotation the helper around the axis
		const rotation = direction.equals(new THREE.Vector3(0, 0, -1))
			? rotationAroundDirection + Math.PI
			: rotationAroundDirection
		groupRef.current?.quaternion.setFromAxisAngle(xDir, rotation)
	}, [direction, rotationAroundDirection, yUp])

	return (
		<group {...props}>
			<group ref={groupRef}>
				<Axes ref={axesRef} label={label} scale={scale} />
			</group>
		</group>
	)
}
