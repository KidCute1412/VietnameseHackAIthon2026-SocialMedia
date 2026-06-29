import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthInput from '../../components/auth/AuthInput'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordInput from '../../components/auth/PasswordInput'

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

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
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

    navigate('/auth/login')
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Tạo tài khoản"
        subtitle="Khởi tạo tài khoản biên tập để truy cập bộ công cụ kiểm chứng HypeRoom."
        footer={
          <>
            Đã có tài khoản?{' '}
            <Link className="font-bold text-[#1d4ed8]" to="/auth/login">
              Đăng nhập
            </Link>
          </>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthInput
            autoComplete="name"
            error={errors.fullName}
            id="register-full-name"
            label="Họ và tên"
            placeholder="Nguyễn Minh Anh"
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
          />
          <AuthInput
            autoComplete="email"
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
            error={errors.password}
            id="register-password"
            label="Mật khẩu"
            placeholder="Tối thiểu 6 ký tự"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
          />
          <PasswordInput
            autoComplete="new-password"
            error={errors.confirmPassword}
            id="register-confirm-password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
          />

          <AuthButton>Đăng ký</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
