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
      {/* Dynamic stylesheets for premium vintage ripped paper styling */}
      <style>{`
        /* Make the global vintage newspaper collage background overlay authentic and atmospheric */
        .vintage-bg-overlay {
          filter: sepia(0.08) contrast(1.05) brightness(0.95) !important;
          opacity: 0.65 !important;
          background-color: #efe4cf !important;
          background-image: url('/retro_editorial_bg.png') !important;
          background-size: cover !important;
          background-position: center !important;
          top: 0px !important;
          left: 0px !important;
          right: 0px !important;
          bottom: 0px !important;
          transform: none !important;
        }

        /* Apply a realistic drop shadow that perfectly contours the ripped paper edges */
        .auth-card-container {
          filter: drop-shadow(0 15px 30px rgba(36, 27, 23, 0.35)) !important;
        }

        /* Vintage ripped paper card style with aged texture */
        .auth-card-container .glass-panel {
          background-color: #fffcf7 !important;
          background-image: url('https://www.transparenttextures.com/patterns/aged-paper.png') !important;
          background-blend-mode: multiply !important;
          border: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          padding: 36px 30px !important;
          clip-path: polygon(
            0% 1.5%, 4% 0%, 9% 2%, 14% 0.5%, 19% 2%, 24% 0%, 29% 1.5%, 34% 0.5%, 39% 2%, 44% 0%, 49% 1.5%, 
            54% 0.5%, 59% 2%, 64% 0%, 69% 1.5%, 74% 0.5%, 79% 2%, 84% 0%, 89% 1.5%, 94% 0.5%, 100% 2%,
            99% 7%, 100% 13%, 98.5% 19%, 100% 25%, 99% 31%, 100% 38%, 98.5% 44%, 100% 51%, 99% 57%, 100% 64%, 
            98.5% 70%, 100% 77%, 99% 83%, 100% 90%, 99% 96%, 100% 98.5%,
            96% 99.5%, 91% 98%, 86% 100%, 81% 98.5%, 76% 100%, 71% 98%, 66% 100%, 61% 98.5%, 56% 100%, 
            51% 98%, 46% 100%, 41% 98.5%, 36% 100%, 31% 98%, 26% 100%, 21% 98.5%, 16% 100%, 11% 98%, 6% 100%, 0% 98.5%,
            1% 93%, 0% 87%, 1.5% 81%, 0% 75%, 1% 69%, 0% 63%, 1.5% 57%, 0% 51%, 1% 45%, 0% 39%, 1.5% 33%, 
            0% 27%, 1% 21%, 0% 15%, 1.5% 9%, 0% 3%
          ) !important;
        }

        /* Enhance legibility of small labels and headers on the Auth card */
        .auth-card-container label span {
          color: #3d2f2b !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.08em !important;
        }

        .auth-card-container p.font-label-caps {
          color: #5c4a43 !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 2px !important;
        }

        /* Tactile letterpress/neo-brutalist input styling */
        .auth-card-container input[type="text"],
        .auth-card-container input[type="email"],
        .auth-card-container input[type="password"] {
          background-color: #fbfaf4 !important;
          border: 1px solid #3d2f2b !important;
          border-radius: 4px !important;
          padding-top: 11px !important;
          padding-bottom: 11px !important;
          transition: all 0.15s ease !important;
        }

        .auth-card-container input:focus {
          border-color: #9E2A1F !important;
          transform: translate(-2px, -2px) !important;
          box-shadow: 3px 3px 0px #3d2f2b !important;
          background-color: #ffffff !important;
        }

        /* Tactile stamp style for the primary CTA button */
        .auth-card-container .neon-btn {
          background: #9E2A1F !important;
          color: #fffcf7 !important;
          border: 1px solid #9E2A1F !important;
          border-radius: 4px !important;
          font-weight: 700 !important;
          box-shadow: 3px 3px 0px #241b17 !important;
          transition: all 0.15s ease !important;
        }

        .auth-card-container .neon-btn:hover {
          background: #832017 !important;
          border-color: #832017 !important;
          box-shadow: 1px 1px 0px #241b17 !important;
          transform: translate(2px, 2px) !important;
        }

        .auth-card-container .neon-btn:active {
          background: #6c1810 !important;
          border-color: #6c1810 !important;
          box-shadow: 0px 0px 0px #241b17 !important;
          transform: translate(3px, 3px) !important;
        }

        /* Disabled styling for button */
        .auth-card-container .neon-btn:disabled {
          background: #d8cfc0 !important;
          color: #8f8178 !important;
          border: 1px solid #d8cfc0 !important;
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
        
        {/* Auth form container (fixed width 390px) */}
        <div className="auth-card-container relative w-full max-w-[390px] animate-fade-in my-auto">
          {/* Main Card (children) */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
