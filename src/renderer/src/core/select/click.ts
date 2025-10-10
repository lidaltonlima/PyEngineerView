import { ThreeEvent } from '@react-three/fiber'
import { ISelectionContextData } from '@renderer/contexts/Selection'
import { IEntityData } from '@renderer/types/Entity'
import { IStructureData } from '@renderer/types/Structure'

export const click = (
	event: ThreeEvent<MouseEvent>,
	userData: IEntityData,
	structureData: IStructureData,
	selectionContext: ISelectionContextData
): void => {
	const setSelectionList = selectionContext.selection[1]
	setSelectionList([userData])

	event.stopPropagation()
	if (!structureData.results) {
		window.alert('No results available. Please open a calculated structure.')
		return
	}
}
