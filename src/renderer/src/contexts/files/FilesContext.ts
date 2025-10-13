import { createContext, useContext } from 'react'

export interface IFilesData {
	filePath: string | undefined
}

export const FilesContext = createContext({} as IFilesData)

export const useFilesContext = (): IFilesData => {
	return useContext(FilesContext)
}
