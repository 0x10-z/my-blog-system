'use client'
import React, { ReactNode, useState } from 'react'

interface InteractiveCardProps {
  className?: string
  children: ReactNode
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ children, className = 'p-8' }) => {
  const [style, setStyle] = useState<React.CSSProperties>({})

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY, currentTarget } = e
    const { top, left, width, height } = currentTarget.getBoundingClientRect()
    const x = clientX - left - width / 2
    const y = clientY - top - height / 2
    const dx = x / (width / 2)
    const dy = y / (height / 2)

    setStyle({
      transform: `rotateY(${dx * 10}deg) rotateX(${dy * -10}deg)`,
      transition: 'transform 0.1s',
      boxShadow: `${-dx * 5}px ${dy * 5}px 15px rgba(0, 0, 0, 0.3)`,
    })
  }

  return (
    <div
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setStyle({})}
      className={`cursor-pointer shadow-xl ${className}`}
    >
      {children}
    </div>
  )
}

export default InteractiveCard
