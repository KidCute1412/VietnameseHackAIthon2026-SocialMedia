import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Nguồn của bạn', id: 'nav-dashboard' },
  { path: '/vnsocial', icon: 'analytics', label: 'Thông tin Trending', id: 'nav-vnsocial' },
]

export default function SideNavBar() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full h-[60px] z-40 flex flex-row py-0 px-2 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-white/5 shadow-2xl transition-all duration-300 group pt-0 overflow-hidden items-center md:fixed md:left-0 md:top-0 md:bottom-auto md:h-full md:w-[80px] md:hover:w-[240px] md:flex-col md:py-panel-padding md:px-0 md:bg-surface-container-lowest/80 md:border-t-0 md:border-r md:pt-[96px] md:items-stretch">
      {/* User Info */}
      <div className="hidden md:flex px-6 mb-8 items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-glow-highlight/20 to-glow-purple/20 flex items-center justify-center border border-white/10 shrink-0">
          <span className="material-symbols-outlined text-glow-highlight">person</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-white/50">Biên tập viên Tin tức</span>
          <span className="font-headline-md text-[16px] font-black text-white">HypeRoom</span>
          <span className="font-body-sm text-body-sm text-glow-highlight/70 text-[10px]">V2.4.0-Stable</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div id="sidebar-nav" className="flex-1 flex flex-row md:flex-col gap-1 md:gap-2 px-2 w-full md:w-auto justify-around md:justify-start items-center md:items-stretch">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.id}
              id={item.id}
              to={item.path}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 px-3 py-1.5 md:px-4 md:py-3 rounded-lg md:group-hover:translate-x-1 transition-all ${isActive
                  ? 'bg-white/10 text-glow-highlight border border-glow-highlight/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span
                className="material-symbols-outlined shrink-0 text-[20px] md:text-[24px]"
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps text-[9px] md:text-label-caps opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Bottom Area */}
      <div className="hidden md:block mt-auto w-full border-t border-white/5" />
    </nav>
  )
}
