export default function AuthCard({ title, children, footer }) {
  return (
    <article className="glass-panel w-full max-w-[420px] p-6 sm:p-8 relative z-10">
      <div className="mb-6 text-center">
        <p className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-[#5c4a43]">
          Truy cập HypeRoom
        </p>
        <h1 className="mt-3 font-headline-lg text-[30px] leading-tight text-[#1e1613] sm:text-[34px]">
          {title}
        </h1>
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
