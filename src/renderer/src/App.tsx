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

export const App = (): React.JSX.Element => {
	const { structure } = useStructureContext()
	const { view } = useSceneContext()

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
				window.alert('Error opening Excel file. Check if it was using the template')
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

		const disposeExcelFile = window.electron.ipcRenderer.on('open-excel-file', (_event, result) => {
			if (result.canceled) return
			openExcel(result.filePaths[0])
			// Set footer text
			setFooterText(
				'No results available. Calculate this structure or open a calculation structure.'
			)
		})

		const disposeCalculateStructure = window.electron.ipcRenderer.on(
			'calculate-structure',
			async () => {
				console.log('Calculating structure...')
				try {
					const response = await fetch(`${baseURL}/calculate-structure`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						}
						// body: JSON.stringify({ path })
					})

					if (!response.ok) {
						throw new Error('Error in network response')
					}
				} catch (error) {
					console.error('Error connecting to backend:', error)
				}
			}
		)

		return () => {
			disposeOpenJsonFile()
			disposeExcelFile()
			disposeCalculateStructure()
		}
	}, [structure, baseURL])

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
					<Accordion title='Results' className='accordion'>
						<Results />
					</Accordion>
				</ResizableContainer>
			</main>
			<footer>{footerText}</footer>
		</>
	)
}
