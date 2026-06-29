import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthInput from '../../components/auth/AuthInput'
import AuthLayout from '../../components/auth/AuthLayout'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim()) {
      setError('Vui lòng nhập email.')
      return
    }

    if (!emailPattern.test(email)) {
      setError('Email chưa đúng định dạng.')
      return
    }

    sessionStorage.setItem('resetEmail', email)
    navigate('/auth/verify-otp')
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Quên mật khẩu"
        subtitle="Nhập email tài khoản để nhận mã OTP khôi phục mật khẩu."
        footer={
          <>
            Đã nhớ mật khẩu?{' '}
            <Link className="font-bold text-[#1d4ed8]" to="/auth/login">
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
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
          />

          <AuthButton>Gửi mã OTP</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
