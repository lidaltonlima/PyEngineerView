import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { CameraControlsConfig, Gizmo, GridConfig, LightBase } from '../scene_components'

interface IDefault3dSceneProps {
	children?: React.ReactNode
}

export const Default3dScene = ({ children = null }: IDefault3dSceneProps): React.JSX.Element => {
	THREE.Object3D.DEFAULT_UP.set(0, 0, 1)

	return (
		<>
			<Canvas
				raycaster={{
					params: {
						Mesh: { threshold: 0 },
						Line: { threshold: 0 },
						Line2: { threshold: 0 },
						Points: { threshold: 0.1 },
						Sprite: { threshold: 0 },
						LOD: { threshold: 0 }
					}
				}}
			>
				<CameraControlsConfig />
				<GridConfig />
				<LightBase />
				<PerspectiveCamera makeDefault position={[20, -20, 20]}>
					<directionalLight intensity={2} color={0xffffff} />
				</PerspectiveCamera>
				{/* <axesHelper /> */}
				<Gizmo />
				{children}
			</Canvas>
		</>
	)
}
