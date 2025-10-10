import { useState } from 'react'
import { SelectionContext } from './SelectionContext'
import { IEntityData } from '@renderer/types/Entity'

interface ISelectionProviderProps {
	children: React.ReactNode
}

export const SelectionProvider = ({ children }: ISelectionProviderProps): React.JSX.Element => {
	const value = {
		selection: useState<IEntityData[]>([]),
		clickVoid: useState<boolean>(true)
	}

	return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
}
