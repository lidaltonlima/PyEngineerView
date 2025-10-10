import { useSceneContext } from '@renderer/contexts/Scene'
import styles from './ViewEntities.module.scss'

export const ViewEntities = (): React.JSX.Element => {
	const { view } = useSceneContext()
	const [viewNodes, setViewNodes] = view.nodes
	const [viewNodalLoads, setViewNodalLoads] = view.nodalLoads
	const [viewNodeLabel, setViewNodeLabel] = view.nodesLabel
	const [viewBars, setViewBars] = view.bars
	const [viewPointBarLoads, setViewPointBarLoads] = view.barPointLoads
	const [viewDistributedBarLoads, setViewDistributedBarLoads] = view.barDistributedLoads
	const [viewLocalAxes, setViewLocalAxes] = view.barLocalAxes
	const [viewReleases, setViewReleases] = view.barReleases
	const [viewBarLabel, setViewBarLabel] = view.barLabel
	const [viewSupports, setViewSupports] = view.supports

	return (
		<div className={styles.main}>
			<form>
				<fieldset>
					<legend>Elements</legend>
					<fieldset>
						<legend>Nodes</legend>
						<input
							type='checkbox'
							name='viewNodes'
							id='viewNodes'
							checked={viewNodes}
							onChange={(event) => setViewNodes(event.target.checked)}
						/>
						<label htmlFor='viewNodes'>Nodes</label> <br />
						<input
							type='checkbox'
							name='nodalLoads'
							id='nodalLoads'
							checked={viewNodalLoads}
							onChange={(event) => setViewNodalLoads(event.target.checked)}
						/>
						<label htmlFor='nodalLoads'>Nodal Loads</label> <br />
						<input
							type='checkbox'
							name='nodeLabel'
							id='nodeLabel'
							checked={viewNodeLabel}
							onChange={(event) => setViewNodeLabel(event.target.checked)}
						/>
						<label htmlFor='nodeLabel'>Node Labels</label> <br />
					</fieldset>
					<fieldset>
						<legend>Bars</legend>
						<input
							type='checkbox'
							name='viewBars'
							id='viewBars'
							checked={viewBars}
							onChange={(event) => setViewBars(event.target.checked)}
						/>
						<label htmlFor='viewBars'>Bars</label> <br />
						<input
							type='checkbox'
							name='pointBarLoads'
							id='pointBarLoads'
							checked={viewPointBarLoads}
							onChange={(event) => setViewPointBarLoads(event.target.checked)}
						/>
						<label htmlFor='pointBarLoads'>Point Loads</label> <br />
						<input
							type='checkbox'
							name='viewDistributedBarLoads'
							id='viewDistributedBarLoads'
							checked={viewDistributedBarLoads}
							onChange={(event) => setViewDistributedBarLoads(event.target.checked)}
						/>
						<label htmlFor='viewDistributedBarLoads'>Distributed Loads</label> <br />
						<input
							type='checkbox'
							name='viewLocalAxes'
							id='viewLocalAxes'
							checked={viewLocalAxes}
							onChange={(event) => setViewLocalAxes(event.target.checked)}
						/>
						<label htmlFor='viewLocalAxes'>Local Axes</label> <br />
						<input
							type='checkbox'
							name='viewReleases'
							id='viewReleases'
							checked={viewReleases}
							onChange={(event) => setViewReleases(event.target.checked)}
						/>
						<label htmlFor='viewReleases'>Releases</label> <br />
						<input
							type='checkbox'
							name='viewBarLabel'
							id='viewBarLabel'
							checked={viewBarLabel}
							onChange={(event) => setViewBarLabel(event.target.checked)}
						/>
						<label htmlFor='viewBarLabel'>Bar Labels</label> <br />
					</fieldset>
					<input
						type='checkbox'
						name='viewSupports'
						id='viewSupports'
						checked={viewSupports}
						onChange={(event) => setViewSupports(event.target.checked)}
					/>
					<label htmlFor='viewSupports'>Supports</label> <br />
				</fieldset>
			</form>
		</div>
	)
}
