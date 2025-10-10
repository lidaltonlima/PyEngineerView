/**
 * Distributed Load in bars with local system
 */
import { forcesType } from '@renderer/types/Structure'
import React from 'react'
import * as THREE from 'three'
import { DistributedForceLine } from './loadsStyle/DistributedForceLine'
import { DistributedForce } from './loadsStyle'
import { DistributedMoment } from './loadsStyle/DistributedMoment'

interface ILoadGlobalSystemProps {
	name: string
	forceDirection: forcesType
	loads: [number, number]
	xPositions: [number, number]
	barPoints: [THREE.Vector3, THREE.Vector3]

	size: number

	positiveArrowColor: string
	negativeArrowColor: string
	positiveLabelColor: string
	negativeLabelColor: string
}

export const LoadGlobalSystem = ({
	name,
	forceDirection,
	loads,
	xPositions,
	size,
	positiveArrowColor,
	negativeArrowColor,
	positiveLabelColor,
	negativeLabelColor,
	barPoints
}: ILoadGlobalSystemProps): React.JSX.Element => {
	let load: React.JSX.Element = <></>
	switch (forceDirection) {
		case 'Fx':
		case 'Fy':
		case 'Fz':
			if (
				(barPoints[0].x === barPoints[1].x &&
					barPoints[0].y === barPoints[1].y &&
					forceDirection === 'Fz') ||
				(barPoints[0].y === barPoints[1].y &&
					barPoints[0].z === barPoints[1].z &&
					forceDirection === 'Fx') ||
				(barPoints[0].x === barPoints[1].x &&
					barPoints[0].z === barPoints[1].z &&
					forceDirection === 'Fy')
			) {
				load = (
					<DistributedForce
						name={name}
						forceDirection={forceDirection}
						loads={loads}
						xPositions={xPositions}
						barPoints={barPoints}
						size={size}
						positiveArrowColor={positiveArrowColor}
						negativeArrowColor={negativeArrowColor}
						positiveLabelColor={positiveLabelColor}
						negativeLabelColor={negativeLabelColor}
					/>
				)
			} else {
				load = (
					<DistributedForceLine
						name={name}
						forceDirection={forceDirection}
						loads={loads}
						xPositions={xPositions}
						barPoints={barPoints}
						size={size}
						positiveArrowColor={positiveArrowColor}
						negativeArrowColor={negativeArrowColor}
						positiveLabelColor={positiveLabelColor}
						negativeLabelColor={negativeLabelColor}
					/>
				)
			}
			break
		case 'Mx':
		case 'My':
		case 'Mz':
			load = (
				<DistributedMoment
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					barPoints={barPoints}
					size={size}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					positiveLabelColor={positiveLabelColor}
					negativeLabelColor={negativeLabelColor}
				/>
			)
	}

	return <group>{load}</group>
}
