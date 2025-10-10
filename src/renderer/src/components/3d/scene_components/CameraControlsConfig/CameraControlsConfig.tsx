import { CameraControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import CameraControlsLib from 'camera-controls'

export const CameraControlsConfig = (): React.JSX.Element => {
	const controlsRef = useRef<CameraControls>(null)
	const [speedDolly, setSpeedDolly] = useState(1)
	const [buttonPressed, setButtonPressed] = useState<string | null>(null)

	const defaultMouseButtons = {
		wheel: CameraControlsLib.ACTION.DOLLY,
		left: CameraControlsLib.ACTION.NONE,
		middle: CameraControlsLib.ACTION.ROTATE,
		right: CameraControlsLib.ACTION.NONE
	}
	const ctrlMouseButtons = {
		wheel: CameraControlsLib.ACTION.DOLLY,
		left: CameraControlsLib.ACTION.NONE,
		middle: CameraControlsLib.ACTION.TRUCK,
		right: CameraControlsLib.ACTION.NONE
	}
	const shiftMouseButtons = {
		wheel: CameraControlsLib.ACTION.DOLLY,
		left: CameraControlsLib.ACTION.NONE,
		middle: CameraControlsLib.ACTION.SCREEN_PAN,
		right: CameraControlsLib.ACTION.NONE
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent): void => {
			setButtonPressed(event.key)
		}

		const handleKeyUp = (): void => {
			setButtonPressed(null)
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	useFrame(() => {
		if (controlsRef.current) {
			switch (buttonPressed) {
				case 'Control':
					controlsRef.current.mouseButtons = ctrlMouseButtons
					setSpeedDolly(0.2)
					break

				case 'Shift':
					controlsRef.current.mouseButtons = shiftMouseButtons
					break

				default:
					controlsRef.current.mouseButtons = defaultMouseButtons
					setSpeedDolly(0.7)
			}
		}
	})

	return (
		<CameraControls
			ref={controlsRef}
			makeDefault
			infinityDolly
			dollyToCursor
			smoothTime={0.1}
			draggingSmoothTime={0.03}
			mouseButtons={defaultMouseButtons}
			dollySpeed={speedDolly}
		/>
	)
}
