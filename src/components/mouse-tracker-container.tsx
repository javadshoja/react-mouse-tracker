import React, { useRef, useEffect, useState, ReactNode } from 'react'

type MouseTrackerContainerProps = {
	children: ReactNode
}

const MouseTrackerContainer: React.FC<MouseTrackerContainerProps> = ({
	children
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [isBlurred, setIsBlurred] = useState(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect()
				const x = event.clientX - rect.left
				const y = event.clientY - rect.top
				setMousePosition({ x, y })

				// Clear the blur effect and reset the timeout
				setIsBlurred(false)
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current)
				}
				timeoutRef.current = setTimeout(() => {
					setIsBlurred(true)
				}, 5000) // 5 seconds
			}
		}

		const container = containerRef.current
		if (container) {
			container.addEventListener('mousemove', handleMouseMove)

			// Initial timeout setup
			timeoutRef.current = setTimeout(() => {
				setIsBlurred(true)
			}, 5000) // 5 seconds
		}

		return () => {
			if (container) {
				container.removeEventListener('mousemove', handleMouseMove)
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	return (
		<div
			className='container'
			style={{
				filter: isBlurred ? 'blur(5px)' : 'none'
			}}
			ref={containerRef}
		>
			<div className='mouse-position'>
				<p>Mouse position:</p>
				<p>x: {mousePosition.x},</p>
				<p>y: {mousePosition.y}</p>
			</div>
			{children}
			<div
				className='mouse'
				style={{
					left: mousePosition.x,
					top: mousePosition.y
				}}
			/>
		</div>
	)
}

export default MouseTrackerContainer
