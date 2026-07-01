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
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({ email: false, password: false })
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validateField = (name, val) => {
    const nextErrors = { ...errors }
    if (name === 'email') {
      if (!val.trim()) {
        nextErrors.email = 'Vui lòng nhập email.'
      } else if (!emailPattern.test(val)) {
        nextErrors.email = 'Email không đúng định dạng.'
      } else {
        delete nextErrors.email
      }
    }
    if (name === 'password') {
      if (!val) {
        nextErrors.password = 'Vui lòng nhập mật khẩu.'
      } else if (val.length < 6) {
        nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.'
      } else {
        delete nextErrors.password
      }
    }
    setErrors(nextErrors)
    return nextErrors
  }

  const handleBlur = (field) => {
    setTouched((curr) => ({ ...curr, [field]: true }))
    const val = field === 'email' ? email : password
    validateField(field, val)
  }

  const handleEmailChange = (event) => {
    const val = event.target.value
    setEmail(val)
    setGeneralError('')
    if (touched.email) {
      validateField('email', val)
    }
  }

  const handlePasswordChange = (event) => {
    const val = event.target.value
    setPassword(val)
    setGeneralError('')
    if (touched.password) {
      validateField('password', val)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isLoading) return

    setTouched({ email: true, password: true })

    const emailErrors = validateField('email', email)
    const passwordErrors = validateField('password', password)

    if (emailErrors.email || passwordErrors.password) return

    setIsLoading(true)
    setGeneralError('')

    setTimeout(() => {
      if (email.trim() === 'error@hyperoom.vn') {
        setIsLoading(false)
        setGeneralError('Email hoặc mật khẩu không chính xác.')
      } else {
        setIsLoading(false)
        navigate('/')
      }
    }, 1000)
  }

  const isButtonDisabled = !email.trim() || !password

  return (
    <AuthLayout>
      <AuthCard
        title="Đăng nhập"
        footer={
          <>
            Chưa có tài khoản?{' '}
            <Link 
              className={`font-bold text-[#9E2A1F] hover:text-[#b53225] transition underline underline-offset-4 decoration-1 ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
              to="/auth/register"
              aria-disabled={isLoading}
              tabIndex={isLoading ? -1 : 0}
              onClick={(e) => {
                if (isLoading) e.preventDefault()
              }}
            >
              Đăng ký ngay
            </Link>
          </>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            autoComplete="email"
            error={touched.email ? errors.email : undefined}
            id="login-email"
            label="Email"
            placeholder="name@hyperoom.vn"
            type="email"
            value={email}
            disabled={isLoading}
            onChange={handleEmailChange}
            onBlur={() => handleBlur('email')}
          />

          <PasswordInput
            autoComplete="current-password"
            error={touched.password ? errors.password : undefined}
            id="login-password"
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            disabled={isLoading}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur('password')}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-[#5c4a43] cursor-pointer select-none">
              <input
                checked={rememberMe}
                disabled={isLoading}
                className="size-4 accent-[#9E2A1F] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#9E2A1F]/30"
                type="checkbox"
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Ghi nhớ đăng nhập
            </label>
            <Link 
              className={`font-bold text-[#9E2A1F] hover:text-[#b53225] transition underline underline-offset-4 decoration-1 ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
              to="/auth/forgot-password"
              aria-disabled={isLoading}
              tabIndex={isLoading ? -1 : 0}
              onClick={(e) => {
                if (isLoading) e.preventDefault()
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          {generalError && (
            <p className="text-sm font-semibold text-[#bb2d3b] text-center bg-[#fff5f5]/90 border border-[#bb2d3b]/20 py-2.5 px-3 rounded-lg animate-shake">
              {generalError}
            </p>
          )}

          <AuthButton disabled={isButtonDisabled} isLoading={isLoading}>Đăng nhập</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
