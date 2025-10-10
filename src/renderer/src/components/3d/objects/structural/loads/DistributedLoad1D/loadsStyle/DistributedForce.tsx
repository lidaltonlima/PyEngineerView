import { Arrow } from '@renderer/components/3d/objects/Arrow'
import { isClose, linSpace } from '@renderer/utils/functions/others'
import * as space2D from '@renderer/utils/functions/space2d'
import { Vector3 } from 'three'
import * as matrix from '@renderer/utils/functions/matrix'
import { BillboardTextAxis } from '@renderer/components/3d/utils'

const interRegularFont = new URL('/fonts/Inter-Regular.woff', import.meta.url).href

interface IDistributedForceProps {
	name: string
	forceDirection: 'Fx' | 'Fy' | 'Fz'
	loads: [number, number]
	xPositions: [number, number]
	barPoints: [Vector3, Vector3]

	size?: number
	positiveArrowColor?: string
	negativeArrowColor?: string
	positiveLabelColor?: string
	negativeLabelColor?: string
}

export const DistributedForce = ({
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
}: IDistributedForceProps): React.JSX.Element => {
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
	let numberOfArrows = Math.ceil(Math.abs(xPositions[1] - xPositions[0]) / 0.3)
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
		case 'Fx':
			positiveDirection = 'x'
			negativeDirection = '-x'
			break
		case 'Fy':
			positiveDirection = 'y'
			negativeDirection = '-y'
			break
		case 'Fz':
			positiveDirection = 'z'
			negativeDirection = '-z'
			break
	}

	let arrows: React.JSX.Element = <></>
	if (barPoints[0].x === barPoints[1].x) {
		if (barPoints[0].y === barPoints[1].y) {
			arrows = (
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
									<Arrow
										direction={yPos >= 0 ? positiveDirection : negativeDirection}
										position={[0, 0, xPos + linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b]}
										length={Math.abs(yPos)}
										scale={(Math.abs(yPos) + 0.2) * 0.5}
										color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
										notLine
										endBase
									/>
								)}
								{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
								isClose(yPos, 0) ? (
									<>
										<Arrow
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
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
											notLine
											endBase
										/>
										<Arrow
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
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
											notLine
											endBase
										/>
									</>
								) : isClose(yPos, 0) ? (
									<Arrow
										direction={direction}
										position={[0, 0, xPos + linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b]}
										length={Math.abs(yPos)}
										scale={(Math.abs(yPos) + 0.2) * 0.5}
										color={
											direction === negativeDirection ? negativeArrowColor : positiveArrowColor
										}
										notLine
									/>
								) : null}
								{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) && (
									<>
										{xPositionsOfArrows[0] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={loads[0] < 0 ? 'left' : 'right'}
												anchorY='bottom'
												position={[
													0,
													0,
													x[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={loads[0] < 0 ? negativeLabelColor : positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[0]}
											</BillboardTextAxis>
										)}
										{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={loads[1] < 0 ? 'left' : 'right'}
												anchorY='bottom'
												position={[
													0,
													0,
													x[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={loads[1] < 0 ? negativeLabelColor : positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[1]}
											</BillboardTextAxis>
										)}
									</>
								)}
								{loads[0] >= 0 && loads[1] >= 0 && (
									<>
										{xPositionsOfArrows[0] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'right'}
												anchorY='bottom'
												position={[
													0,
													0,
													x[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[0]}
											</BillboardTextAxis>
										)}
										{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'right'}
												anchorY='bottom'
												position={[
													0,
													0,
													x[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[1]}
											</BillboardTextAxis>
										)}
									</>
								)}
								{loads[0] <= 0 && loads[1] <= 0 && (
									<>
										{xPositionsOfArrows[0] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'left'}
												anchorY='bottom'
												position={[
													0,
													0,
													x[0] + linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={negativeLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[0]}
											</BillboardTextAxis>
										)}
										{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'left'}
												anchorY='bottom'
												position={[
													0,
													0,
													x[1] + linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={negativeLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[1]}
											</BillboardTextAxis>
										)}
									</>
								)}
							</group>
						)
					})}
				</>
			)
		} else {
			arrows = (
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
									<Arrow
										direction={yPos >= 0 ? positiveDirection : negativeDirection}
										position={[
											0,
											xPos + linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
											linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
										]}
										length={Math.abs(yPos)}
										scale={(Math.abs(yPos) + 0.2) * 0.5}
										color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
										notLine
										endBase
									/>
								)}
								{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
								isClose(yPos, 0) ? (
									<>
										<Arrow
											direction={loads[0] < 0 ? negativeDirection : positiveDirection}
											position={[
												0,
												xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0),
												linearFunctionBarXZ(xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0)) -
													parametersLinearBarXZ.b
											]}
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
											notLine
											endBase
										/>
										<Arrow
											direction={loads[0] < 0 ? positiveDirection : negativeDirection}
											position={[
												0,
												xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0),
												linearFunctionBarXZ(xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0)) -
													parametersLinearBarXZ.b
											]}
											scale={0.2 * 0.5}
											color={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
											notLine
											endBase
										/>
									</>
								) : isClose(yPos, 0) ? (
									<Arrow
										direction={direction}
										position={[0, xPos, linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b]}
										length={Math.abs(yPos)}
										scale={(Math.abs(yPos) + 0.2) * 0.5}
										color={
											direction === negativeDirection ? negativeArrowColor : positiveArrowColor
										}
										notLine
									/>
								) : null}
								{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) && (
									<>
										{xPositionsOfArrows[0] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={loads[0] < 0 ? 'left' : 'right'}
												anchorY='bottom'
												position={[
													0,
													x[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
													linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={loads[0] < 0 ? negativeLabelColor : positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[0]}
											</BillboardTextAxis>
										)}
										{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={loads[1] < 0 ? 'left' : 'right'}
												anchorY='bottom'
												position={[
													0,
													x[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
													linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={loads[1] < 0 ? negativeLabelColor : positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[1]}
											</BillboardTextAxis>
										)}
									</>
								)}
								{loads[0] >= 0 && loads[1] >= 0 && (
									<>
										{xPositionsOfArrows[0] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'right'}
												anchorY='bottom'
												position={[
													0,
													x[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
													linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[0]}
											</BillboardTextAxis>
										)}
										{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'right'}
												anchorY='bottom'
												position={[
													0,
													x[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
													linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={positiveLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[1]}
											</BillboardTextAxis>
										)}
									</>
								)}
								{loads[0] <= 0 && loads[1] <= 0 && (
									<>
										{xPositionsOfArrows[0] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'left'}
												anchorY='bottom'
												position={[
													0,
													x[0] + linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
													linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={negativeLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[0]}
											</BillboardTextAxis>
										)}
										{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
											<BillboardTextAxis
												axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
												anchorX={'left'}
												anchorY='bottom'
												position={[
													0,
													x[1] + linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
													linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
												]}
												font={interRegularFont}
												fontSize={0.1}
												color={negativeLabelColor}
												offsetY={(Math.abs(yPos) + 0.2) * 0.1}
											>
												{loads[1]}
											</BillboardTextAxis>
										)}
									</>
								)}
							</group>
						)
					})}
				</>
			)
		}
	} else {
		arrows = (
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
								<Arrow
									direction={yPos >= 0 ? positiveDirection : negativeDirection}
									position={[
										xPos,
										linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
										linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
									]}
									scale={(Math.abs(yPos) + 0.2) * 0.5}
									color={yPos < 0 ? negativeArrowColor : positiveArrowColor}
									notLine
									endBase
								/>
							)}
							{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) &&
							isClose(yPos, 0) ? (
								<>
									<Arrow
										direction={loads[0] < 0 ? negativeDirection : positiveDirection}
										position={[
											xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0),
											linearFunctionBarXY(xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0)) -
												parametersLinearBarXY.b,
											linearFunctionBarXZ(xPos - 0.01 - (loads[0] < 0 ? 0.05 : 0)) -
												parametersLinearBarXZ.b
										]}
										scale={0.2 * 0.5}
										color={loads[0] < 0 ? negativeArrowColor : positiveArrowColor}
										notLine
										endBase
									/>
									<Arrow
										direction={loads[0] < 0 ? positiveDirection : negativeDirection}
										position={[
											xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0),
											linearFunctionBarXY(xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0)) -
												parametersLinearBarXY.b,
											linearFunctionBarXZ(xPos + 0.01 + (loads[0] < 0 ? 0.05 : 0)) -
												parametersLinearBarXZ.b
										]}
										scale={0.2 * 0.5}
										color={loads[0] < 0 ? positiveArrowColor : negativeArrowColor}
										notLine
										endBase
									/>
								</>
							) : isClose(yPos, 0) ? (
								<Arrow
									direction={direction}
									position={[
										xPos,
										linearFunctionBarXY(xPos) - parametersLinearBarXY.b,
										linearFunctionBarXZ(xPos) - parametersLinearBarXZ.b
									]}
									scale={(Math.abs(yPos) + 0.2) * 0.5}
									color={direction === negativeDirection ? negativeArrowColor : positiveArrowColor}
									notLine
									endBase
								/>
							) : null}
							{((loads[0] > 0 && loads[1] < 0) || (loads[0] < 0 && loads[1] > 0)) && (
								<>
									{xPositionsOfArrows[0] === xPos && (
										<BillboardTextAxis
											axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
											anchorX={loads[0] < 0 ? 'left' : 'right'}
											anchorY='bottom'
											position={[
												x[0],
												linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
												linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
											]}
											font={interRegularFont}
											fontSize={0.1}
											color={loads[0] < 0 ? negativeLabelColor : positiveLabelColor}
											offsetY={(Math.abs(yPos) + 0.2) * 0.1}
										>
											{loads[0]}
										</BillboardTextAxis>
									)}
									{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
										<BillboardTextAxis
											axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
											anchorX={loads[1] < 0 ? 'left' : 'right'}
											anchorY='bottom'
											position={[
												x[1],
												linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
												linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
											]}
											font={interRegularFont}
											fontSize={0.1}
											color={loads[1] < 0 ? negativeLabelColor : positiveLabelColor}
											offsetY={(Math.abs(yPos) + 0.2) * 0.1}
										>
											{loads[1]}
										</BillboardTextAxis>
									)}
								</>
							)}
							{loads[0] >= 0 && loads[1] >= 0 && (
								<>
									{xPositionsOfArrows[0] === xPos && (
										<BillboardTextAxis
											axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
											anchorX={'right'}
											anchorY='bottom'
											position={[
												x[0],
												linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
												linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
											]}
											font={interRegularFont}
											fontSize={0.1}
											color={positiveLabelColor}
											offsetY={(Math.abs(yPos) + 0.2) * 0.1}
										>
											{loads[0]}
										</BillboardTextAxis>
									)}
									{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
										<BillboardTextAxis
											axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
											anchorX={'right'}
											anchorY='bottom'
											position={[
												x[1],
												linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
												linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
											]}
											font={interRegularFont}
											fontSize={0.1}
											color={positiveLabelColor}
											offsetY={(Math.abs(yPos) + 0.2) * 0.1}
										>
											{loads[1]}
										</BillboardTextAxis>
									)}
								</>
							)}
							{loads[0] <= 0 && loads[1] <= 0 && (
								<>
									{xPositionsOfArrows[0] === xPos && (
										<BillboardTextAxis
											axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
											anchorX={'left'}
											anchorY='bottom'
											position={[
												x[0],
												linearFunctionBarXY(x[0]) - parametersLinearBarXY.b,
												linearFunctionBarXZ(x[0]) - parametersLinearBarXZ.b
											]}
											font={interRegularFont}
											fontSize={0.1}
											color={negativeLabelColor}
											offsetY={(Math.abs(yPos) + 0.2) * 0.1}
										>
											{loads[0]}
										</BillboardTextAxis>
									)}
									{xPositionsOfArrows[xPositionsOfArrows.length - 1] === xPos && (
										<BillboardTextAxis
											axis={forceDirection == 'Fx' ? 'x' : forceDirection == 'Fy' ? 'y' : 'z'}
											anchorX={'left'}
											anchorY='bottom'
											position={[
												x[1],
												linearFunctionBarXY(x[1]) - parametersLinearBarXY.b,
												linearFunctionBarXZ(x[1]) - parametersLinearBarXZ.b
											]}
											font={interRegularFont}
											fontSize={0.1}
											color={negativeLabelColor}
											offsetY={(Math.abs(yPos) + 0.2) * 0.1}
										>
											{loads[1]}
										</BillboardTextAxis>
									)}
								</>
							)}
						</group>
					)
				})}
			</>
		)
	}

	return <group position={barPoints[0]}>{arrows}</group>
}
