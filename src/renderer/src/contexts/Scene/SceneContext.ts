import { SceneViewOptions } from '@renderer/types/Scene'
import { createContext, useContext } from 'react'

export interface ISceneContextData {
	view: SceneViewOptions
}

export const SceneContext = createContext({} as ISceneContextData)

export const useSceneContext = (): ISceneContextData => {
	return useContext(SceneContext)
}
