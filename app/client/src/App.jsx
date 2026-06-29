import { Navigate, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import VerificationPage from './pages/VerificationPage'
import VnSocialPage from './pages/VnSocialPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import VerifyOtpPage from './pages/auth/VerifyOtpPage'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Navigate replace to="/auth/login" />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/vnsocial" element={<VnSocialPage />} />
      </Route>
    </Routes>
  )
}

export default App
