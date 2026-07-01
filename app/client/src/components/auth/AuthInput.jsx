const inputBaseClass =
  'w-full rounded border border-[#3d2f2b] bg-[#fbfaf4]/85 px-4 py-3 text-sm text-[#1e1613] outline-none transition placeholder:text-[#8c7a65] focus:outline-none focus:ring-2 focus:ring-[#9E2A1F]/30 focus:border-[#9E2A1F] focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#3d2f2b] disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#f2efe6]/70 disabled:transform-none disabled:shadow-none'

export default function AuthInput({
  error,
  id,
  label,
  type = 'text',
  className = '',
  disabled,
  ...props
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block font-label-caps text-label-caps uppercase tracking-[0.14em] text-[#3d2f2b]">
        {label}
      </span>
      <input
        id={id}
        type={type}
        disabled={disabled}
        className={`${inputBaseClass} ${error ? 'border-[#e66b76] bg-[#fff5f5]/90' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs font-semibold text-[#1f1714]">
          {error}
        </p>
      )}
    </label>
  )
}
