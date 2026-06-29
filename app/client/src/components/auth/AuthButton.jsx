export default function AuthButton({
  children,
  className = '',
  disabled = false,
  type = 'submit',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`neon-btn flex min-h-12 w-full items-center justify-center rounded px-5 py-3 text-sm uppercase tracking-[0.12em] transition disabled:pointer-events-none disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  )
}
