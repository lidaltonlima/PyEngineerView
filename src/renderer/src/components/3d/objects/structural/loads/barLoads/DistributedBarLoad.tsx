import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { DistributedLoad1D } from '../DistributedLoad1D'
import { forcesType } from '@renderer/types/Structure'

interface IDistributedBarLoadCustomProps {
	name: string
	direction: THREE.Vector3
	forceDirection: forcesType
	xPositions: [number, number]
	loads: [number, number]
	system: 'global' | 'local'
	rotationAroundDirection?: number
	barPoints: [THREE.Vector3, THREE.Vector3]

	yUp?: boolean
}

type IBarDistributedLoadProps = IDistributedBarLoadCustomProps &
	React.JSX.IntrinsicElements['group']

export const BarDistributedLoad = ({
	name,
	direction,
	forceDirection,
	loads,
	xPositions,
	system,
	rotationAroundDirection = 0,
	yUp = false,
	barPoints,
	...props
}: IBarDistributedLoadProps): React.JSX.Element => {
	const groupRef1 = useRef<THREE.AxesHelper>(null)
	const groupRef2 = useRef<THREE.Group>(null)

	let positiveArrowColor: string = 'white'
	let negativeArrowColor: string = 'white'
	let positiveLabelColor: string = 'white'
	let negativeLabelColor: string = 'white'
	switch (forceDirection) {
		case 'Fx':
		case 'Mx':
			positiveArrowColor = 'red'
			negativeArrowColor = '#ff6666'
			positiveLabelColor = 'red'
			negativeLabelColor = '#ff6666'
			break
		case 'Fy':
		case 'My':
			positiveArrowColor = 'green'
			negativeArrowColor = '#00e600'
			positiveLabelColor = 'green'
			negativeLabelColor = '#00e600'
			break
		case 'Fz':
		case 'Mz':
			positiveArrowColor = 'blue'
			negativeArrowColor = '#6666ff'
			positiveLabelColor = 'blue'
			negativeLabelColor = '#6666ff'
			break
	}

	useEffect(() => {
		if (!groupRef1.current) return

		// Origen of helper
		const pos = groupRef1.current.position.clone()

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
		groupRef1.current.setRotationFromMatrix(matrixRotation)

		// Rotation the helper around the axis
		const rotation = direction.equals(new THREE.Vector3(0, 0, -1))
			? rotationAroundDirection + Math.PI
			: rotationAroundDirection
		groupRef2.current?.quaternion.setFromAxisAngle(xDir, rotation)
	}, [direction, rotationAroundDirection, yUp])

	return (
		<>
			{system === 'local' && (
				<group {...props}>
					<group ref={groupRef2} position={barPoints[0]}>
						<group ref={groupRef1}>
							<DistributedLoad1D
								key={`${Math.random()}`}
								name={name}
								forceDirection={forceDirection}
								loads={loads}
								xPositions={xPositions}
								system={system}
								positiveArrowColor={positiveArrowColor}
								negativeArrowColor={negativeArrowColor}
								positiveLabelColor={positiveLabelColor}
								negativeLabelColor={negativeLabelColor}
								barPoints={barPoints}
							/>
						</group>
					</group>
				</group>
			)}
			{system === 'global' && (
				<group {...props}>
					<DistributedLoad1D
						key={`${Math.random()}`}
						name={name}
						forceDirection={forceDirection}
						loads={loads}
						xPositions={xPositions}
						system={system}
						positiveArrowColor={positiveArrowColor}
						negativeArrowColor={negativeArrowColor}
						positiveLabelColor={positiveLabelColor}
						negativeLabelColor={negativeLabelColor}
						barPoints={barPoints}
					/>
				</group>
			)}
		</>
	)
}
