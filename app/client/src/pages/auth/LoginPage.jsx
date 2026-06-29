import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthInput from '../../components/auth/AuthInput'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Vui lòng nhập email.'
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Email chưa đúng định dạng.'
    }

    if (!password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.'
    } else if (password.length < 6) {
      nextErrors.password = 'Mật khẩu cần ít nhất 6 ký tự.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    navigate('/')
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Đăng nhập"
        subtitle="Tiếp tục vào phòng điều hành HypeRoom để xác thực tài liệu và luồng tin."
        footer={
          <>
            Chưa có tài khoản?{' '}
            <Link className="font-bold text-[#1d4ed8]" to="/auth/register">
              Tạo tài khoản
            </Link>
          </>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            autoComplete="email"
            error={errors.email}
            id="login-email"
            label="Email"
            placeholder="name@hyperoom.vn"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: undefined }))
            }}
          />

          <PasswordInput
            autoComplete="current-password"
            error={errors.password}
            id="login-password"
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setErrors((current) => ({ ...current, password: undefined }))
            }}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-[#5c4a43]">
              <input
                checked={rememberMe}
                className="size-4 accent-[#3d2f2b]"
                type="checkbox"
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Ghi nhớ đăng nhập
            </label>
            <Link className="font-bold text-[#1d4ed8]" to="/auth/forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <AuthButton>Đăng nhập</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
