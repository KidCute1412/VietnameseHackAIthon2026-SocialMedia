import { useState, useEffect } from 'react'
import DropZone from '../components/DropZone'
import VerificationHistory from '../components/VerificationHistory'
import AIReportPane from '../components/AIReportPane'

const fallbackData = {
  '1': {
    id: '1',
    fileName: 'Cong_van_08_signed.pdf',
    timestamp: '5 phút trước',
    status: 'verified',
    confidence: 98,
    trustScore: 85,
    publicImpact: 92,
    ocrText: `BỘ TÀI CHÍNH\nSố: 08/QĐ-BTC\nHà Nội, ngày 12 tháng 6 năm 2026\n\nQUYẾT ĐỊNH\nVề việc phê duyệt đề án số hóa và quản lý an ninh thông tin báo chí.\n\nBộ Tài chính khẳng định không có đề xuất tăng thuế VAT lên 12% đối với các mặt hàng tiêu dùng từ tháng sau. Đây là các thông tin sai lệch lan truyền trên không gian mạng nhằm gây hoang mang dư luận.`,
    evidenceSources: [
      {
        id: 1,
        icon: 'account_balance',
        name: 'Cổng thông tin Chính phủ',
        description: 'Quyết định số 123/QĐ-TTg phê duyệt chiến lược chuyển đổi số quốc gia...',
        match: '98% Match',
        hash: 'hash:af92...'
      },
      {
        id: 2,
        icon: 'newspaper',
        name: 'VTV News',
        description: 'Bộ Tài chính bác bỏ tin đồn thất thất về điều chỉnh thuế suất VAT lên 12%...',
        match: '82% Match',
        hash: 'hash:bc41...'
      }
    ]
  },
  '2': {
    id: '2',
    fileName: 'Press_Release_Q3.docx',
    timestamp: '12/06/2026 01:30',
    status: 'processing',
    confidence: null,
    trustScore: 50,
    publicImpact: 60,
    ocrText: `THÔNG CÁO BÁO CHÍ\nVề việc ra mắt HypeRoom phiên bản V3.4 Alpha.\n\nSự cố rò rỉ entropy lớn được đồn đoán là không có cơ sở khoa học. Ban kỹ thuật đang rà soát hệ thống và sẽ công bố kết quả kiểm toán an ninh mạng trong tuần tới.`,
    evidenceSources: [
      {
        id: 1,
        icon: 'terminal',
        name: 'Nút bảo mật HypeRoom',
        description: 'Log kiểm tra định kỳ không ghi nhận lỗi rò rỉ entropy hệ thống...',
        match: '90% Match',
        hash: 'hash:de82...'
      }
    ]
  },
  '3': {
    id: '3',
    fileName: 'Bao_cao_Tai_chinh.pdf',
    timestamp: 'Hôm qua',
    status: 'warning',
    confidence: 42,
    trustScore: 42,
    publicImpact: 78,
    ocrText: `BÁO BÁO TÀI CHÍNH TÓM TẮT\nQuý II năm 2026\n\nNợ phải trả tăng mạnh so với cùng kỳ năm ngoái, vượt ngưỡng cảnh báo an toàn tài chính của doanh nghiệp. Đề xuất tái cấu trúc danh mục đầu tư dài hạn.`,
    evidenceSources: [
      {
        id: 1,
        icon: 'newspaper',
        name: 'Báo Đầu Tư',
        description: 'Phân tích cơ cấu nợ và các khoản phải thu của doanh nghiệp trong quý II...',
        match: '75% Match',
        hash: 'hash:ea33...'
      }
    ]
  }
}

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [verificationData, setVerificationData] = useState(null)
  const [loadingData, setLoadingData] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch report data when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setVerificationData(null)
      return
    }
    setLoadingData(true)
    fetch(`/api/verifications/${selectedId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch details')
        return res.json()
      })
      .then((item) => {
        setVerificationData(item)
        setLoadingData(false)
      })
      .catch((err) => {
        console.warn('API error, using local fallback data:', err)
        // Fallback to local mock data
        const fallbackItem = fallbackData[selectedId] || {
          id: selectedId,
          fileName: 'Tài liệu vừa tải lên',
          timestamp: 'Vừa xong',
          status: 'verified',
          confidence: 85,
          trustScore: 80,
          publicImpact: 70,
          ocrText: 'Nội dung phân tích tài liệu...',
          evidenceSources: [
            {
              id: 1,
              icon: 'account_balance',
              name: 'Nguồn tin chính thống',
              description: 'Hệ thống đã ghi nhận kiểm chứng thành công thông tin này.',
              match: '85%',
              hash: 'hash:local1'
            }
          ]
        }
        setVerificationData(fallbackItem)
        setLoadingData(false)
      })
  }, [selectedId])

  const handleVerifySuccess = (id) => {
    setSelectedId(id)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <main className="flex-1 ml-[80px] mt-[72px] p-gutter-desktop h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar bg-surface-container">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 items-start">
        {!selectedId ? (
          <>
            {/* Full view: Central Input Gateway (8 cols) */}
            <div className="col-span-12 lg:col-span-8 paper-sheet p-8 flex flex-col relative min-h-[600px] h-auto rotate-[-0.6deg] transition-all hover:rotate-[0deg] hover:scale-[1.01] duration-300">
              {/* Scrapbook Tape & Pins */}
              <div className="paper-tape tape-top-left" />
              <div className="paper-tape tape-bottom-right" style={{ bottom: '-10px', right: '30px' }} />
              <div className="paper-pin pin-red pin-center-top" style={{ top: '-6px' }} />
              
              <div className="flex items-center justify-between mb-8 relative z-10 border-b-2 border-dashed border-[#5c4a43]/20 pb-4">
                <h2 className="font-headline-lg text-[26px] text-[#1e1613] font-extrabold flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#3f6771] text-[32px]">document_scanner</span>
                  Kiểm tra tính xác thực của Công văn & Tài liệu
                </h2>
              </div>
              <DropZone onVerifySuccess={handleVerifySuccess} />
            </div>

            {/* Full view: Verification History (4 cols) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col relative rotate-[0.8deg] transition-all hover:rotate-[0deg] hover:scale-[1.01] duration-300">
              <div className="paper-tape tape-top-right" style={{ top: '-14px', right: '20px' }} />
              <div className="paper-pin pin-blue" style={{ top: '-5px', left: '30px' }} />
              <VerificationHistory
                onSelectItem={setSelectedId}
                selectedId={selectedId}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </>
        ) : (
          <>
            {/* Split view: Left Side (6 cols stacked upload and history) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
              {/* Compact Input Card */}
              <div className="paper-sheet p-6 flex flex-col relative rotate-[-0.4deg] hover:rotate-[0deg] hover:scale-[1.01] transition-all duration-300 shadow-md">
                <div className="paper-tape tape-top-left" style={{ top: '-10px', left: '15px', width: '50px' }} />
                <div className="paper-pin pin-red pin-center-top" style={{ top: '-6px' }} />
                <h3 className="font-headline-md text-base text-[#1e1613] font-bold border-b border-[#5c4a43]/15 pb-2 mb-4">
                  Kiểm tra tài liệu khác
                </h3>
                <DropZone onVerifySuccess={handleVerifySuccess} compact={true} />
              </div>

              {/* History list Card */}
              <div className="flex flex-col relative rotate-[0.4deg] hover:rotate-[0deg] hover:scale-[1.01] transition-all duration-300">
                <div className="paper-tape tape-top-right" style={{ top: '-14px', right: '20px', width: '50px' }} />
                <div className="paper-pin pin-blue" style={{ top: '-5px', left: '20px' }} />
                <VerificationHistory
                  onSelectItem={setSelectedId}
                  selectedId={selectedId}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>

            {/* Split view: Right Side (6 cols AI report details) */}
            <div className="col-span-12 lg:col-span-6 flex flex-col relative rotate-[-0.2deg] hover:rotate-[0deg] transition-all duration-300">
              <div className="paper-tape tape-top-right" style={{ top: '-12px', right: '20px', width: '70px' }} />
              
              {loadingData ? (
                <div className="paper-sheet p-8 flex items-center justify-center min-h-[600px] shadow-lg border border-[#5c4a43]/20">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined animate-spin text-[#3f6771] text-[32px]">sync</span>
                    <span className="font-data-mono text-xs text-[#5c4a43]/70">Đang tải kết quả phân tích...</span>
                  </div>
                </div>
              ) : (
                verificationData && (
                  <AIReportPane
                    data={verificationData}
                    onClose={() => setSelectedId(null)}
                    className="paper-sheet shadow-lg border border-[#5c4a43]/20 min-h-[600px]"
                  />
                )
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
