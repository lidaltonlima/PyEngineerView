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

	///////////////////////////////////////////////////////////////
	const [baseURL, setBaseURL] = useState<string>('')

	useEffect(() => {
		window.electron.ipcRenderer.send('finish-load')
		window.electron.ipcRenderer.on('backend-port', (_, appURL) => {
			setBaseURL(appURL)
		})
	}, [])

	const [a, setA] = useState('')
	const [b, setB] = useState('')
	const [resultado, setResultado] = useState<number | null>(null)

	const somar = async (): Promise<void> => {
		console.log(baseURL)
		try {
			const response = await fetch(`${baseURL}/somar`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ a, b })
			})

			if (!response.ok) {
				throw new Error('Error in network response')
			}

			const data = await response.json()
			setResultado(data.resultado)
		} catch (error) {
			console.error('Error connecting to backend:', error)
		}
	}
	///////////////////////////////////

	useEffect(() => {
		const disposeOpenFile = window.electron.ipcRenderer.on(
			'open-file',
			(_event, data: IStructureData) => {
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

		return () => {
			disposeOpenFile()
		}
	}, [structure])

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
					<div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
						<h1>Soma com FastAPI</h1>
						<input
							style={{ color: 'black' }}
							type='number'
							value={a}
							onChange={(e) => setA(e.target.value)}
							placeholder='Número A'
						/>
						<input
							style={{ color: 'black' }}
							type='number'
							value={b}
							onChange={(e) => setB(e.target.value)}
							placeholder='Número B'
						/>
						<button style={{ color: 'black' }} onClick={somar}>
							Somar
						</button>
						{resultado !== null && <p>Resultado: {resultado}</p>}
					</div>
				</ResizableContainer>
			</main>
			<footer>{footerText}</footer>
		</>
	)
}
