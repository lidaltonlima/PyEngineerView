import { selectionType } from '@renderer/types/Select'
import { createContext, Dispatch, SetStateAction, useContext } from 'react'

export interface ISelectionContextData {
	selection: selectionType
	clickVoid: [boolean, Dispatch<SetStateAction<boolean>>]
}

export const SelectionContext = createContext({} as ISelectionContextData)

export const useSelectionContext = (): ISelectionContextData => {
	return useContext(SelectionContext)
}
