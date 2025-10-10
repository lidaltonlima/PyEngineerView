import { useState } from 'react'
import { SceneContext } from './SceneContext'

interface ISceneProviderProps {
	children: React.ReactNode
}

export const SceneProvider = ({ children }: ISceneProviderProps): React.JSX.Element => {
	const view = {
		// Elements
		nodes: useState(true),
		nodesLabel: useState(true),
		nodalLoads: useState(true),
		bars: useState(true),
		barDistributedLoads: useState(true),
		barPointLoads: useState(true),
		barLocalAxes: useState(true),
		barReleases: useState(true),
		barLabel: useState(true),
		supports: useState(true)
	}

	return <SceneContext.Provider value={{ view }}>{children}</SceneContext.Provider>
}
