import React, { useRef, useEffect, useState, ReactNode } from 'react'

type MouseTrackerContainerProps = {
	children: ReactNode
}

const MouseTrackerContainer: React.FC<MouseTrackerContainerProps> = ({
	children
}) => {
	const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0
	})
	const [isBlurred, setIsBlurred] = useState(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleMouseMove = (event: MouseEvent) => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect()
			setMousePosition({
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			})
			setIsBlurred(false) // Clear blur effect on mouse event
			resetTimer() // Reset the timer on every mouse event
		}
	}

	const resetTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
		timerRef.current = setTimeout(() => {
			setIsBlurred(true) // Set blur effect after 5 seconds of inactivity
		}, 5000) // 5 seconds in milliseconds
	}

	useEffect(() => {
		const container = containerRef.current

		if (container) {
			container.addEventListener('mousemove', handleMouseMove)

			// Initial timer setup
			resetTimer()

			return () => {
				container.removeEventListener('mousemove', handleMouseMove)
				if (timerRef.current) {
					clearTimeout(timerRef.current)
				}
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				<p>y:{mousePosition.y}</p>
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
