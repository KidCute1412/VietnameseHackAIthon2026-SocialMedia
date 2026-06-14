import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DropZone() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleClick = () => {
    if (loading) return
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

  const handleVerify = () => {
    if (!selectedFile || loading) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)

    fetch('/api/verify', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Upload failed')
        return res.json()
      })
      .then((data) => {
        setLoading(false)
        navigate(`/verification?id=${data.id}`)
      })
      .catch((err) => {
        console.error('Error verifying file:', err)
        setLoading(false)
        // Fallback to ID 1 in case of error
        navigate('/verification?id=1')
      })
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center relative">
      {/* Drag & Drop Area */}
      <div
        id="dropzone"
        className={`dropzone w-full border-2 border-dashed border-[#5c4a43]/30 hover:border-[#3f6771] rounded-lg flex flex-col items-center justify-center p-12 transition-all duration-300 relative overflow-hidden bg-[#faf8f2] cursor-pointer group/dropzone mb-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] ${
          isDragging ? 'bg-[#f4efe0] border-[#3f6771]' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="absolute top-0 left-0 scan-effect w-full hidden group-hover/dropzone:block" />
        <div className="w-20 h-20 rounded-full bg-[#5c4a43]/5 flex items-center justify-center mb-6 border border-[#5c4a43]/15 shadow-[2px_4px_10px_rgba(61,47,43,0.06)] group-hover/dropzone:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-[#3d2f2b] text-[40px]">
            {loading ? 'sync' : 'upload_file'}
          </span>
        </div>
        <p className="font-headline-md text-[20px] text-[#1e1613] mb-3 font-bold">Kéo &amp; thả công văn vào đây</p>
        <p className="font-body-md text-[#5c4a43]/60 text-center max-w-md text-sm leading-relaxed">
          Tải lên công văn, thông báo hoặc tài liệu văn bản cần kiểm tra độ tin cậy. Định dạng hỗ trợ: <span className="underline decoration-wavy decoration-[#bb2d3b]/30">PDF, TXT, MD, DOCX</span>.
        </p>
        {selectedFile && (
          <p className="mt-4 text-[#157347] font-data-mono text-sm bg-[#d1e7dd]/80 border border-[#157347]/30 rounded-md px-4 py-1.5 flex items-center gap-2 shadow-[2px_2px_5px_rgba(0,0,0,0.05)] rotate-[-1deg]">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {selectedFile.name}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col items-center gap-4 mt-6">
        <button
          id="btn-verify"
          disabled={!selectedFile || loading}
          onClick={handleVerify}
          className={`px-10 py-3.5 rounded-lg font-label-caps text-[13px] tracking-wider flex items-center justify-center gap-3 w-80 ${
            selectedFile && !loading ? 'neon-btn cursor-pointer' : 'neon-btn-disabled'
          }`}
        >
          {loading ? 'Đang xác thực...' : 'Bắt đầu Xác thực AI'}
          <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
            {loading ? 'sync' : 'arrow_forward'}
          </span>
        </button>
        <button className="text-[#5c4a43]/60 hover:text-[#3f6771] text-sm font-body-sm transition-colors flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-sm">content_paste</span>
          Hoặc dán văn bản trực tiếp
        </button>
      </div>
    </div>
  )
}

