import { Camera } from '@react-three/fiber'

export interface ISphereGizmoProps {
	camera: Camera

	onClickX?: () => void
	onClickLookingX?: () => void
	onClickXNegative?: () => void
	onClickLookingXNegative?: () => void

	onClickY?: () => void
	onClickLookingY?: () => void
	onClickYNegative?: () => void
	onClickLookingYNegative?: () => void

	onClickZ?: () => void
	onClickLookingZ?: () => void
	onClickZNegative?: () => void
	onClickLookingZNegative?: () => void
}
