import { IStructureData, ISupportData } from '@renderer/types/Structure'
import { FixedAll } from './FixedAll'
import { FixedAllDisplacement } from './FixedAllDisplacement'
import { FixedDisplacement } from './FixedDisplacement'
import { FixedRotation } from './FixedRotation'
import { SpringDisplacement } from './SpringDisplacement'
import { SpringRotation } from './SpringRotation'
import { IEntityData } from '@renderer/types/Entity'
import { click } from '@renderer/core/select'
import { useSelectionContext } from '@renderer/contexts/Selection/SelectionContext'

interface ISupportProps {
	support: ISupportData
	structure: IStructureData
}

export const Support = ({ support, structure }: ISupportProps): React.JSX.Element => {
	const selectionContext = useSelectionContext()

	let basePoint: [number, number, number] = [0, 0, 0]
	let isError = true
	let isFixedAllDisplacement = false

	if (structure) {
		for (const node of structure.nodes) {
			if (node.name === support.node) {
				basePoint = node.position
				isError = false
				break
			}
		}
		if (isError) throw new Error('O nó do apoio não existe.')
	}

	const drawings: React.JSX.Element[] = []

	if (
		!Object.values(support.supports).some((value) => value === false) &&
		!Object.values(support.supports).some((value) => typeof value === 'number')
	) {
		drawings.push(<FixedAll key={'DrawSupport-fixedAll'} position={basePoint} />)
		return (
			<group
				key={`support-${support.node}`}
				name={`support-${support.node}`}
				userData={{ type: 'support', name: support.node } as IEntityData}
				onClick={(event) =>
					click(event, event.eventObject.userData as IEntityData, structure, selectionContext)
				}
			>
				{drawings}
			</group>
		)
	}

	if (
		typeof support.supports.Dx === 'boolean' &&
		typeof support.supports.Dy === 'boolean' &&
		typeof support.supports.Dz === 'boolean' &&
		support.supports.Dx &&
		support.supports.Dy &&
		support.supports.Dz
	) {
		drawings.push(
			<FixedAllDisplacement key={'DrawSupport-OnlyDisplacement'} position={basePoint} />
		)
		isFixedAllDisplacement = true
	}

	for (const [key, value] of Object.entries(support.supports)) {
		if (key === 'Dx' && !isFixedAllDisplacement) {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Dx'
						color='red'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						label
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Dx'
						color='red'
					/>
				)
			}
		} else if (key === 'Dy' && !isFixedAllDisplacement) {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Dy'
						color='green'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						label
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Dy'
						color='green'
					/>
				)
			}
		} else if (key === 'Dz' && !isFixedAllDisplacement) {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedDisplacement
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Dz'
						color='blue'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringDisplacement
						label
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Dz'
						color='blue'
					/>
				)
			}
		} else if (key === 'Rx') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Rx'
						color='red'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Rx'
						color='red'
					/>
				)
			}
		} else if (key === 'Ry') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Ry'
						color='green'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Ry'
						color='green'
					/>
				)
			}
		} else if (key === 'Rz') {
			if (typeof value === 'boolean' && value) {
				drawings.push(
					<FixedRotation
						key={`${support.node}${key}`}
						position={basePoint}
						direction='Rz'
						color='blue'
					/>
				)
			} else if (typeof value === 'number') {
				drawings.push(
					<SpringRotation
						key={`${support.node}${key}`}
						value={value}
						position={basePoint}
						direction='Rz'
						color='blue'
					/>
				)
			}
		}
	}

	return (
		<group
			key={`support-${support.node}`}
			name={`support-${support.node}`}
			userData={{ type: 'support', name: support.node } as IEntityData}
			onClick={(event) =>
				click(event, event.eventObject.userData as IEntityData, structure, selectionContext)
			}
		>
			{drawings}
		</group>
	)
}
