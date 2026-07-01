import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authApi } from '../../lib/api'

export default function RequireAuth() {
  const location = useLocation()
  const [authState, setAuthState] = useState('checking')

  useEffect(() => {
    let isActive = true

    setAuthState('checking')
    authApi.me()
      .then(() => {
        if (isActive) setAuthState('authenticated')
      })
      .catch(() => {
        if (isActive) setAuthState('unauthenticated')
      })

    const handleUnauthorized = () => {
      if (isActive) setAuthState('unauthenticated')
    }

    window.addEventListener('hyperoom:unauthorized', handleUnauthorized)

    return () => {
      isActive = false
      window.removeEventListener('hyperoom:unauthorized', handleUnauthorized)
    }
  }, [location.pathname, location.search])

  if (authState === 'checking') {
    return (
      <main className="min-h-screen bg-surface-container flex items-center justify-center text-[#1e1613] font-data-mono">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-glow-highlight text-[48px] animate-spin">sync</span>
          <span>Đang kiểm tra phiên đăng nhập...</span>
        </div>
      </main>
    )
  }

  if (authState === 'unauthenticated') {
    return <Navigate replace to="/auth/login" state={{ from: location }} />
  }

  return <Outlet />
}
