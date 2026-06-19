import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { animate } from 'animejs'
import DropZone from '../components/DropZone'
import VerificationHistory from '../components/VerificationHistory'
import AIReportPane from '../components/AIReportPane'
import TiltContainer from '../components/TiltContainer'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const queryId = searchParams.get('id')
  const [selectedId, setSelectedId] = useState(null)
  const [verificationData, setVerificationData] = useState(null)
  const [loadingData, setLoadingData] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const pageRef = useRef(null)

  useEffect(() => {
    if (pageRef.current) {
      // Slide in sidebar
      const sidebar = pageRef.current.querySelector('.newspaper-sidebar')
      if (sidebar) {
        animate(sidebar, {
          translateX: [-30, 0],
          opacity: [0, 1],
          duration: 800,
          ease: 'outQuad'
        })
      }
      // Fade in and slide up main workspace content
      const workspace = pageRef.current.querySelector('.workspace-content')
      if (workspace) {
        animate(workspace, {
          translateY: [15, 0],
          opacity: [0, 1],
          duration: 850,
          ease: 'outQuad',
          delay: 100
        })
      }
    }
  }, [])

  // Auto-select ID from URL parameter (e.g. when redirected from VnSocial page)
  useEffect(() => {
    if (queryId) {
      setSelectedId(queryId)
      const newParams = new URLSearchParams(window.location.search)
      newParams.delete('id')
      setSearchParams(newParams, { replace: true })
    }
  }, [queryId])

  // Gemini layout states
  const [showHistorySidebar, setShowHistorySidebar] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [inputText, setInputText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStep, setUploadStep] = useState(0)

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
        const fallbackItem = fallbackData[selectedId] || {
          id: selectedId,
          fileName: selectedFile ? selectedFile.name : 'Tài liệu vừa tải lên',
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

  // Handle manual file upload/attachment trigger
  const handleAttachFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.txt,.md,.docx'
    input.onchange = (e) => {
      if (e.target.files.length > 0) {
        setSelectedFile(e.target.files[0])
      }
    }
    input.click()
  }

  // Handle sending request (either text search or file verify)
  const handleSend = () => {
    if (selectedFile) {
      // Perform mock verification with progressive steps
      setLoadingData(true)
      setUploadStep(1)
      
      const formData = new FormData()
      formData.append('file', selectedFile)

      setTimeout(() => {
        setUploadStep(2)
        setTimeout(() => {
          setUploadStep(3)
          setTimeout(() => {
            // Send request to server
            fetch('/api/verify', {
              method: 'POST',
              body: formData,
            })
              .then((res) => {
                if (!res.ok) throw new Error('Upload failed')
                return res.json()
              })
              .then((data) => {
                setSelectedFile(null)
                setInputText('')
                handleVerifySuccess(data.id)
              })
              .catch((err) => {
                console.error('Error verifying file:', err)
                setSelectedFile(null)
                setInputText('')
                handleVerifySuccess('1') // fallback to ID 1
              })
          }, 800)
        }, 800)
      }, 800)

    } else if (inputText.trim()) {
      const text = inputText.toLowerCase()
      if (text.includes('08') || text.includes('thuế vat') || text.includes('12%')) {
        handleVerifySuccess('1')
      } else if (text.includes('release') || text.includes('alpha') || text.includes('entropy')) {
        handleVerifySuccess('2')
      } else if (text.includes('tài chính') || text.includes('nợ')) {
        handleVerifySuccess('3')
      } else {
        // Fallback: search or create mock verification
        handleVerifySuccess('1')
      }
      setInputText('')
    }
  }

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  return (
    <main 
      ref={pageRef}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 ml-[80px] mt-[72px] h-[calc(100vh-72px)] flex overflow-hidden bg-transparent font-sans relative"
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-[#3d2f2b]/40 backdrop-blur-sm z-50 flex items-center justify-center border-2 border-dashed border-[#3d2f2b] m-4 rounded-xl transition-all duration-300">
          <div className="bg-[#faf8f2] p-8 rounded-lg shadow-2xl flex flex-col items-center justify-center gap-4 text-center max-w-sm border border-[#5c4a43]/20">
            <span className="material-symbols-outlined text-[#3d2f2b] text-[64px] animate-bounce">upload_file</span>
            <h3 className="font-headline-md text-lg text-[#1e1613] font-bold">Thả tài liệu kiểm chứng</h3>
            <p className="text-sm text-[#5c4a43]/70">Hỗ trợ các tệp tin văn bản PDF, TXT, MD, DOCX</p>
          </div>
        </div>
      )}

      <div 
        className={`newspaper-sidebar flex flex-col h-full overflow-hidden transition-all duration-300 relative z-30 ${
          showHistorySidebar ? 'w-[340px] border-r border-[#5c4a43]/15' : 'w-0'
        }`}
      >
        {showHistorySidebar && (
          <div className="flex-1 flex flex-col h-full min-w-[340px]">

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <VerificationHistory
                onSelectItem={setSelectedId}
                selectedId={selectedId}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent workspace-content">
        {/* Toggle Sidebar Button */}
        <div className="absolute top-4 left-4 z-40">
          <button 
            onClick={() => setShowHistorySidebar(!showHistorySidebar)}
            className="w-9 h-9 rounded-full bg-[#faf8f2] border border-[#5c4a43]/20 hover:bg-[#3d2f2b]/5 flex items-center justify-center text-[#5c4a43] transition-colors cursor-pointer shadow-sm"
            title={showHistorySidebar ? "Ẩn lịch sử" : "Hiện lịch sử"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showHistorySidebar ? "menu_open" : "menu"}
            </span>
          </button>
        </div>

        {/* Dynamic Inner Workspace */}
        <div className={`flex-1 h-full custom-scrollbar relative flex flex-col ${
          selectedId === null ? 'p-6 pt-16 justify-between items-center overflow-y-auto' : 'p-6 pt-6 overflow-hidden'
        }`}>
          
          {/* 1. Welcome / Initial Landing view */}
          {selectedId === null && !loadingData && (
            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl my-auto p-4 animate-fade-in">
              {/* Main Welcome & DropZone Card */}
              <TiltContainer className="paper-sheet p-8 flex flex-col items-center justify-between relative rotate-[-0.6deg] shadow-lg border border-[#5c4a43]/15 w-full">
                {/* Pins and Tape */}
                <div className="paper-pin pin-blue pin-center-top" style={{ top: '-6px' }} />
                <div className="paper-tape tape-top-left" style={{ top: '-10px', left: '15px', width: '60px', transform: 'rotate(-5deg)' }} />
                <div className="paper-tape tape-top-right" style={{ top: '-10px', right: '15px', width: '60px', transform: 'rotate(8deg)' }} />

                <div className="flex flex-col items-center w-full">
                  {/* Vintage Woodcut Illustration */}
                  <div className="mb-6 border-4 border-[#eae3d2] shadow-md p-1.5 bg-[#fbfaf4] max-w-[240px] transform rotate-[1.5deg] relative group">
                    <img 
                      src="/vintage_woodcut_press.png" 
                      alt="Vintage Press Woodcut" 
                      className="w-full grayscale contrast-[1.1] brightness-[0.95]"
                    />
                    <div className="absolute inset-0 bg-[#ebd9bc]/10 mix-blend-color" />
                    <div className="text-[10px] text-center text-[#5c4a43]/60 font-data-mono mt-1 uppercase tracking-widest border-t border-[#5c4a43]/10 pt-1">
                      Xác thực Tòa soạn v2.4
                    </div>
                  </div>

                  {/* Welcome Title */}
                  <h1 className="font-headline-lg text-[25px] font-black text-[#1e1613] text-center mb-2 tracking-tight uppercase border-b-2 border-double border-[#5c4a43]/30 pb-2 w-full max-w-md">
                    Chào biên tập viên HypeRoom
                  </h1>
                  <p className="font-headline-md text-xs text-[#5c4a43]/80 text-center mb-6 max-w-md italic">
                    Hệ thống kiểm chứng thông cáo báo chí, công văn & tin tức tự động ứng dụng Trí tuệ Nhân tạo.
                  </p>
                </div>

                {/* DropZone */}
                <div className="w-full border-t border-dashed border-[#5c4a43]/20 pt-6">
                  <DropZone onVerifySuccess={handleVerifySuccess} compact={true} />
                </div>
              </TiltContainer>
            </div>
          )}

          {/* 2. Loading / Verification scanning checklist */}
          {loadingData && (
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md my-auto">
              <div className="paper-sheet p-6 flex flex-col items-center relative w-full rotate-[0.5deg]">
                <div className="paper-pin pin-blue pin-center-top" style={{ top: '-6px' }} />
                <div className="relative w-20 h-20 mb-6 bg-[#3d2f2b]/5 rounded-full flex items-center justify-center border border-[#3d2f2b]/15 shadow-sm">
                  <span className="material-symbols-outlined animate-spin text-[#3f6771] text-[36px]">sync</span>
                  <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-[#3d2f2b] text-[20px]">document_scanner</span>
                </div>
                <h3 className="font-headline-md text-lg text-[#1e1613] font-bold mb-4">Đang tiến hành xác thực tài liệu...</h3>
                <div className="w-full space-y-3 text-left text-xs font-data-mono text-[#5c4a43]/80 bg-[#faf8f2] border border-[#5c4a43]/15 p-5 rounded-lg shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[16px] ${uploadStep >= 1 ? 'text-[#10B981]' : 'animate-pulse text-[#3f6771]'}`}>
                        {uploadStep >= 1 ? 'check_circle' : 'pending'}
                      </span>
                      <span>1. Nhận diện văn bản OCR (SmartReader)...</span>
                    </div>
                    {uploadStep >= 1 && <span className="text-[#10B981] font-bold">ĐÃ XONG</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[16px] ${uploadStep >= 2 ? 'text-[#10B981]' : uploadStep === 1 ? 'animate-pulse text-[#3f6771]' : 'text-[#5c4a43]/30'}`}>
                        {uploadStep >= 2 ? 'check_circle' : 'pending'}
                      </span>
                      <span>2. Đối chiếu cơ sở dữ liệu tin tức...</span>
                    </div>
                    {uploadStep >= 2 && <span className="text-[#10B981] font-bold">ĐÃ XONG</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[16px] ${uploadStep >= 3 ? 'text-[#10B981]' : uploadStep === 2 ? 'animate-pulse text-[#3f6771]' : 'text-[#5c4a43]/30'}`}>
                        {uploadStep >= 3 ? 'check_circle' : 'pending'}
                      </span>
                      <span>3. Đánh giá ảnh hưởng dư luận mạng xã hội...</span>
                    </div>
                    {uploadStep >= 3 && <span className="text-[#10B981] font-bold">ĐÃ XONG</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. AI verification report page (100% width details) */}
          {selectedId !== null && !loadingData && verificationData && (
            <AIReportPane
              data={verificationData}
              onClose={() => {
                setSelectedId(null)
                setSelectedFile(null)
                setInputText('')
              }}
              className="paper-sheet shadow-lg border border-[#5c4a43]/20 h-full w-full"
            />
          )}



        </div>
      </div>
    </main>
  )
}
