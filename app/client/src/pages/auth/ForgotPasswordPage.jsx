import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthInput from '../../components/auth/AuthInput'
import AuthLayout from '../../components/auth/AuthLayout'
import { authApi } from '../../lib/api'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isLoading) return

    if (!email.trim()) {
      setError('Vui lòng nhập email.')
      return
    }

    if (!emailPattern.test(email)) {
      setError('Email chưa đúng định dạng.')
      return
    }

    setIsLoading(true)
    try {
      await authApi.forgotPassword({ email })
      sessionStorage.setItem('resetEmail', email)
      sessionStorage.removeItem('resetOtp')
      navigate('/auth/verify-otp')
    } catch (apiError) {
      setError(apiError.message || 'Không thể gửi OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Quên mật khẩu"
        footer={
          <>
            Đã nhớ mật khẩu?{' '}
            <Link className="font-bold text-[#9E2A1F] hover:text-[#b53225] transition underline underline-offset-4 decoration-1" to="/auth/login">
              Đăng nhập
            </Link>
          </>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            autoComplete="email"
            error={error}
            id="forgot-email"
            label="Email"
            placeholder="name@hyperoom.vn"
            type="email"
            value={email}
            disabled={isLoading}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
          />

          <AuthButton isLoading={isLoading} loadingLabel="Đang gửi OTP...">Gửi mã OTP</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
