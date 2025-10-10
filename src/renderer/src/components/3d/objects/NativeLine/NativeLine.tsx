import { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

interface INativeLineCustomProps {
	points: number[] | THREE.Vector3[]
	name?: string
	onClick?: (event: ThreeEvent<MouseEvent>) => void
}

type INativeLineProps = INativeLineCustomProps &
	Omit<React.JSX.IntrinsicElements['group'], 'onClick' | 'name'>

export const NativeLine = ({
	points,
	name = '',
	onClick = () => {},
	...groupProps
}: INativeLineProps): React.JSX.Element => {
	const geometry = useMemo(() => {
		const linePoints: THREE.Vector3[] = []
		if (typeof points[0] === 'number') {
			for (let i = 0; i < (points?.length ?? 0); i += 3) {
				linePoints.push(
					new THREE.Vector3(
						points![i] as number,
						points![i + 1] as number,
						points![i + 2] as number
					)
				)
			}
		} else {
			linePoints.push(...(points as THREE.Vector3[]))
		}
		return new THREE.BufferGeometry().setFromPoints(linePoints)
	}, [points])
	return (
		<group {...groupProps}>
			{/* @ts-ignore: The <line> component is not recognized */}
			<line name={name} geometry={geometry} onClick={onClick}>
				<lineBasicMaterial transparent opacity={0} />
			</line>
		</group>
	)
}
