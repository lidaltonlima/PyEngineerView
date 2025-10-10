import { Grid } from '@react-three/drei'
import * as THREE from 'three'

export const GridConfig = (): React.JSX.Element => {
	return (
		<>
			<Grid
				rotation-x={Math.PI / 2}
				args={[10, 10]}
				infiniteGrid
				fadeDistance={200}
				fadeStrength={1}
				cellSize={1}
				cellThickness={1}
				cellColor='#4d4d4d'
				sectionSize={10}
				sectionThickness={1.5}
				sectionColor={'#4d4d4d'}
				side={THREE.DoubleSide}
				// Never pick the grid. Not raycast
				ref={(grid) => {
					if (grid) grid.raycast = () => null
				}}
			/>
		</>
	)
}
