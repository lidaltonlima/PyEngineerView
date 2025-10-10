/**
 * Node component representing a structural node with loads if applicable
 */
import { Billboard, Point, Points, Text } from '@react-three/drei'
import { useStructureContext } from '@renderer/contexts/Structure'
import { INodeData } from '@renderer/types/Structure'
import { Vector3 } from 'three'
import { PointLoad } from '../../loads'
import { useSceneContext } from '@renderer/contexts/Scene'
import { click } from '@renderer/core/select'
import { IEntityData } from '@renderer/types/Entity'
import { useSelectionContext } from '@renderer/contexts/Selection/SelectionContext'

const interRegularFont = new URL('/fonts/Inter-Regular.woff', import.meta.url).href

interface INodeProps {
	node: INodeData
	color?: string
	size?: number
	labelSize?: number

	label?: boolean
}

export const Node = ({
	node,
	color = 'cyan',
	size = 0.1,
	labelSize = 0.1,
	label = false
}: INodeProps): React.JSX.Element => {
	const { structure } = useStructureContext()
	const selectionContext = useSelectionContext()

	const { view } = useSceneContext()
	const [viewNodes] = view.nodes
	const [viewNodalLoads] = view.nodalLoads
	const [viewNodeLabel] = view.nodesLabel

	const position = new Vector3(node.position[0], node.position[1], node.position[2])
	const labelPosition = new Vector3(size / 4, size / 4, 0).add(
		new Vector3(-labelSize / 10.5, -labelSize / 4.1, 0)
	)

	if (!viewNodes) return <></>

	return (
		<>
			<>
				<Points key={node.name} limit={1} range={1}>
					<pointsMaterial vertexColors size={size} />
					<Point
						name={`node-${node.name}`}
						userData={{ type: 'node', name: node.name } as IEntityData}
						position={position}
						color={color}
						onClick={(event) =>
							click(event, event.object.userData as IEntityData, structure, selectionContext)
						}
					/>
				</Points>
				{viewNodalLoads &&
					structure?.loads.map((load) => {
						const nodalLoad = load.nodes.find((nodalLoad) => nodalLoad.node === node.name)
						return (
							nodalLoad && (
								<PointLoad
									key={`${load.name}-${nodalLoad.name}`}
									label
									position={structure?.nodes.find((node) => node.name === nodalLoad.node)?.position}
									fx={nodalLoad.loads.Fx}
									fy={nodalLoad.loads.Fy}
									fz={nodalLoad.loads.Fz}
									mx={nodalLoad.loads.Mx}
									my={nodalLoad.loads.My}
									mz={nodalLoad.loads.Mz}
								/>
							)
						)
					})}
				{label && viewNodeLabel && (
					<Billboard position={position}>
						<Text
							fontSize={labelSize}
							font={interRegularFont}
							position={labelPosition}
							anchorX={'left'}
							anchorY={'bottom'}
						>
							{node.name}
							<meshBasicMaterial depthTest={false} color={color} />
						</Text>
					</Billboard>
				)}
			</>
		</>
	)
}
