import { Dispatch, SetStateAction } from 'react'

/**
 * Interfaces and types for the scene context
 */
export type SceneViewOptions = {
	nodes: [boolean, Dispatch<SetStateAction<boolean>>]
	nodesLabel: [boolean, Dispatch<SetStateAction<boolean>>]
	nodalLoads: [boolean, Dispatch<SetStateAction<boolean>>]
	bars: [boolean, Dispatch<SetStateAction<boolean>>]
	barPointLoads: [boolean, Dispatch<SetStateAction<boolean>>]
	barDistributedLoads: [boolean, Dispatch<SetStateAction<boolean>>]
	barLocalAxes: [boolean, Dispatch<SetStateAction<boolean>>]
	barReleases: [boolean, Dispatch<SetStateAction<boolean>>]
	barLabel: [boolean, Dispatch<SetStateAction<boolean>>]
	supports: [boolean, Dispatch<SetStateAction<boolean>>]
}
