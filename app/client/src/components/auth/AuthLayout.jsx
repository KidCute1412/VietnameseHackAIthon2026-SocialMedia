import { useLocation } from 'react-router-dom'
import TopNavBar from '../TopNavBar'

const authHeroContent = {
  '/auth/login': {
    eyebrow: 'Phòng điều hành biên tập',
    headline: '',
  },
  '/auth/logout': {
    eyebrow: 'Hẹn gặp lại',
    headline: 'Phiên làm việc đã kết thúc.',
  },
  '/auth/register': {
    eyebrow: 'Tạo quyền truy cập',
    headline: 'Tạo tài khoản cho phòng điều hành HypeRoom.',
  },
  '/auth/forgot-password': {
    eyebrow: 'Khôi phục tài khoản',
    headline: 'Khôi phục quyền truy cập bằng email của bạn.',
  },
  '/auth/verify-otp': {
    eyebrow: 'Xác minh OTP',
    headline: 'Xác minh mã OTP trước khi đặt lại mật khẩu.',
  },
  '/auth/reset-password': {
    eyebrow: 'Đặt lại mật khẩu',
    headline: 'Thiết lập mật khẩu mới cho tài khoản.',
  },
}

export default function AuthLayout({ children }) {
  const { pathname } = useLocation()
  const heroContent = authHeroContent[pathname] || authHeroContent['/auth/login']

  return (
    <div className="relative isolate min-h-screen text-[#241b17] bg-[#efe4cf] flex flex-col justify-between overflow-x-hidden">
      {/* Dynamic stylesheets for premium vintage styling */}
      <style>{`
        /* Make the global vintage editorial background overlay soft and atmospheric */
        .vintage-bg-overlay {
          opacity: 0.9 !important;
          background-color: #efe4cf !important;
          background-image: url('/vintage_editorial_bg.png') !important;
          background-size: cover !important;
          background-position: center !important;
        }

        /* Premium vintage card style with double ruled border and soft shadow */
        .auth-card-container .glass-panel {
          background-color: #fffcf7 !important;
          background-image: url('https://www.transparenttextures.com/patterns/aged-paper.png') !important;
          background-blend-mode: multiply !important;
          border: 2px solid #3d2f2b !important;
          border-radius: 12px !important;
          box-shadow: 0 16px 36px rgba(36, 27, 23, 0.18), 0 2px 10px rgba(36, 27, 23, 0.12) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          position: relative !important;
          padding: 32px 28px !important;
        }

        /* Classical newspaper frame styling */
        .auth-card-container .glass-panel::before {
          content: '' !important;
          position: absolute !important;
          top: 8px !important;
          left: 8px !important;
          right: 8px !important;
          bottom: 8px !important;
          border: 1px solid rgba(61, 47, 43, 0.25) !important;
          pointer-events: none !important;
          border-radius: 8px !important;
        }

        /* Enhance legibility of small labels and headers on the Auth card */
        .auth-card-container label span {
          color: #3d2f2b !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
        }

        .auth-card-container p.font-label-caps {
          color: #5c4a43 !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 2px !important;
        }

        /* Premium inputs */
        .auth-card-container input[type="text"],
        .auth-card-container input[type="email"],
        .auth-card-container input[type="password"] {
          background-color: #fbfaf4 !important;
          border: 1px solid rgba(61, 47, 43, 0.35) !important;
          border-radius: 6px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .auth-card-container input:focus {
          border-color: #9E2A1F !important;
          box-shadow: 0 0 0 3px rgba(158, 42, 31, 0.12) !important;
          background-color: #ffffff !important;
        }

        /* Premium red button styling */
        .auth-card-container .neon-btn {
          background: #9E2A1F !important;
          color: #fffcf7 !important;
          border: none !important;
          border-radius: 6px !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 12px rgba(158, 42, 31, 0.2) !important;
          transition: all 0.2s ease !important;
        }

        .auth-card-container .neon-btn:hover {
          background: #b53225 !important;
          box-shadow: 0 6px 16px rgba(158, 42, 31, 0.3) !important;
          transform: translateY(-1px) !important;
        }

        .auth-card-container .neon-btn:active {
          background: #832017 !important;
          box-shadow: 0 2px 8px rgba(158, 42, 31, 0.2) !important;
          transform: translateY(1px) !important;
        }

        /* Disabled styling for button */
        .auth-card-container .neon-btn:disabled {
          background: #d8cfc0 !important;
          color: #8f8178 !important;
          box-shadow: none !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          transform: none !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* Vintage desk background */}
      <div aria-hidden="true" className="vintage-bg-overlay" />

      {/* Header bar synchronized with page theme */}
      <TopNavBar showBackButton={false} />

      {/* Centered card wrapper */}
      <main className="min-h-[calc(100vh-72px)] mt-[72px] flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        
        {/* Auth form container (fixed width 420px) */}
        <div className="auth-card-container relative w-full max-w-[420px] animate-fade-in my-auto">
          {/* Main Card (children) */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
