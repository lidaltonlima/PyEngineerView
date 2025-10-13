import { useEffect, useState } from 'react'
import { Default3dScene } from './components/3d'
import { Bar, Node, Support } from './components/3d/objects/structural/elements'
import { ClickVoid } from './components/3d/utils'
import { ResizableContainer } from './containers'
import { Accordion } from './containers/Accordion'
import { Results, ViewEntities } from './contents'
import { useSceneContext } from './contexts/Scene'
import { useStructureContext } from './contexts/Structure'
import { IStructureData } from './types/Structure'
import { useFilesContext } from './contexts/files/FilesContext'

export const App = (): React.JSX.Element => {
	const { structure } = useStructureContext()
	const { view } = useSceneContext()
	const files = useFilesContext()

	const [structureData, setStructureData] = useState<IStructureData | null>()
	const [footerText, setFooterText] = useState('Open a structure')

	const [viewSupports] = view.supports

	// Get backend URL //////////////////////////////////////////////////////////////////////////////
	const [baseURL, setBaseURL] = useState<string>('')
	useEffect(() => {
		window.electron.ipcRenderer.send('finish-load')
		window.electron.ipcRenderer.on('backend-port', (_, appURL) => {
			setBaseURL(appURL)
		})
	}, [])

	// IPC listeners //////////////////////////////////////////////////////////////////////////////
	useEffect(() => {
		const openExcel = async (path: string): Promise<void> => {
			try {
				const response = await fetch(`${baseURL}/open_excel`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ path })
				})

				if (!response.ok) {
					throw new Error('Error in network response')
				}

				// Update structure data
				const data = await response.json()
				setStructureData(data)
				structure.nodes = data.nodes
				structure.bars = data.bars
				structure.supports = data.supports
				structure.loads = data.loads
				structure.materials = data.materials
				structure.sections = data.sections
				structure.results = data.results
			} catch (error) {
				window.dialogAPI.showError(
					'Error opening Excel file',
					`Check if it was using the template.\n
					The template is available in the folder of installation.\n
					The path is templates/excel_template.xlsx`
				)
				console.error('Error connecting to backend:', error)
			}
		}

		const disposeOpenJsonFile = window.electron.ipcRenderer.on(
			'open-json-file',
			(_event, data: IStructureData) => {
				// Update structure data
				setStructureData(data)
				structure.nodes = data.nodes
				structure.bars = data.bars
				structure.supports = data.supports
				structure.loads = data.loads
				structure.materials = data.materials
				structure.sections = data.sections
				structure.results = data.results

				// Set footer text
				if (data.results) setFooterText('Click in a object for view results.')
				else setFooterText('No results available. Open a calculation structure.')
			}
		)

		const disposeOpenExcelFile = window.electron.ipcRenderer.on(
			'open-excel-file',
			(_event, result) => {
				if (result.canceled) return
				openExcel(result.filePaths[0])
				// Set footer text
				setFooterText(
					'No results available. Calculate this structure or open a calculation structure.'
				)
			}
		)

		const disposeCalculateStructure = window.electron.ipcRenderer.on(
			'calculate-structure',
			async () => {
				try {
					const response = await fetch(`${baseURL}/calculate_structure`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							materials: structure.materials,
							sections: structure.sections,
							nodes: structure.nodes,
							bars: structure.bars,
							supports: structure.supports,
							loads: structure.loads
						})
					})

					if (!response.ok) {
						try {
							const errorData = await response.json()
							window.dialogAPI.showError('Calculation error', errorData.message)
						} catch {
							window.dialogAPI.showError('Calculation error', 'Unknown error')
						}
						return
					}

					const data = await response.json()
					structure.results = data
					setStructureData({ ...structure, results: data })
					setFooterText('Click in a object for view results.')
					window.dialogAPI.showInfo(
						'Calculation finished',
						`The calculation was finished!
						click in a object for view results.`
					)
				} catch (error) {
					console.error('Error connecting to backend:', error)
				}
			}
		)

		const disposeSaveFile = window.electron.ipcRenderer.on('save-file', async () => {
			window.filesAPI
				.saveFile(structure, files.filePath)
				.then((result: { success: boolean; canceled?: boolean; error?: Error }) => {
					if (result.success && !result.canceled) {
						window.dialogAPI.showInfo('File saved', 'The structure was saved successfully.')
					} else if (!result.success) {
						window.dialogAPI.showError(
							'Error saving file',
							result?.error?.message || 'Unknown error'
						)
					}
				})
		})

		const disposeSaveAsFile = window.electron.ipcRenderer.on('save-as-file', () => {
			window.filesAPI.saveAsFile(structure).then((result) => {
				if (result.success && !result.canceled) {
					window.dialogAPI.showInfo('File saved', 'The structure was saved successfully.')
				} else if (!result.success) {
					window.dialogAPI.showError('Error saving file', result?.error?.message || 'Unknown error')
				}
			})
		})

		const disposeSetOpenFilePath = window.electron.ipcRenderer.on(
			'set-open-file-path',
			(_event, path: string) => {
				files.filePath = path
			}
		)

		return () => {
			disposeOpenJsonFile()
			disposeOpenExcelFile()
			disposeCalculateStructure()
			disposeSaveFile()
			disposeSaveAsFile()
			disposeSetOpenFilePath()
		}
	}, [structure, baseURL, files])

	return (
		<>
			<main>
				<div className='canvas-container'>
					<div className='canvas-content'>
						<Default3dScene>
							{structureData?.bars.map((bar) => <Bar key={bar.name} bar={bar} />)}
							{structureData?.nodes.map((node) => <Node key={node.name} node={node} label />)}
							{viewSupports &&
								structureData?.supports.map((support) => (
									<Support key={support.node} support={support} structure={structureData} />
								))}
							<axesHelper />
							<ClickVoid />
						</Default3dScene>
					</div>
				</div>
				<ResizableContainer
					className='aside'
					initialWidth={250}
					minWidth={250}
					maxWidth={500}
					resizeLeft
					fullHeight
				>
					<Accordion title='View' className='accordion'>
						<ViewEntities />
					</Accordion>
					<Accordion title='Results' className='accordion' open>
						<Results />
					</Accordion>
				</ResizableContainer>
			</main>
			<footer>{footerText}</footer>
		</>
	)
}
