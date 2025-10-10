import { IReleasesData } from '@renderer/types/Structure'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RotationRelease } from './RotationRelease'
import { DisplacementRelease } from './DisplacementRelease'

interface IBarReleaseProps {
	releases: IReleasesData[]
	direction: THREE.Vector3
	startPoint: THREE.Vector3
	endPoint: THREE.Vector3
	barRotation: number
}

export const BarRelease = ({
	releases,
	direction,
	startPoint,
	endPoint,
	barRotation
}: IBarReleaseProps): React.JSX.Element => {
	const groupStartRef = useRef<THREE.Group>(null)
	const groupEndRef = useRef<THREE.Group>(null)
	const directionGroupRef = useRef<THREE.Group>(null)
	const directionGroupAuxRef = useRef<THREE.Group>(null)

	const radius = 0.1
	const barLength = startPoint.distanceTo(endPoint)

	useEffect(() => {
		if (!directionGroupRef.current) return

		// Origen of helper
		const pos = directionGroupRef.current.position.clone()

		// Vector X local -> direction to the point
		const xDir = new THREE.Vector3().subVectors(direction, pos).normalize()

		const zGlobal = new THREE.Vector3(0, 0, 1)
		if (direction.x == 0 && direction.y == 0) zGlobal.set(-1, 0, 0)

		// Y local = Z_global × X
		const yDir = new THREE.Vector3().crossVectors(zGlobal, xDir).normalize()

		// Z local adjusted = X × Y
		const zDir = new THREE.Vector3().crossVectors(xDir, yDir).normalize()

		// Assemble rotation matrix
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Apply to group
		directionGroupRef.current.setRotationFromMatrix(matrixRotation)

		// Rotation the group around the axis
		directionGroupAuxRef.current?.quaternion.setFromAxisAngle(xDir, barRotation)
	}, [direction, barRotation])

	return (
		<>
			<group position={startPoint}>
				<group ref={directionGroupAuxRef}>
					<group ref={directionGroupRef}>
						<group ref={groupStartRef} position-x={radius}>
							{releases.includes('Dxi') && <DisplacementRelease direction='x' />}
							{releases.includes('Dyi') && <DisplacementRelease direction='y' />}
							{releases.includes('Dzi') && <DisplacementRelease direction='z' />}
							{releases.includes('Rxi') && <RotationRelease direction='x' radius={radius} />}
							{releases.includes('Ryi') && <RotationRelease direction='y' radius={radius} />}
							{releases.includes('Rzi') && <RotationRelease direction='z' radius={radius} />}
						</group>
						<group ref={groupEndRef} position-x={barLength - radius}>
							{releases.includes('Dxj') && <DisplacementRelease direction='x' />}
							{releases.includes('Dyj') && <DisplacementRelease direction='y' />}
							{releases.includes('Dzj') && <DisplacementRelease direction='z' />}
							{releases.includes('Rxj') && <RotationRelease direction='x' radius={radius} />}
							{releases.includes('Ryj') && <RotationRelease direction='y' radius={radius} />}
							{releases.includes('Rzj') && <RotationRelease direction='z' radius={radius} />}
						</group>
					</group>
				</group>
			</group>
		</>
	)
}
