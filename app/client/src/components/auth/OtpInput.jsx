import { useRef } from 'react'

export default function OtpInput({ error, length = 6, onChange, value }) {
  const inputRefs = useRef([])
  const digits = value.padEnd(length, ' ').slice(0, length).split('')

  const updateDigit = (index, rawValue) => {
    const nextDigit = rawValue.replace(/\D/g, '').slice(-1)
    const nextDigits = digits.map((digit) => (digit === ' ' ? '' : digit))
    nextDigits[index] = nextDigit
    onChange(nextDigits.join('').slice(0, length))

    if (nextDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !digits[index].trim() && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pastedValue)
    inputRefs.current[Math.min(pastedValue.length, length - 1)]?.focus()
  }

  return (
    <div>
      <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            aria-label={`Số OTP thứ ${index + 1}`}
            className={`aspect-square w-full rounded border bg-[#fbfaf4]/90 text-center font-data-mono text-xl font-bold text-[#1e1613] outline-none transition focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#3d2f2b] ${
              error ? 'border-[#bb2d3b]' : 'border-[#3d2f2b]'
            }`}
            inputMode="numeric"
            maxLength={1}
            type="text"
            value={digit.trim()}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs font-semibold text-[#bb2d3b]">{error}</p>}
    </div>
  )
}
