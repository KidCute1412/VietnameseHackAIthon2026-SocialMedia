import { useState } from 'react'
import RadialProgress from './RadialProgress'

export default function AIReportPane({ data }) {
  const trustScore = data.trustScore || 85
  const publicImpact = data.publicImpact || 92
  const evidenceSources = data.evidenceSources || []

  const [outlineLoading, setOutlineLoading] = useState(false)
  const [outlineGenerated, setOutlineGenerated] = useState(false)
  const [outlineText, setOutlineText] = useState([])

  const outlines = {
    '1': [
      '1. Mở đầu: Giới thiệu Quyết định số 08/QĐ-BTC của Bộ Tài chính ngày 12/06/2026.',
      '2. Nội dung chính:',
      '   - Khẳng định bác bỏ tin đồn thất thiệt về việc tăng thuế VAT lên 12% đối với hàng tiêu dùng từ tháng sau.',
      '   - Nhấn mạnh tác hại của các thông tin sai lệch lan truyền trên mạng xã hội nhằm gây hoang mang dư luận.',
      '   - Đề cập đề án số hóa và kế hoạch quản lý an ninh thông tin báo chí.',
      '3. Kết luận: Khuyến cáo dư luận cảnh giác và chỉ theo dõi tin tức chính thống từ Cổng thông tin điện tử Chính phủ.'
    ],
    '2': [
      '1. Mở đầu: Giới thiệu thông cáo báo chí về việc phát hành thử nghiệm HypeRoom phiên bản V3.4 Alpha.',
      '2. Nội dung chính:',
      '   - Khẳng định tin đồn rò rỉ entropy lớn của hệ thống là hoàn toàn không có cơ sở khoa học.',
      '   - Ban kỹ thuật HypeRoom đang tiến hành rà soát toàn bộ hệ thống để bảo đảm an toàn dữ liệu.',
      '   - Cam kết công bố kết quả kiểm toán an ninh mạng chi tiết trong tuần tiếp theo.',
      '3. Kết luận: Đảm bảo độ tin cậy của phiên bản mới và củng cố niềm tin của cộng đồng người dùng mạng lưới.'
    ],
    '3': [
      '1. Mở đầu: Khái quát báo cáo tài chính tóm tắt Quý II năm 2026 của doanh nghiệp.',
      '2. Nội dung chính:',
      '   - Phân tích nguyên nhân nợ phải trả tăng mạnh vượt ngưỡng cảnh báo an toàn tài chính.',
      '   - Đánh giá tác động của dư luận thị trường đối với cơ cấu nợ và danh mục đầu tư dài hạn.',
      '   - Đề xuất phương án tái cấu trúc danh mục đầu tư dài hạn nhằm cắt giảm chi phí và cải thiện dòng tiền.',
      '3. Kết luận: Kế hoạch cân đối tài chính nhằm nâng cao khả năng trả nợ và hướng tới sự phát triển ổn định.'
    ]
  }

  const handleGenerateOutline = () => {
    setOutlineLoading(true)
    setTimeout(() => {
      const docId = data.id || '1'
      const matchedOutline = outlines[docId] || [
        `1. Mở đầu: Giới thiệu văn bản tài liệu "${data.fileName || 'Tài liệu mới'}" đã được số hóa qua bản quét.`,
        '2. Nội dung chính:',
        '   - Tóm tắt ý chính của tài liệu và đánh giá mức độ tin cậy của các tuyên bố liên quan.',
        '   - Đối chiếu các dữ liệu quan trọng với nguồn tin chính thống từ Internet để kiểm chứng.',
        '3. Kết luận: Nhận định tính trung thực và đề xuất hướng xử lý văn bản báo chí.'
      ]
      setOutlineText(matchedOutline)
      setOutlineLoading(false)
      setOutlineGenerated(true)
    }, 1500)
  }

  const handleCopy = (text, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text).catch(() => { })
    const btn = e.currentTarget
    const original = btn.textContent
    btn.textContent = 'check'
    btn.classList.add('text-[#10B981]')
    setTimeout(() => {
      btn.textContent = original
      btn.classList.remove('text-[#10B981]')
    }, 2000)
  }

  return (
    <section className="w-1/2 h-full p-8 overflow-y-auto bg-surface-container-lowest custom-scrollbar">
      <h2 className="font-headline-md text-headline-md text-primary mb-8 flex items-center gap-2">
        <span className="material-symbols-outlined">neurology</span>
        Kết quả Đối chiếu &amp; Xác thực Tin tức
      </h2>

      {/* Gauges Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-high glass-panel border border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center">
          <RadialProgress value={trustScore} color="#10B981" />
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-4">Điểm tin cậy</span>
        </div>
        <div className="bg-surface-container-high glass-panel border border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center">
          <RadialProgress value={publicImpact} color="#BDE8F5" />
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-4">Ảnh hưởng dư luận</span>
        </div>
      </div>

      {/* Semantic Evidence Sources */}
      {evidenceSources.length > 0 && (
        <div className="mb-10">
          <h3 className="font-label-caps text-label-caps text-primary uppercase mb-4 tracking-widest">Nguồn tin đối chiếu</h3>
          <div className="space-y-4">
            {evidenceSources.map((source) => (
              <div
                key={source.id}
                className="bg-primary-container/40 hover:bg-primary-container/60 glass-panel border border-primary/20 p-4 rounded-xl transition-all duration-300 flex items-center justify-between group/source"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">{source.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-on-surface group-hover/source:text-primary transition-colors">{source.name}</h4>
                    <p className="text-body-sm text-on-surface-variant">{source.description}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="font-data-mono text-[#10B981] text-xs">
                    {source.match ? `Độ trùng khớp: ${source.match.replace('% Match', '%')}` : ''}
                  </span>
                  <a className="text-[#4988C4] hover:text-primary flex items-center gap-1 font-data-mono text-xs" href="#">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    Mã nguồn: {source.hash ? source.hash.replace('hash:', '') : ''}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Outline Generator Button/Notepad */}
      <div className="mt-8 border-t border-[#5c4a43]/15 pt-6">
        {!outlineGenerated && !outlineLoading && (
          <button
            onClick={handleGenerateOutline}
            className="w-full py-3 px-6 rounded-lg bg-[#3d2f2b] !text-[#f4efe2] font-label-caps text-[12px] tracking-wider font-bold hover:bg-[#1e1613] shadow-[3px_3px_0px_#1e1613] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <i className="material-symbols-outlined text-[18px] !text-[#f4efe2]">auto_awesome</i>
            TẠO DÀN Ý VĂN BẢN
          </button>
        )}

        {outlineLoading && (
          <div className="w-full p-6 rounded-lg bg-[#faf8f2] border border-dashed border-[#5c4a43]/30 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined animate-spin text-[#3f6771] text-[28px]">sync</span>
            <span className="font-data-mono text-xs text-[#5c4a43]/70">Đang phân tích văn bản và phác thảo dàn ý...</span>
          </div>
        )}

        {outlineGenerated && (
          <div className="relative rotate-[-0.5deg] transition-transform hover:rotate-0 duration-300">
            {/* Paper Pin & Scotch Tape */}
            <div className="paper-pin pin-red" style={{ top: '-8px', left: '20px' }} />
            <div className="paper-tape tape-top-right" style={{ top: '-10px', right: '15px', width: '60px' }} />

            <div className="p-6 rounded bg-[#fbf9e3] border border-[#5c4a43]/20 shadow-[3px_4px_12px_rgba(42,32,21,0.12)]">
              <div className="flex justify-between items-center mb-4 border-b border-[#5c4a43]/15 pb-2">
                <h4 className="font-headline-md text-sm text-[#1e1613] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3f6771] text-[18px]">format_list_bulleted</span>
                  Dàn ý gợi ý từ AI
                </h4>
                <button
                  onClick={(e) => handleCopy(outlineText.join('\n'), e)}
                  className="text-[#5c4a43]/50 hover:text-[#1e1613] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </button>
              </div>
              <div className="font-data-mono text-xs text-[#1e1613] leading-relaxed whitespace-pre-wrap space-y-2">
                {outlineText.map((line, idx) => (
                  <p key={idx} className={line.startsWith('   ') ? 'pl-4' : 'font-bold mt-2'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

