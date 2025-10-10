import { CameraControls, Hud, OrthographicCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { SphereGizmo } from './SphereGizmo'

export const Gizmo = (): React.JSX.Element => {
	const { size, camera, controls } = useThree()
	const cameraControls = controls as CameraControls

	const mesh = useRef<THREE.Group>(new THREE.Group())

	// Move came with click in axis ///////////////////////////////////////////////////////////////
	const moveToUp = (): Promise<void> => cameraControls.rotateTo(0, 0, true)
	const moveToDown = (): Promise<void> => cameraControls.rotateTo(0, Math.PI, true)
	const moveToRight = (): Promise<void> => cameraControls.rotateTo(Math.PI / 2, Math.PI / 2, true)
	const moveToLeft = (): Promise<void> => cameraControls.rotateTo(-Math.PI / 2, Math.PI / 2, true)
	const moveToFront = (): Promise<void> => cameraControls.rotateTo(0, Math.PI / 2, true)
	const moveToBack = (): Promise<void> => cameraControls.rotateTo(Math.PI, Math.PI / 2, true)
	///////////////////////////////////////////////////////////////////////////////////////////////

	// Calcula a posição com base no tamanho atual
	const position = useMemo(() => {
		const zoom = 90 // mesmo zoom da câmera ortográfica
		const position = new THREE.Vector3()
		position.set(
			size.width / (2 * zoom) - 0.6, // canto direito
			size.height / (2 * zoom) - 0.6, // canto superior
			0
		)

		return position
	}, [size])

	useFrame(() => {
		// Spin mesh to the inverse of the default cameras matrix
		const matrix = new THREE.Matrix4()
		matrix.copy(camera.matrix).invert()
		mesh.current.quaternion.setFromRotationMatrix(matrix)
	})

	return (
		<Hud>
			{/* Câmera do gizmo */}
			<OrthographicCamera makeDefault position={[0, 0, 0.6]} zoom={90} />
			<ambientLight intensity={1} />
			<fog attach='fog' args={['#1a1a1a', 0.5, 1.5]} />
			<group ref={mesh} position={position}>
				<SphereGizmo
					camera={camera}
					onClickX={moveToRight}
					onClickLookingX={moveToLeft}
					onClickXNegative={moveToLeft}
					onClickLookingXNegative={moveToRight}
					onClickY={moveToBack}
					onClickLookingY={moveToFront}
					onClickYNegative={moveToFront}
					onClickLookingYNegative={moveToBack}
					onClickZ={moveToUp}
					onClickLookingZ={moveToDown}
					onClickZNegative={moveToDown}
					onClickLookingZNegative={moveToUp}
				/>
			</group>
		</Hud>
	)
}
