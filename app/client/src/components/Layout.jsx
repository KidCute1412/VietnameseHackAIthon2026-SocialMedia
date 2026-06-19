import { Outlet, useLocation } from 'react-router-dom'
import TopNavBar from './TopNavBar'
import SideNavBar from './SideNavBar'

export default function Layout() {
  const location = useLocation()
  const showBackButton = location.pathname !== '/'

  return (
    <div className="text-on-surface font-body-md min-h-screen flex overflow-hidden">
      <div className="vintage-bg-overlay" />
      <TopNavBar showBackButton={showBackButton} />
      <SideNavBar />
      <Outlet />
    </div>
  )
}
