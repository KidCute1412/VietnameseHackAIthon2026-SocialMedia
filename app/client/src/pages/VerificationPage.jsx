import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SmartReaderPane from '../components/SmartReaderPane'
import AIReportPane from '../components/AIReportPane'

export default function VerificationPage() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id') || '1'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/verifications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch details')
        return res.json()
      })
      .then((item) => {
        setData(item)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching verification details:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <main className="ml-[80px] mt-[72px] h-[calc(100vh-72px)] flex items-center justify-center bg-[#061226] text-white font-data-mono flex-1">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-glow-highlight text-[48px] animate-spin">sync</span>
          <span>Đang tải kết quả phân tích hệ thống...</span>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="ml-[80px] mt-[72px] h-[calc(100vh-72px)] flex items-center justify-center bg-[#061226] text-white font-data-mono flex-1">
        <div className="text-center">
          <span className="material-symbols-outlined text-red-500 text-[48px] mb-2">warning</span>
          <p>Không tìm thấy bản ghi xác thực.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="ml-[80px] mt-[72px] h-[calc(100vh-72px)] flex overflow-hidden flex-1">
      <SmartReaderPane data={data} />
      <AIReportPane data={data} />
    </main>
  )
}

