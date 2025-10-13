import { FilesContext } from './FilesContext'

interface IFilesProviderProps {
	children: React.ReactNode
}

export const FilesProvider = ({ children }: IFilesProviderProps): React.JSX.Element => {
	const filePath: string | undefined = undefined

	return <FilesContext.Provider value={{ filePath }}>{children}</FilesContext.Provider>
}
