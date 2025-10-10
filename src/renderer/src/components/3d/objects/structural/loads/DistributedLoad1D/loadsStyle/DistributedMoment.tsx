import { isClose, linSpace } from '@renderer/utils/functions/others'
import * as space2D from '@renderer/utils/functions/space2d'
import { Vector3 } from 'three'
import * as matrix from '@renderer/utils/functions/matrix'
import { Moment } from '../../PointLoad/Moment'

interface IDistributedMomentProps {
	name: string
	forceDirection: 'Mx' | 'My' | 'Mz'
	loads: [number, number]
	xPositions: [number, number]
	barPoints: [Vector3, Vector3]

	size?: number
	positiveLabelColor?: string
	negativeLabelColor?: string
	positiveArrowColor?: string
	negativeArrowColor?: string
}

export const DistributedMoment = ({
	name,
	forceDirection,
	loads,
	xPositions,
	barPoints,
	size = 1,
	positiveArrowColor = 'green',
	negativeArrowColor = 'red',
	positiveLabelColor = 'cyan',
	negativeLabelColor = 'magenta'
}: IDistributedMomentProps): React.JSX.Element => {
	const rotationMatrix = matrix.createRotationMatrix(barPoints)

	const globalXPositions: [number, number] = [
		matrix.multiply(rotationMatrix, [[xPositions[0]], [0], [0]])[0][0],
		matrix.multiply(rotationMatrix, [[xPositions[1]], [0], [0]])[0][0]
	]
	const globalYPositions: [number, number] = [
		matrix.multiply(rotationMatrix, [[0], [xPositions[0]], [0]])[0][0],
		matrix.multiply(rotationMatrix, [[0], [xPositions[1]], [0]])[0][0]
	]
	const globalZPositions: [number, number] = [
		matrix.multiply(rotationMatrix, [[0], [0], [xPositions[0]]])[0][0],
		matrix.multiply(rotationMatrix, [[0], [0], [xPositions[1]]])[0][0]
	]
	const globalPositions =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? globalZPositions
				: globalYPositions
			: globalXPositions
	let numberOfArrows = Math.ceil(Math.abs(xPositions[1] - xPositions[0]) / 0.3 / 2)
	numberOfArrows = Math.max(numberOfArrows % 2 === 0 ? numberOfArrows - 1 : numberOfArrows, 3)
	const scaleToHeight = size / Math.max(Math.abs(loads[0]), Math.abs(loads[1]))
	const xPositionsOfArrows = linSpace(globalPositions[0], globalPositions[1], numberOfArrows)
	const y = [loads[0] * scaleToHeight, loads[1] * scaleToHeight]
	const x = globalPositions
	const linearFunctionLoad = space2D.createLinearFunction([x[0], y[0]], [x[1], y[1]])
	const linearFunctionBarXY =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.createLinearFunction(
						[barPoints[0].z, barPoints[0].x],
						[barPoints[1].z, barPoints[1].x]
					)
				: space2D.createLinearFunction(
						[barPoints[0].y, barPoints[0].x],
						[barPoints[1].y, barPoints[1].x]
					)
			: space2D.createLinearFunction(
					[barPoints[0].x, barPoints[0].y],
					[barPoints[1].x, barPoints[1].y]
				)
	const parametersLinearBarXY =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.parametersOfLinearFunction(
						[barPoints[0].z, barPoints[0].x],
						[barPoints[1].z, barPoints[1].x]
					)
				: space2D.parametersOfLinearFunction(
						[barPoints[0].y, barPoints[0].x],
						[barPoints[1].y, barPoints[1].x]
					)
			: space2D.parametersOfLinearFunction(
					[barPoints[0].x, barPoints[0].y],
					[barPoints[1].x, barPoints[1].y]
				)
	const linearFunctionBarXZ =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.createLinearFunction(
						[barPoints[0].z, barPoints[0].y],
						[barPoints[1].z, barPoints[1].y]
					)
				: space2D.createLinearFunction(
						[barPoints[0].y, barPoints[0].z],
						[barPoints[1].y, barPoints[1].z]
					)
			: space2D.createLinearFunction(
					[barPoints[0].x, barPoints[0].z],
					[barPoints[1].x, barPoints[1].z]
				)
	const parametersLinearBarXZ =
		barPoints[0].x === barPoints[1].x
			? barPoints[0].y === barPoints[1].y
				? space2D.parametersOfLinearFunction(
						[barPoints[0].z, barPoints[0].y],
						[barPoints[1].z, barPoints[1].y]
					)
				: space2D.parametersOfLinearFunction(
						[barPoints[0].y, barPoints[0].z],
						[barPoints[1].y, barPoints[1].z]
					)
			: space2D.parametersOfLinearFunction(
					[barPoints[0].x, barPoints[0].z],
					[barPoints[1].x, barPoints[1].z]
				)
	let positiveDirection: 'x' | 'y' | 'z' = 'x'
	let negativeDirection: '-x' | '-y' | '-z' = '-x'
	switch (forceDirection) {
		case 'Mx':
			positiveDirection = 'x'
			negativeDirection = '-x'
			break
		case 'My':
			positiveDirection = 'y'
			negativeDirection = '-y'
			break
		case 'Mz':
			positiveDirection = 'z'
			negativeDirection = '-z'
			break
	}

	let ArcArrows: React.JSX.Element = <></>
	if (barPoints[0].x === barPoints[1].x) {
		if (barPoints[0].y === barPoints[1].y) {
			ArcArrows = (
				<>
					{xPositionsOfArrows.map((xPos) => {
						const yPos = linearFunctionLoad(xPos)
						let direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z' =
							yPos < 0 ? negativeDirection : positiveDirection
						if (isClose(yPos, 0))
							if (Math.abs(loads[0]) >= Math.abs(loads[1]))
								direction = loads[0] < 0 ? negativeDirection : positiveDirection
							else direction = loads[1] < 0 ? negativeDirection : positiveDirection
						return (
							<group key={`${name}-Fx-${xPos}`}>
								{!isClose(yPos, 0) && (
									<Moment
										value={xPositionsOfArrows[0] === xPos ? loads[0] : loads[1]}
										direction={yPos >= 0 ? positiveDirection : negativeDirection}
										position={[0, 0, xPos + linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b]}
										radius={(Math.abs(yPos) + 0.1) * 0.3}
										scale={(Math.abs(yPos) + 0.1) * 0.3}
										arrowColor={yPos < 0 ? negativeArrowColor : positiveArrowColor}
										labelColor={yPos < 0 ? negativeLabelColor : positiveLabelColor}
										label={
											xPositionsOfArrows[0] === xPos ||
											xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos
										}
									/>
								)}
								{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
								isClose(yPos, 0) ? (
									<>
										<Moment
											value={0}
											direction={loads[0] < 0 ? negativeDirection : positiveDirection}
											position={[
												0,
												0,
												xPos -
													0.01 -
													(loads[0] < 0 ? 0.05 : 0) +
													linearFunctionBarXZ(xPos) -
													parametersLinearBarXZ.b
											]}
											radius={0.1 * 0.3}
											scale={0.1 * 0.3}
											arrowColor={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
										/>
										<Moment
											value={0}
											direction={loads[0] < 0 ? positiveDirection : negativeDirection}
											position={[
												0,
												0,
												xPos +
													0.01 +
													(loads[0] < 0 ? 0.05 : 0) +
													linearFunctionBarXZ(xPos) -
													parametersLinearBarXZ.b
											]}
											radius={0.1 * 0.3}
											scale={0.1 * 0.3}
											arrowColor={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
										/>
									</>
								) : isClose(yPos, 0) ? (
									<Moment
										value={0}
										direction={direction}
										position={[0, 0, xPos + linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b]}
										radius={(Math.abs(yPos) + 0.1) * 0.3}
										scale={(Math.abs(yPos) + 0.1) * 0.3}
										arrowColor={
											direction === negativeDirection ? negativeArrowColor : positiveArrowColor
										}
										labelColor={
											direction === negativeDirection ? negativeLabelColor : positiveLabelColor
										}
										label
									/>
								) : null}
							</group>
						)
					})}
				</>
			)
		} else {
			ArcArrows = (
				<>
					{xPositionsOfArrows.map((xPos) => {
						const yPos = linearFunctionLoad(xPos)
						let direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z' =
							yPos < 0 ? negativeDirection : positiveDirection
						if (isClose(yPos, 0))
							if (Math.abs(loads[0]) >= Math.abs(loads[1]))
								direction = loads[0] < 0 ? negativeDirection : positiveDirection
							else direction = loads[1] < 0 ? negativeDirection : positiveDirection
						return (
							<group key={`${name}-Fx-${xPos}`}>
								{!isClose(yPos, 0) && (
									<Moment
										direction={yPos >= 0 ? positiveDirection : negativeDirection}
										position={[
											0,
											xPos + linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
											linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
										]}
										value={xPositionsOfArrows[0] === xPos ? loads[0] : loads[1]}
										radius={(Math.abs(yPos) + 0.1) * 0.3}
										scale={(Math.abs(yPos) + 0.1) * 0.3}
										arrowColor={yPos < 0 ? negativeArrowColor : positiveArrowColor}
										labelColor={yPos < 0 ? negativeLabelColor : positiveLabelColor}
										label={
											xPositionsOfArrows[0] === xPos ||
											xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos
										}
									/>
								)}
								{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
								isClose(yPos, 0) ? (
									<>
										<Moment
											value={0}
											direction={loads[0] < 0 ? negativeDirection : positiveDirection}
											position={[
												0,
												xPos - 0.03,
												linearFunctionBarXZ(xPos - 0.03) - parametersLinearBarXZ.b
											]}
											scale={0.1 * 0.3}
											radius={0.1 * 0.3}
											arrowColor={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
										/>
										<Moment
											value={0}
											direction={loads[0] < 0 ? positiveDirection : negativeDirection}
											position={[
												0,
												xPos + 0.03,
												linearFunctionBarXZ(xPos + 0.03) - parametersLinearBarXZ.b
											]}
											radius={0.1 * 0.3}
											scale={0.1 * 0.3}
											arrowColor={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
										/>
									</>
								) : isClose(yPos, 0) ? (
									<Moment
										value={0}
										direction={direction}
										position={[0, xPos, linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b]}
										radius={0.1 * 0.3}
										scale={0.1 * 0.3}
										arrowColor={
											direction === negativeDirection ? negativeArrowColor : positiveArrowColor
										}
										labelColor={
											direction === negativeDirection ? negativeLabelColor : positiveLabelColor
										}
										label
									/>
								) : null}
							</group>
						)
					})}
				</>
			)
		}
	} else {
		ArcArrows = (
			<>
				{xPositionsOfArrows.map((xPos) => {
					const yPos = linearFunctionLoad(xPos)
					let direction: 'x' | 'y' | 'z' | '-x' | '-y' | '-z' =
						yPos < 0 ? negativeDirection : positiveDirection
					if (isClose(yPos, 0))
						if (Math.abs(loads[0]) >= Math.abs(loads[1]))
							direction = loads[0] < 0 ? negativeDirection : positiveDirection
						else direction = loads[1] < 0 ? negativeDirection : positiveDirection
					return (
						<group key={`${name}-${direction}-${xPos}`}>
							{!isClose(yPos, 0) && (
								<Moment
									direction={yPos >= 0 ? positiveDirection : negativeDirection}
									position={[
										xPos,
										linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
										linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
									]}
									value={xPositionsOfArrows[0] === xPos ? loads[0] : loads[1]}
									radius={(Math.abs(yPos) + 0.1) * 0.3}
									scale={(Math.abs(yPos) + 0.1) * 0.3}
									arrowColor={yPos < 0 ? negativeArrowColor : positiveArrowColor}
									labelColor={yPos < 0 ? negativeLabelColor : positiveLabelColor}
									label={
										xPositionsOfArrows[0] === xPos ||
										xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos
									}
								/>
							)}
							{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
							isClose(yPos, 0) ? (
								<>
									<Moment
										value={0}
										direction={loads[0] < 0 ? negativeDirection : positiveDirection}
										position={[
											xPos - 0.03,
											linearFunctionBarXY(xPos - 0.03) - parametersLinearBarXY.b,
											linearFunctionBarXZ(xPos - 0.03) - parametersLinearBarXZ.b
										]}
										scale={0.1 * 0.3}
										radius={0.1 * 0.3}
										arrowColor={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
									/>
									<Moment
										value={0}
										direction={loads[0] < 0 ? positiveDirection : negativeDirection}
										position={[
											xPos + 0.03,
											linearFunctionBarXY(xPos + 0.03) - parametersLinearBarXY.b,
											linearFunctionBarXZ(xPos + 0.03) - parametersLinearBarXZ.b
										]}
										scale={0.1 * 0.3}
										radius={0.1 * 0.3}
										arrowColor={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
									/>
								</>
							) : isClose(yPos, 0) ? (
								<Moment
									value={0}
									direction={direction}
									position={[
										xPos,
										linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
										linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
									]}
									radius={0.1 * 0.3}
									scale={0.1 * 0.3}
									arrowColor={
										direction === negativeDirection ? negativeArrowColor : positiveArrowColor
									}
									labelColor={
										direction === negativeDirection ? negativeLabelColor : positiveLabelColor
									}
									label
								/>
							) : null}
						</group>
					)
				})}
			</>
		)
	}

	return <group position={barPoints[0]}>{ArcArrows}</group>
}
