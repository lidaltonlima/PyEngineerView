import { useThree } from '@react-three/fiber'
import { useSelectionContext } from '@renderer/contexts/Selection'
import { getNamedParent } from '@renderer/utils/functions/getNamedParent'
import { useCallback, useEffect } from 'react'
import * as THREE from 'three'

export const ClickVoid = (): React.JSX.Element => {
	const { camera, scene, gl } = useThree()
	const { clickVoid } = useSelectionContext()
	const [isClickVoid, setIsClickVoid] = clickVoid

	const handleClick = useCallback(
		(event: MouseEvent) => {
			if (event.button !== 0) return // Only left click
			const raycaster = new THREE.Raycaster()
			const mouse = new THREE.Vector2()

			raycaster.params.Line!.threshold = 0.1
			raycaster.params.Points!.threshold = 0.1

			// normaliza coordenadas do clique
			mouse.x = (event.offsetX / gl.domElement.clientWidth) * 2 - 1
			mouse.y = -(event.offsetY / gl.domElement.clientHeight) * 2 + 1

			raycaster.setFromCamera(mouse, camera)
			const intersects = raycaster.intersectObjects(scene.children, true)

			let clickedInEntity = false
			if (intersects.length === 0) {
				clickedInEntity = false
			} else {
				for (const intersect of intersects) {
					if (getNamedParent(intersect.object)?.name) {
						clickedInEntity = true
					}
				}
			}

			if (!clickedInEntity) {
				setIsClickVoid(true)
			} else {
				if (isClickVoid) setIsClickVoid(false)
			}
		},
		[camera, scene, gl, isClickVoid, setIsClickVoid]
	)

	// adiciona o listener no canvas
	useEffect(() => {
		const canvas = gl.domElement
		canvas.addEventListener('pointerdown', handleClick)

		return () => {
			canvas.removeEventListener('pointerdown', handleClick)
		}
	}, [handleClick, gl])

	return <></>
}
