import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import styles from './ResizableContainer.module.scss'

interface IResizableContainerProps {
	children: React.ReactNode

	className?: string
	initialWidth?: number
	initialHeight?: number
	minWidth?: number
	maxWidth?: number
	minHeight?: number
	maxHeight?: number
	widthRef?: React.RefObject<number> | null

	resizeTop?: boolean
	resizeRight?: boolean
	resizeBottom?: boolean
	resizeLeft?: boolean
	fullWidth?: boolean
	fullHeight?: boolean
}

export interface IResizableContainerRef {
	getBoundingClientRect: () => DOMRect | null
}

type Direction = 'top' | 'right' | 'bottom' | 'left'

export const ResizableContainer = forwardRef<IResizableContainerRef, IResizableContainerProps>(
	(
		{
			className = '',
			initialWidth = 50,
			initialHeight = 50,
			minWidth = 100,
			maxWidth = 500,
			widthRef = null,
			minHeight = 100,
			maxHeight = 100,
			resizeTop = false,
			resizeRight = false,
			resizeBottom = false,
			resizeLeft = false,
			fullHeight = false,
			fullWidth = false,
			children
		},
		ref
	): React.JSX.Element => {
		// Component size
		const [width, setWidth] = useState(initialWidth)
		const [height, setHeight] = useState(initialHeight)
		// Active drag
		const [direction, setDirection] = useState<Direction | null>(null)
		// Initial mouse position
		const [startX, setStartX] = useState(0)
		const [startY, setStartY] = useState(0)
		// Initial component size
		const [startW, setStartW] = useState(0)
		const [startH, setStartH] = useState(0)

		const refContainer = useRef<HTMLDivElement>(null)
		useImperativeHandle(ref, () => ({
			getBoundingClientRect() {
				return refContainer.current?.getBoundingClientRect() ?? null
			}
		}))

		useEffect(() => {
			const onMouseMove = (e: MouseEvent): void => {
				if (!direction) return
				const dx = e.clientX - startX
				const dy = e.clientY - startY

				switch (direction) {
					case 'right':
						setWidth(Math.min(Math.max(minWidth, startW + dx), maxWidth))
						break

					case 'bottom':
						setHeight(Math.min(Math.max(minHeight, startH + dy), maxHeight))
						break

					case 'left':
						setWidth(Math.min(Math.max(minWidth, startW - dx), maxWidth))
						break

					case 'top':
						setHeight(Math.min(Math.max(minHeight, startH - dy), maxHeight))
						break
				}
			}

			const onMouseUp = (): void => {
				if (direction) {
					setDirection(null)
				}

				if (widthRef) {
					widthRef.current = width
				}
			}

			if (direction) {
				window.addEventListener('mousemove', onMouseMove)
				window.addEventListener('mouseup', onMouseUp)
			}
			return () => {
				window.removeEventListener('mousemove', onMouseMove)
				window.removeEventListener('mouseup', onMouseUp)
			}
		}, [
			direction,
			width,
			startX,
			startY,
			startW,
			startH,
			minWidth,
			maxWidth,
			minHeight,
			maxHeight,
			widthRef
		])

		const startResize = (direction: Direction, e: React.MouseEvent): void => {
			e.preventDefault()
			setDirection(direction)
			setStartX(e.clientX)
			setStartY(e.clientY)
			setStartW(width)
			setStartH(height)
		}

		const containerStyle: React.CSSProperties = {
			width: fullWidth ? '100%' : `${width}px`,
			height: fullHeight ? '100%' : `${height}px`
		}

		return (
			<div ref={refContainer} className={`${styles.main} ${className}`} style={containerStyle}>
				{children}
				{resizeTop && (
					<div className={styles.resizeTop} onMouseDown={(e) => startResize('top', e)} />
				)}
				{resizeRight && (
					<div className={styles.resizeRight} onMouseDown={(e) => startResize('right', e)} />
				)}
				{resizeBottom && (
					<div className={styles.resizeBottom} onMouseDown={(e) => startResize('bottom', e)} />
				)}
				{resizeLeft && (
					<div className={styles.resizeLeft} onMouseDown={(e) => startResize('left', e)} />
				)}
			</div>
		)
	}
)

ResizableContainer.displayName = 'ResizableContainer'
