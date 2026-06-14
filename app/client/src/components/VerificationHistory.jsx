import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VerificationHistory({ onSelectItem, selectedId, refreshTrigger }) {
  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/verifications')
      .then((res) => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then((data) => {
        const items = data.map((item) => ({
          id: item.id,
          fileName: item.fileName,
          time: item.timestamp,
          status: item.status,
          label: item.status === 'verified'
            ? 'Đã xác minh'
            : item.status === 'processing'
            ? 'Đang xử lý...'
            : 'Cảnh báo',
        }))
        setHistoryItems(items)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch verification history:', err)
        setHistoryItems([
          {
            id: '1',
            fileName: 'Cong_van_08_signed.pdf',
            time: '5 phút trước',
            status: 'verified',
            label: 'Đã xác minh',
          },
          {
            id: '2',
            fileName: 'Press_Release_Q3.docx',
            time: '12/06/2026 01:30',
            status: 'processing',
            label: 'Đang xử lý...',
          },
          {
            id: '3',
            fileName: 'Bao_cao_Tai_chinh.pdf',
            time: 'Hôm qua',
            status: 'warning',
            label: 'Cảnh báo',
          },
        ])
        setLoading(false)
      })
  }, [refreshTrigger])

  const getStatusClasses = (status) => {
    switch (status) {
      case 'verified':
        return 'stamp-verified px-3 py-0.5 text-[10px] font-extrabold tracking-wider'
      case 'processing':
        return 'stamp-processing px-3 py-0.5 text-[10px] font-extrabold tracking-wider animate-pulse'
      case 'warning':
        return 'stamp-warning px-3 py-0.5 text-[10px] font-extrabold tracking-wider'
      default:
        return ''
    }
  }

  return (
    <div className="paper-notebook rounded-lg p-6 pl-10 flex flex-col h-full relative">
      {/* Spiral notebook binder holes */}
      <div className="notebook-holes" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[#5c4a43]/15 pb-3 relative z-10">
        <h3 className="font-headline-md text-lg text-[#1e1613] font-extrabold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3f6771]">history</span>
          Lịch sử kiểm tra
        </h3>
        <button className="text-[#5c4a43]/40 hover:text-[#1e1613] transition-colors cursor-pointer">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* History Items */}
      <div className="flex flex-col gap-4 relative z-10">
        {loading ? (
          <div className="text-center py-6 text-[#5c4a43]/50 font-data-mono text-xs">Đang tải lịch sử...</div>
        ) : (
          historyItems.map((item, index) => {
            // Organic tilt angle
            const rotateDeg = (index % 3 - 1) * 0.8;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectItem) {
                    onSelectItem(item.id)
                  } else {
                    navigate(`/verification?id=${item.id}`)
                  }
                }}
                style={{ transform: `rotate(${rotateDeg}deg)` }}
                className={`p-4 rounded bg-[#faf8f2] border hover:border-[#3f6771] shadow-[2px_3px_6px_rgba(42,32,21,0.06)] hover:shadow-[4px_6px_12px_rgba(42,32,21,0.1)] transition-all duration-300 group/item cursor-pointer hover:scale-[1.01] ${
                  selectedId === item.id ? 'border-[#3f6771] ring-1 ring-[#3f6771]' : 'border-[#5c4a43]/15'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-body-sm text-[#1e1613] font-bold truncate pr-2">{item.fileName}</span>
                  <span className="material-symbols-outlined text-[#5c4a43]/30 group-hover/item:text-[#3f6771] text-sm transition-colors">open_in_new</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#5c4a43]/60 font-data-mono">{item.time}</span>
                  <span className={getStatusClasses(item.status)}>{item.label}</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* View All */}
      <button className="mt-6 w-full py-2.5 rounded border border-[#5c4a43]/20 text-[#5c4a43]/80 font-label-caps text-[11px] font-bold hover:bg-[#5c4a43]/5 hover:border-[#1e1613] hover:text-[#1e1613] transition-all cursor-pointer relative z-10">
        XEM TẤT CẢ HOẠT ĐỘNG
      </button>
    </div>
  )
}

