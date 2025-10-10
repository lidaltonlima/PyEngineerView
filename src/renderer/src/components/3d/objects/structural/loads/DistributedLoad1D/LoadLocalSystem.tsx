/**
 * Distributed Load in bars with local system
 */
import { forcesType } from '@renderer/types/Structure'
import React from 'react'
import { Vector3 } from 'three'
import { DistributedForce } from './loadsStyle'
import { DistributedForceLine } from './loadsStyle/DistributedForceLine'
import { DistributedMoment } from './loadsStyle/DistributedMoment'

interface ILoadLocalSystemProps {
	name: string
	forceDirection?: forcesType
	loads: [number, number]
	xPositions: [number, number]
	barPoints: [Vector3, Vector3]

	size: number

	positiveArrowColor: string
	negativeArrowColor: string
	positiveLabelColor: string
	negativeLabelColor: string
}

export const LoadLocalSystem = ({
	name,
	forceDirection,
	loads,
	xPositions,
	size,
	barPoints,
	positiveArrowColor,
	negativeArrowColor,
	positiveLabelColor,
	negativeLabelColor
}: ILoadLocalSystemProps): React.JSX.Element => {
	return (
		<>
			{/* Forces ///////////////////////////////////////////////////////////////////////////////*/}
			{forceDirection === 'Fx' && (
				<DistributedForce
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					barPoints={barPoints}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					positiveLabelColor={positiveLabelColor}
					negativeLabelColor={negativeLabelColor}
					size={size}
				/>
			)}
			{(forceDirection === 'Fy' || forceDirection === 'Fz') && (
				<DistributedForceLine
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					barPoints={barPoints}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					positiveLabelColor={positiveLabelColor}
					negativeLabelColor={negativeLabelColor}
					size={size}
				/>
			)}
			{/* Moments //////////////////////////////////////////////////////////////////////////////*/}
			{(forceDirection === 'Mx' || forceDirection === 'My' || forceDirection === 'Mz') && (
				<DistributedMoment
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					barPoints={barPoints}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					positiveLabelColor={positiveLabelColor}
					negativeLabelColor={negativeLabelColor}
					size={size}
				/>
			)}
		</>
	)
}
