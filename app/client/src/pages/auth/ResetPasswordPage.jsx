import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (event) => {
    event.preventDefault()
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

    sessionStorage.removeItem('resetEmail')
    navigate('/auth/login')
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Đặt lại mật khẩu"
        subtitle="Tạo mật khẩu mới cho tài khoản của bạn. Prototype sẽ đưa bạn về trang đăng nhập sau khi hoàn tất."
        footer={
          <Link className="font-bold text-[#1d4ed8]" to="/auth/login">
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
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setErrors((current) => ({ ...current, confirmPassword: undefined }))
            }}
          />

          <AuthButton>Đặt lại mật khẩu</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
