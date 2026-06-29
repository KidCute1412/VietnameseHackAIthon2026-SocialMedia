import { useState } from 'react'

const inputBaseClass =
  'w-full rounded border border-[#3d2f2b] bg-[#fbfaf4]/85 py-3 pl-4 pr-12 text-sm text-[#1e1613] outline-none transition placeholder:text-[#8c7a65] focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#3d2f2b]'

export default function PasswordInput({ error, id, label, ...props }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block font-label-caps text-label-caps uppercase tracking-[0.14em] text-[#3d2f2b]">
        {label}
      </span>
      <span className="relative block">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          className={`${inputBaseClass} ${error ? 'border-[#bb2d3b] bg-[#fff5f5]/90' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded border border-transparent text-[#5c4a43] transition hover:border-[#3d2f2b] hover:bg-[#eadfce]"
          aria-label={isVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          onClick={() => setIsVisible((current) => !current)}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isVisible ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </span>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs font-semibold text-[#bb2d3b]">
          {error}
        </p>
      )}
    </label>
  )
}
