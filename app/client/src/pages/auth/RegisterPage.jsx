import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthInput from '../../components/auth/AuthInput'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'
import { authApi } from '../../lib/api'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setGeneralError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isLoading) return

    const nextErrors = {}

    if (!form.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ tên.'

    if (!form.email.trim()) {
      nextErrors.email = 'Vui lòng nhập email.'
    } else if (!emailPattern.test(form.email)) {
      nextErrors.email = 'Email chưa đúng định dạng.'
    }

    if (!form.password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.'
    } else if (form.password.length < 6) {
      nextErrors.password = 'Mật khẩu cần ít nhất 6 ký tự.'
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận phải khớp.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsLoading(true)
    setGeneralError('')

    try {
      await authApi.register({
        email: form.email,
        password: form.password,
      })
      navigate('/auth/login')
    } catch (error) {
      setGeneralError(error.message || 'Không thể tạo tài khoản.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Tạo tài khoản"
        footer={
          <>
            Đã có tài khoản?{' '}
            <Link className="font-bold text-[#9E2A1F] hover:text-[#b53225] transition underline underline-offset-4 decoration-1" to="/auth/login">
              Đăng nhập
            </Link>
          </>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            autoComplete="name"
            disabled={isLoading}
            error={errors.fullName}
            id="register-full-name"
            label="Họ và tên"
            placeholder="Nguyễn Minh Anh"
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
          />
          <AuthInput
            autoComplete="email"
            disabled={isLoading}
            error={errors.email}
            id="register-email"
            label="Email"
            placeholder="name@hyperoom.vn"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
          <PasswordInput
            autoComplete="new-password"
            disabled={isLoading}
            error={errors.password}
            id="register-password"
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
          />
          <PasswordInput
            autoComplete="new-password"
            disabled={isLoading}
            error={errors.confirmPassword}
            id="register-confirm-password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
          />

          {generalError && (
            <p className="text-sm font-semibold text-[#bb2d3b] text-center bg-[#fff5f5]/90 border border-[#bb2d3b]/20 py-2.5 px-3 rounded-lg">
              {generalError}
            </p>
          )}

          <AuthButton isLoading={isLoading} loadingLabel="Đang đăng ký...">Đăng ký</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
