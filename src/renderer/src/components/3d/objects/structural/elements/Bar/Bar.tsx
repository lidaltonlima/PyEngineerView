import { Line } from '@react-three/drei'
import { useSceneContext } from '@renderer/contexts/Scene'
import { useSelectionContext } from '@renderer/contexts/Selection/SelectionContext'
import { useStructureContext } from '@renderer/contexts/Structure'
import { click } from '@renderer/core/select'
import { IEntityData } from '@renderer/types/Entity'
import { forcesType, IBarData } from '@renderer/types/Structure'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { BarDistributedLoad, PointBarLoad } from '../../loads'
import { BarRelease } from '../../others'
import { LocalAxes } from '../../others/LocalAxes'
import { BillboardTextAxis } from '@renderer/components/3d/utils'
import { useEffect, useRef } from 'react'

const interRegularFont = new URL('/fonts/Inter-Regular.woff', import.meta.url).href

interface IBarProps {
	bar: IBarData
	labelSize?: number
	color?: string
}

export const Bar = ({ bar, labelSize = 0.1, color = 'orange' }: IBarProps): React.JSX.Element => {
	const { structure } = useStructureContext()
	const { view } = useSceneContext()
	const selectionContext = useSelectionContext()

	const groupDirectionRef = useRef<THREE.Group>(null)
	const groupRotationRef = useRef<THREE.Group>(null)

	const [viewBars] = view.bars
	const [viewPointBarLoads] = view.barPointLoads
	const [viewDistributedBarLoads] = view.barDistributedLoads
	const [viewLocalAxes] = view.barLocalAxes
	const [viewReleases] = view.barReleases
	const [viewBarLabel] = view.barLabel

	const startPoint = new THREE.Vector3()
	const endPoint = new THREE.Vector3()
	const rotation = degToRad(bar.rotation)

	for (const node of structure.nodes) {
		if (node.name == bar.start_node) {
			startPoint.set(node.position[0], node.position[1], node.position[2])
		} else if (node.name == bar.end_node) {
			endPoint.set(node.position[0], node.position[1], node.position[2])
		}
	}

	const localAxesPoint = new THREE.Vector3().subVectors(endPoint, startPoint)
	localAxesPoint.divideScalar(3)
	localAxesPoint.addVectors(localAxesPoint, startPoint)

	const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize()

	useEffect(() => {
		if (!groupDirectionRef.current) return

		// Origen of helper
		const pos = groupDirectionRef.current.position.clone()

		// Vector X local -> direction to the point
		const xDir = new THREE.Vector3().subVectors(direction, pos).normalize()

		const yDir = new THREE.Vector3()
		const zDir = new THREE.Vector3()
		const zGlobal = new THREE.Vector3(0, 0, 1)
		if (direction.x == 0 && direction.y == 0) zGlobal.set(-1, 0, 0)

		// Y local = Z_global × X
		yDir.copy(new THREE.Vector3().crossVectors(zGlobal, xDir).normalize())

		// Z local adjusted = X × Y
		zDir.copy(new THREE.Vector3().crossVectors(xDir, yDir).normalize())

		// Assemble rotation matrix
		const matrixRotation = new THREE.Matrix4()
		matrixRotation.makeBasis(xDir, yDir, zDir)

		// Apply to helper
		groupDirectionRef.current.setRotationFromMatrix(matrixRotation)

		// Rotation the helper around the axis
		const rotation = direction.equals(new THREE.Vector3(0, 0, -1))
			? degToRad(bar.rotation) + Math.PI
			: degToRad(bar.rotation)
		groupRotationRef.current?.quaternion.setFromAxisAngle(xDir, rotation)
	}, [direction, bar.rotation])

	if (!viewBars) return <></>

	return (
		<>
			<Line
				// worldUnits
				name={`bar-${bar.name}`}
				userData={{ type: 'bar', name: bar.name } as IEntityData}
				points={[startPoint, endPoint]}
				color={color}
				worldUnits={true}
				lineWidth={0.02}
				onClick={(event) =>
					click(event, event.object.userData as IEntityData, structure, selectionContext)
				}
			/>
			{viewLocalAxes && (
				<LocalAxes
					direction={direction}
					rotationAroundDirection={degToRad(bar.rotation)}
					label
					scale={0.25}
					position={localAxesPoint}
				/>
			)}
			{viewReleases && (
				<BarRelease
					releases={bar.releases}
					direction={direction}
					startPoint={startPoint}
					endPoint={endPoint}
					barRotation={rotation}
				/>
			)}
			{viewPointBarLoads && (
				<>
					{structure.loads.map((load) => {
						return load.bars.point.map((barPointLoad) => {
							if (barPointLoad.bar == bar.name)
								return (
									<PointBarLoad
										key={barPointLoad.name}
										direction={direction}
										xPosition={barPointLoad.position}
										rotationAroundDirection={rotation}
										position={startPoint}
										system={barPointLoad.system}
										fx={barPointLoad.loads.Fx}
										fy={barPointLoad.loads.Fy}
										fz={barPointLoad.loads.Fz}
										mx={barPointLoad.loads.Mx}
										my={barPointLoad.loads.My}
										mz={barPointLoad.loads.Mz}
									/>
								)
							return null
						})
					})}
				</>
			)}
			{viewDistributedBarLoads && (
				<>
					{structure.loads.map((load) => {
						return load.bars.distributed.map((barDistributedLoad) => {
							if (barDistributedLoad.bar == bar.name) {
								return Object.entries(barDistributedLoad.loads).map(([objectKey, objectValue]) => {
									const key = objectKey as forcesType
									return (
										<BarDistributedLoad
											name={barDistributedLoad.name}
											key={`${barDistributedLoad.name}-${key}-${Math.random()}`}
											forceDirection={key}
											system={barDistributedLoad.system}
											loads={objectValue}
											xPositions={barDistributedLoad.position}
											barPoints={[startPoint, endPoint]}
											direction={direction}
											rotationAroundDirection={rotation}
										/>
									)
								})
							}
							return null
						})
					})}
				</>
			)}
			{/* Objects that follow the direction and rotation of the bar*/}
			<group ref={groupRotationRef} position={localAxesPoint}>
				<group ref={groupDirectionRef}>
					{viewBarLabel && (
						<BillboardTextAxis
							axis='x'
							font={interRegularFont}
							fontSize={labelSize}
							color={color}
							anchorX='left'
							anchorY='bottom'
						>
							{bar.name}
						</BillboardTextAxis>
					)}
				</group>
			</group>
		</>
	)
}
