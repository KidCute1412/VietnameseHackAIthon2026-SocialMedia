export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <article className="glass-panel w-full max-w-[460px] p-6 sm:p-8">
      <div className="mb-7">
        <p className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-[#5c4a43]">
          Truy cập HypeRoom
        </p>
        <h1 className="mt-3 font-headline-lg text-[30px] leading-tight text-[#1e1613] sm:text-[34px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm leading-6 text-[#5c4a43]">{subtitle}</p>
        )}
      </div>

      {children}

      {footer && (
        <div className="mt-7 border-t border-[#3d2f2b]/20 pt-5 text-center text-sm text-[#5c4a43]">
          {footer}
        </div>
      )}
    </article>
  )
}
