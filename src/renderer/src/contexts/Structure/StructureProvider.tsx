import { StructureContext } from './StructureContext'
import {
	IBarData,
	ILoadData,
	IMaterialData,
	INodeData,
	IResultsData,
	ISectionData,
	IStructureData,
	ISupportData
} from '@renderer/types/Structure'

interface IStructureProviderProps {
	children: React.ReactNode
}

export const StructureProvider = ({ children }: IStructureProviderProps): React.JSX.Element => {
	const materials: IMaterialData[] = []
	const sections: ISectionData[] = []
	const nodes: INodeData[] = []
	const bars: IBarData[] = []
	const supports: ISupportData[] = []
	const loads: ILoadData[] = []
	const results: IResultsData[] = []
	const structure: IStructureData = { materials, sections, nodes, bars, supports, loads, results }

	return (
		<StructureContext.Provider
			value={{
				structure: structure
			}}
		>
			{children}
		</StructureContext.Provider>
	)
}
