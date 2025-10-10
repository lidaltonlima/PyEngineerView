import { IStructureData } from '@renderer/types/Structure'
import { createContext, useContext } from 'react'

export interface StructureContextData {
	structure: IStructureData
}

export const StructureContext = createContext({} as StructureContextData)

export const useStructureContext = (): StructureContextData => {
	return useContext(StructureContext)
}
