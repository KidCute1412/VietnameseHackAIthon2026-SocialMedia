import { useLocation } from 'react-router-dom'

const authHeroContent = {
  '/auth/login': {
    eyebrow: 'Phòng điều hành biên tập',
    headline: 'Đăng nhập để tiếp tục kiểm chứng thông tin.',
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
    <div className="relative isolate min-h-screen overflow-hidden bg-[#d7cdba] px-4 py-8 text-[#1e1613] sm:px-6 lg:px-8">
      <div aria-hidden="true" className="vintage-bg-overlay" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden lg:block">
          <div className="max-w-[480px]">
            <img
              alt="HypeRoom"
              className="mb-8 h-16 w-auto object-contain brightness-[0.2] contrast-125"
              src="/brand_identity.png"
            />
            <p className="font-label-caps text-label-caps uppercase tracking-[0.22em] text-[#5c4a43]">
              {heroContent.eyebrow}
            </p>
            <h2 className="mt-4 font-headline-xl text-[46px] leading-[1.05] text-[#1e1613]">
              {heroContent.headline}
            </h2>
            <div className="double-divider max-w-sm" />
          </div>
        </div>

        <div className="flex w-full justify-center lg:justify-end">{children}</div>
      </div>
    </div>
  )
}
