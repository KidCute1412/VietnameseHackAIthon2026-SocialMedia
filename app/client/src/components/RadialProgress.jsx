import { useState, useEffect, useRef } from 'react'
import { animate, utils } from 'animejs'

export default function RadialProgress({ value, color }) {
  const [displayValue, setDisplayValue] = useState(0)
  const animatedRef = useRef({ val: 0 })

  useEffect(() => {
    // Reset to 0 so the count-up animation always runs from 0
    animatedRef.current.val = 0
    
    // Animate value from 0 to target value
    animate(animatedRef.current, {
      val: value,
      duration: 1500,
      ease: 'outExpo',
      modifier: utils.round(0),
      onUpdate: () => {
        setDisplayValue(animatedRef.current.val)
      }
    })
  }, [value])

  return (
    <div
      className="radial-progress mb-4"
      style={{
        '--value': displayValue,
        '--color': color,
      }}
    >
      <span
        className="font-headline-md text-headline-md font-bold"
        style={{ color }}
      >
        {displayValue}%
      </span>
    </div>
  )
}
