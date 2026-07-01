export default function AuthButton({
  children,
  className = '',
  disabled = false,
  isLoading = false,
  loadingLabel = 'Đang xử lý...',
  type = 'submit',
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`neon-btn flex min-h-12 w-full items-center justify-center rounded px-5 py-3 text-sm uppercase tracking-[0.12em] transition cursor-pointer disabled:pointer-events-none active:scale-[0.98] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E2A1F]/50 ${className}`}
    >
      {isLoading ? loadingLabel : children}
    </button>
  )
}
