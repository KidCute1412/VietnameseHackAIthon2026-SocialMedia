import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import VerificationPage from './pages/VerificationPage'
import VnSocialPage from './pages/VnSocialPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/vnsocial" element={<VnSocialPage />} />
      </Route>
    </Routes>
  )
}

export default App
