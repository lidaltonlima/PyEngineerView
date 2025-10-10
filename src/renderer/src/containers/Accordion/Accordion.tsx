import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import styles from './Accordion.module.scss'

interface IAccordionProps {
	children: React.ReactNode
	title: string
	open?: boolean
	className?: string
}

export const Accordion = ({
	children,
	title,
	open = false,
	className = ''
}: IAccordionProps): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(open)
	const bodyRef = useRef<HTMLDivElement>(null)
	const [height, setHeight] = useState('0px')

	const toggleOpen = (): void => {
		setIsOpen((prev) => !prev)
	}

	useEffect(() => {
		setHeight(isOpen ? `none` : '0px')
	}, [isOpen, children])

	return (
		<div className={`${styles.main} ${className}`}>
			<button className={styles.header} onClick={toggleOpen}>
				<IoIosArrowDown
					className={`${styles.icon} ${isOpen ? styles.rotateDown : styles.rotateRight}`}
				/>
				<span>{title}</span>
			</button>
			<div ref={bodyRef} className={styles.body} style={{ maxHeight: height }}>
				<div className={styles.inner}>{children}</div>
			</div>
		</div>
	)
}
