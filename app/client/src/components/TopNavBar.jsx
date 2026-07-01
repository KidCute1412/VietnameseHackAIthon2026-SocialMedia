import { Link } from 'react-router-dom'

export default function TopNavBar({ showBackButton }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-gutter-desktop h-[72px] bg-surface-container-lowest/60 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-glow-highlight transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </Link>
        )}
        <h1 className="font-headline-md text-headline-md font-bold text-white flex items-center gap-2">
          <img alt="HypeRoom Logo" className="h-6 md:h-8 object-contain logo-img" src="/brand_identity.png" />
        </h1>
      </div>
    </header>
  )
}
