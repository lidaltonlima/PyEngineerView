import { useFrame, useThree } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'

type AxisBillboardProps = {
	axis?: 'x' | 'y' | 'z'
	children: React.ReactNode
}

export const YBillboard = ({ axis = 'y', children }: AxisBillboardProps): React.JSX.Element => {
	const ref = useRef<THREE.Group>(null!)
	const { camera } = useThree()

	useFrame(() => {
		if (!ref.current) return

		const pos = ref.current.getWorldPosition(new THREE.Vector3())
		const dir = camera.position.clone().sub(pos)

		if (axis === 'y') {
			// rota apenas em torno de Y
			const angle = Math.atan2(dir.x, dir.z)
			ref.current.rotation.set(0, angle, 0)
		} else if (axis === 'x') {
			// rota apenas em torno de X
			const angle = Math.atan2(dir.y, dir.z)
			ref.current.rotation.set(-angle, 0, 0)
		} else if (axis === 'z') {
			// rota apenas em torno de Z
			const angle = Math.atan2(dir.y, dir.x)
			ref.current.rotation.set(0, 0, angle)
		}
	})

	return <group ref={ref}>{children}</group>
}
