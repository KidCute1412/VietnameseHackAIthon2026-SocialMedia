import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthCard from '../../components/auth/AuthCard'
import AuthLayout from '../../components/auth/AuthLayout'
import OtpInput from '../../components/auth/OtpInput'
import { authApi } from '../../lib/api'

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setResetEmail(sessionStorage.getItem('resetEmail') || '')
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isLoading) return

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP cần đủ 6 số.')
      return
    }

    if (!resetEmail) {
      setError('Vui lòng nhập email trước khi xác minh OTP.')
      return
    }

    setIsLoading(true)
    try {
      await authApi.verifyOtp({ email: resetEmail, otp })
      sessionStorage.setItem('resetOtp', otp)
      navigate('/auth/reset-password')
    } catch (apiError) {
      setError(apiError.message || 'OTP không hợp lệ hoặc đã hết hạn.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setMessage('')

    if (!resetEmail) {
      setError('Vui lòng quay lại nhập email.')
      return
    }

    setIsLoading(true)
    try {
      await authApi.forgotPassword({ email: resetEmail })
      setMessage('Đã gửi lại OTP.')
    } catch (apiError) {
      setError(apiError.message || 'Không thể gửi lại OTP.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Xác minh OTP"
        footer={
          <Link className="font-bold text-[#9E2A1F] hover:text-[#b53225] transition underline underline-offset-4 decoration-1" to="/auth/forgot-password">
            Quay lại nhập email
          </Link>
        }
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <OtpInput
            error={error}
            value={otp}
            onChange={(nextValue) => {
              setOtp(nextValue)
              setError('')
              setMessage('')
            }}
          />

          {message && (
            <p className="rounded border border-[#157347] bg-[#d1e7dd] px-3 py-2 text-sm font-semibold text-[#157347]">
              {message}
            </p>
          )}

          <AuthButton isLoading={isLoading} loadingLabel="Đang xác minh...">Xác minh</AuthButton>

          <button
            type="button"
            disabled={isLoading}
            className="w-full rounded border border-dashed border-[#9E2A1F] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#9E2A1F] transition hover:bg-[#9E2A1F]/5 hover:border-[#b53225] hover:text-[#b53225] cursor-pointer"
            onClick={handleResendOtp}
          >
            Gửi lại mã OTP
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
