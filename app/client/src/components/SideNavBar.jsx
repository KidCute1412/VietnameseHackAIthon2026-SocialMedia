import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard', id: 'nav-dashboard' },
  { path: '/verification', icon: 'document_scanner', label: 'SmartReader', id: 'nav-smartreader' },
  { path: '/vnsocial', icon: 'analytics', label: 'Thông tin Trending', id: 'nav-vnsocial' },
]

export default function SideNavBar() {
  const location = useLocation()

  return (
    <nav className="fixed left-0 top-0 h-full w-[80px] hover:w-[240px] z-40 flex flex-col py-panel-padding bg-surface-container-lowest/80 backdrop-blur-xl border-r border-white/5 shadow-2xl transition-all duration-300 group pt-[96px] overflow-hidden">
      {/* User Info */}
      <div className="px-6 mb-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
      <div id="sidebar-nav" className="flex-1 flex flex-col gap-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.id}
              id={item.id}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg group-hover:translate-x-1 transition-all ${isActive
                  ? 'bg-white/10 text-glow-highlight border border-glow-highlight/20 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Bottom Area */}
      <div className="mt-auto w-full border-t border-white/5" />
    </nav>
  )
}
