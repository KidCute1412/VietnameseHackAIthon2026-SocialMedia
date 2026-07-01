import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'
import { authApi } from '../../lib/api'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isLoading) return

    const nextErrors = {}

    if (!newPassword) {
      nextErrors.newPassword = 'Vui lòng nhập mật khẩu mới.'
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = 'Mật khẩu cần ít nhất 6 ký tự.'
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.'
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận phải khớp.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const email = sessionStorage.getItem('resetEmail')
    const otp = sessionStorage.getItem('resetOtp')

    if (!email || !otp) {
      setErrors({ newPassword: 'Phiên đặt lại mật khẩu không hợp lệ. Vui lòng xác minh OTP lại.' })
      return
    }

    setIsLoading(true)
    try {
      await authApi.resetPassword({
        email,
        otp,
        new_password: newPassword,
      })
      sessionStorage.removeItem('resetEmail')
      sessionStorage.removeItem('resetOtp')
      navigate('/auth/login')
    } catch (apiError) {
      setErrors({ newPassword: apiError.message || 'Không thể đặt lại mật khẩu.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Đặt lại mật khẩu"
        footer={
          <Link className="font-bold text-[#9E2A1F] hover:text-[#b53225] transition underline underline-offset-4 decoration-1" to="/auth/login">
            Quay lại đăng nhập
          </Link>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <PasswordInput
            autoComplete="new-password"
            error={errors.newPassword}
            id="reset-new-password"
            label="Mật khẩu mới"
            placeholder="Tối thiểu 6 ký tự"
            value={newPassword}
            disabled={isLoading}
            onChange={(event) => {
              setNewPassword(event.target.value)
              setErrors((current) => ({ ...current, newPassword: undefined }))
            }}
          />

          <PasswordInput
            autoComplete="new-password"
            error={errors.confirmPassword}
            id="reset-confirm-password"
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            disabled={isLoading}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setErrors((current) => ({ ...current, confirmPassword: undefined }))
            }}
          />

          <AuthButton isLoading={isLoading} loadingLabel="Đang đặt lại...">Đặt lại mật khẩu</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
