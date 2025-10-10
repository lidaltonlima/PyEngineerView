/**
 * Interfaces and types for structure data
 */
export interface IStructureData {
	materials: IMaterialData[]
	sections: ISectionData[]
	nodes: INodeData[]
	bars: IBarData[]
	supports: ISupportData[]
	loads: ILoadData[]
	results: IResultsData[]
}

// Material and Section ///////////////////////////////////////////////////////////////////////////
export interface IMaterialData {
	name: string
	properties: { E: number; G: number; ni: number; rho: number }
}

export interface ISectionData {
	name: string
	area: number
	inertias: { Ix: number; Iy: number; Iz: number }
}

// Nodes //////////////////////////////////////////////////////////////////////////////////////////
export interface INodeData {
	name: string
	position: [number, number, number]
	type: 'Fixed' | 'Hinged' | 'spring' | 'blend'
}

// bars ///////////////////////////////////////////////////////////////////////////////////////////
export interface IBarData {
	name: string
	start_node: string
	end_node: string
	section: string
	material: string
	rotation: number
	releases: IReleasesData[]
}

// Releases ***************************************************************************************
export type IReleasesData =
	| 'Dxi'
	| 'Dyi'
	| 'Dzi'
	| 'Rxi'
	| 'Ryi'
	| 'Rzi'
	| 'Dxj'
	| 'Dyj'
	| 'Dzj'
	| 'Rxj'
	| 'Ryj'
	| 'Rzj'

// Supports ///////////////////////////////////////////////////////////////////////////////////////
export interface ISupportData {
	node: string
	supports: {
		Dx: number | boolean
		Dy: number | boolean
		Dz: number | boolean
		Rx: number | boolean
		Ry: number | boolean
		Rz: number | boolean
	}
}

// Loads //////////////////////////////////////////////////////////////////////////////////////////
export interface ILoadData {
	name: string
	nodes: IPointLoadsData[]
	bars: IBarLoadsData
}

// Nodal loads ************************************************************************************
export interface IPointLoadsData {
	name: string
	node: string
	loads: { Fx: number; Fy: number; Fz: number; Mx: number; My: number; Mz: number }
}

// Bar loads **************************************************************************************
export interface IBarLoadsData {
	point: IBarPointLoadsData[]
	distributed: IBarDistributedLoadsData[]
}

export interface IBarPointLoadsData {
	name: string
	bar: string
	position: number
	system: 'local' | 'global'
	loads: { Fx: number; Fy: number; Fz: number; Mx: number; My: number; Mz: number }
}

export interface IBarDistributedLoadsData {
	name: string
	bar: string
	position: [number, number] // start, end
	system: 'local' | 'global'
	loads: {
		Fx: [number, number]
		Fy: [number, number]
		Fz: [number, number]
		Mx: [number, number]
		My: [number, number]
		Mz: [number, number]
	}
}

export type forcesType = 'Fx' | 'Fy' | 'Fz' | 'Mx' | 'My' | 'Mz'

// Results ////////////////////////////////////////////////////////////////////////////////////////
export interface IResultsData {
	load_case: string
	displacements: IDisplacementResultsData[]
	reactions: IReactionsData[]
	extreme_forces: IExtremeForcesData[]
}

// Displacements **********************************************************************************
export interface IDisplacementResultsData {
	node: string
	Dx: number
	Dy: number
	Dz: number
	Rx: number
	Ry: number
	Rz: number
}

// Reactions **************************************************************************************
export interface IReactionsData {
	node: string
	Fx: number
	Fy: number
	Fz: number
	Mx: number
	My: number
	Mz: number
}

// Extreme Forces *********************************************************************************
export interface IExtremeForcesData {
	bar: string
	// Start
	Fxi: number
	Fyi: number
	Fzi: number
	Mxi: number
	Myi: number
	Mzi: number

	// End
	Fxj: number
	Fyj: number
	Fzj: number
	Mxj: number
	Myj: number
	Mzj: number
}
