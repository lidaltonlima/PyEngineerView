/**
 * Distributed Load in bars
 */
import { forcesType } from '@renderer/types/Structure'
import React from 'react'
import { LoadLocalSystem } from './LoadLocalSystem'
import { LoadGlobalSystem } from './LoadGlobalSystem'
import { Vector3 } from 'three'

interface IDistributedLoad1DCustomProps {
	name: string
	forceDirection: forcesType
	system: 'local' | 'global'
	loads: [number, number]
	xPositions: [number, number]
	barPoints: [Vector3, Vector3]

	size?: number
	positiveArrowColor?: string
	negativeArrowColor?: string
	positiveLabelColor?: string
	negativeLabelColor?: string
}

type IDistributedLoad1DProps = IDistributedLoad1DCustomProps & React.JSX.IntrinsicElements['group']

export const DistributedLoad1D = ({
	name,
	forceDirection,
	system,
	loads,
	xPositions,
	barPoints,
	size = 1,
	positiveArrowColor = 'cyan',
	negativeArrowColor = 'magenta',
	positiveLabelColor = 'cyan',
	negativeLabelColor = 'magenta',
	...props
}: IDistributedLoad1DProps): React.JSX.Element => {
	if (loads[0] === 0 && loads[1] === 0) return <></>

	return (
		<group {...props}>
			{system === 'local' ? (
				<LoadLocalSystem
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					barPoints={[new Vector3(0, 0, 0), new Vector3(1, 0, 0)]}
					size={size}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					positiveLabelColor={positiveLabelColor}
					negativeLabelColor={negativeLabelColor}
				/>
			) : (
				<LoadGlobalSystem
					name={name}
					forceDirection={forceDirection}
					loads={loads}
					xPositions={xPositions}
					size={size}
					positiveArrowColor={positiveArrowColor}
					negativeArrowColor={negativeArrowColor}
					positiveLabelColor={positiveLabelColor}
					negativeLabelColor={negativeLabelColor}
					barPoints={barPoints}
				/>
			)}
		</group>
	)
}
