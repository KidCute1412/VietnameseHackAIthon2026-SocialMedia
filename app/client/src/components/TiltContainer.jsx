import { useRef } from 'react'

export default function TiltContainer({ children, className = "", style = {} }) {
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const el = containerRef.current
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const xc = rect.width / 2
    const yc = rect.height / 2
    
    // Max 8 degrees of tilt for a subtle, premium look
    const rotateX = -(y - yc) / (rect.height / 8)
    const rotateY = (x - xc) / (rect.width / 8)
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    el.style.transition = 'transform 0.05s ease-out'
  }

  const handleMouseLeave = () => {
    if (!containerRef.current) return
    const el = containerRef.current
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    el.style.transition = 'transform 0.5s ease-out'
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ ...style, transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}
