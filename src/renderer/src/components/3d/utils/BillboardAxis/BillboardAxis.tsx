import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface IBillboardAxisCustomProps {
	children?: React.ReactNode
	axis: THREE.Vector3
}

type BillboardAxisProps = IBillboardAxisCustomProps & React.JSX.IntrinsicElements['group']

export const BillboardAxis = ({
	children,
	axis,
	...groupProps
}: BillboardAxisProps): React.JSX.Element => {
	const ref = useRef<THREE.Group>(null!)
	const { camera } = useThree()

	// Create a normalized copy of the axis vector
	const axisNorm = axis.clone().normalize()

	useFrame(() => {
		if (!ref.current) return

		// Position of the object in world coordinates
		const pos = ref.current.getWorldPosition(new THREE.Vector3())

		// Direction from camera to object (in world space)
		const dirWorld = camera.position.clone().sub(pos).normalize()

		// Convert direction to local object space
		const dirLocal = dirWorld.clone()
		ref.current.parent?.worldToLocal(dirLocal.add(pos)).sub(ref.current.position).normalize()

		// Build orthonormal basis around axis
		const u = new THREE.Vector3()
		const v = new THREE.Vector3()
		// Take an arbitrary non-collinear vector
		if (Math.abs(axisNorm.x) < 0.9) {
			u.set(1, 0, 0)
		} else {
			u.set(0, 1, 0)
		}
		// Gram–Schmidt
		u.crossVectors(axisNorm, u).normalize()
		v.crossVectors(axisNorm, u).normalize()

		// Project direction onto plane (u,v)
		const x = dirLocal.dot(u)
		const y = dirLocal.dot(v)
		const angle = Math.atan2(y, x)

		// Apply rotation around axis
		const quat = new THREE.Quaternion().setFromAxisAngle(axisNorm, angle)
		ref.current.setRotationFromQuaternion(quat)
	})

	return (
		<group ref={ref} {...groupProps}>
			{children}
		</group>
	)
}
