import { useState, useEffect, useRef } from 'react'
import RadialProgress from './RadialProgress'
import { animate, stagger } from 'animejs'
import TiltContainer from './TiltContainer'

export default function TrendingVerifyPane({ mention, onClose }) {
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [outlineLoading, setOutlineLoading] = useState(false)
  const [outlineGenerated, setOutlineGenerated] = useState(false)
  const [outlineText, setOutlineText] = useState([])

  const outlineRef = useRef(null)
  const sourcesRef = useRef(null)

  // Reset states when the selected mention changes
  useEffect(() => {
    setVerifying(false)
    setVerified(false)
    setOutlineLoading(false)
    setOutlineGenerated(false)
    setOutlineText([])
  }, [mention.username])

  // Bounce-in animation for outline box
  useEffect(() => {
    if (outlineGenerated && outlineRef.current) {
      animate(outlineRef.current, {
        translateY: ['-60px', '0px'],
        rotate: [-12, 0.5],
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 1000,
        ease: 'outElastic(1, 0.7)'
      })
    }
  }, [outlineGenerated])

  // Stagger entry animation for evidence sources
  useEffect(() => {
    if (sourcesRef.current && verified) {
      // Clear opacity first so we don't flash
      animate(sourcesRef.current.querySelectorAll('.source-item'), { opacity: 0, duration: 0 })
      animate(sourcesRef.current.querySelectorAll('.source-item'), {
        translateX: ['40px', '0px'],
        opacity: [0, 1],
        delay: stagger(80, { start: 100 }),
        duration: 800,
        ease: 'outQuad'
      })
    }
  }, [verified, mention.username])

  // Mock verification database corresponding to each trending user
  const verificationData = {
    '@crypto_phantom': {
      trustScore: 95, // 95% verified that it is false/critical status
      publicImpact: 80,
      sources: [
        {
          name: 'HypeRoom Security Node',
          description: 'Hệ thống kiểm toán mật mã không phát hiện bất kỳ sự cố rò rỉ entropy nào trên mạng lưới Alpha.',
          match: 'Độ trùng khớp: 95%',
          hash: 'crypto_node_24'
        },
        {
          name: 'Hiệp hội An toàn thông tin Việt Nam',
          description: 'Báo cáo kiểm soát an ninh định kỳ tuần này xác nhận thuật toán mã hóa HypeRoom hoạt động bình thường.',
          match: 'Độ trùng khớp: 88%',
          hash: 'aisanet_report_306'
        }
      ],
      outline: [
        '1. Mở đầu: Bác bỏ tin đồn thất thiệt từ tài khoản @crypto_phantom về sự cố rò rỉ entropy lõi HypeRoom V3.4.',
        '2. Nội dung chính:',
        '   - Đưa ra bằng chứng kiểm toán mật mã thời gian thực từ nút bảo mật HypeRoom.',
        '   - Đối chiếu với biên bản giám định độc lập của Hiệp hội An toàn thông tin Việt Nam.',
        '3. Kết luận: Khẳng định hệ thống an toàn tuyệt đối; cảnh báo dư luận không chia sẻ các phỏng đoán kỹ thuật thiếu căn cứ.'
      ]
    },
    '@narrative_weaver': {
      trustScore: 90,
      publicImpact: 65,
      sources: [
        {
          name: 'Tài liệu Kỹ thuật HypeRoom chính thức',
          description: 'Quy chuẩn phân phối tài nguyên tự động và công bằng dựa trên cổ phần đóng góp của mọi nút mạng.',
          match: 'Độ trùng khớp: 92%',
          hash: 'whitepaper_section_12'
        },
        {
          name: 'Báo Công Nghệ Số',
          description: 'Phân tích thuật toán phân bổ HypeRoom V3.4 xác nhận cơ chế ưu tiên băng thông hoạt động bình thường.',
          match: 'Độ trùng khớp: 85%',
          hash: 'technews_load_balance'
        }
      ],
      outline: [
        '1. Mở đầu: Giải đáp phản hồi của tài khoản @narrative_weaver về sự ưu tiên băng thông cho các nút lớn.',
        '2. Nội dung chính:',
        '   - Chứng minh thuật toán vận hành tự động theo Whitepaper chính thức, không có sự can thiệp thủ công.',
        '   - Công bổ số liệu thống kê phân bổ lưu lượng thực tế để làm rõ hiểu lầm của các chủ nút nhỏ.',
        '3. Kết luận: Cam kết tạo môi trường công bằng, hướng dẫn các nút nhỏ tối ưu hóa cấu hình kết nối mạng.'
      ]
    },
    '@void_operator': {
      trustScore: 98, // 98% verified connection failure indeed exists
      publicImpact: 45,
      sources: [
        {
          name: 'Trạm Giám sát Mạng Quốc gia',
          description: 'Ghi nhận sự cố suy hao đường truyền cáp quang biển cục bộ gây ảnh hưởng đến kết nối Vùng 4.',
          match: 'Độ trùng khớp: 98%',
          hash: 'vnnic_undersea_log'
        },
        {
          name: 'Cổng trạng thái HypeRoom',
          description: 'Xác nhận cụm máy chủ Vùng 4 hoạt động bình thường nhưng bị nghẽn mạng do tuyến đường truyền thay thế.',
          match: 'Độ trùng khớp: 90%',
          hash: 'hyproom_status_v4'
        }
      ],
      outline: [
        '1. Mở đầu: Xác nhận thắc mắc của tài khoản @void_operator về lỗi kết nối mạng cục bộ tại khu vực Vùng 4.',
        '2. Nội dung chính:',
        '   - Cung cấp nhật ký mạng từ vnNIC ghi nhận sự cố đứt cáp quang biển tạm thời.',
        '   - Giải thích nguyên nhân hệ thống báo hoạt động bình thường nhưng người dùng gặp lỗi kết nối do nghẽn mạng đường truyền.',
        '3. Kết luận: Hướng dẫn người dùng tạm thời chuyển đổi DNS dự phòng trong thời gian cáp quang biển được khắc phục.'
      ]
    }
  }

  const currentVerify = verificationData[mention.username] || {
    trustScore: 75,
    publicImpact: 50,
    sources: [
      {
        name: 'Cơ sở dữ liệu Tin tức Chính thống',
        description: 'Chưa tìm thấy bằng chứng trùng khớp tuyệt đối, cần tiếp tục xác minh nguồn thông tin.',
        match: 'Độ trùng khớp: 60%',
        hash: 'unverified_news'
      }
    ],
    outline: [
      '1. Mở đầu: Tiếp nhận ý kiến đóng góp của người dùng trên không gian mạng.',
      '2. Nội dung chính:',
      '   - Rà soát hệ thống và liên hệ với các đơn vị liên quan để kiểm chứng nội dung.',
      '3. Kết luận: Sẽ sớm cập nhật thông báo xác thực chính thức khi có dữ liệu mới.'
    ]
  }

  const handleVerify = () => {
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setVerified(true)
    }, 1500)
  }

  const handleGenerateOutline = () => {
    setOutlineLoading(true)
    setTimeout(() => {
      setOutlineText(currentVerify.outline)
      setOutlineLoading(false)
      setOutlineGenerated(true)
    }, 1200)
  }

  const handleCopy = (text, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text).catch(() => {})
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
    <div className="paper-sheet p-6 flex flex-col relative h-full rotate-[-0.3deg] shadow-lg border border-[#5c4a43]/20">
      {/* Scotch tape and pin decoration */}
      <div className="paper-tape tape-top-right" style={{ top: '-12px', right: '20px', width: '70px' }} />
      <div className="paper-pin pin-red pin-center-top" style={{ top: '-6px' }} />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b border-[#5c4a43]/15 pb-3 relative z-10">
        <div>
          <h3 className="font-headline-md text-lg text-[#1e1613] font-extrabold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3f6771]">analytics</span>
            Kiểm chứng Tin tức Trending
          </h3>
          <p className="text-[#5c4a43]/60 font-body-sm mt-0.5">Xác thực bài viết đang lan truyền của {mention.username}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#5c4a43]/5 hover:bg-[#5c4a43]/10 flex items-center justify-center text-[#5c4a43] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Selected Rumor Detail Card */}
      <div className="p-4 rounded bg-[#faf8f2] border border-[#5c4a43]/15 mb-6 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#5c4a43]/15 shrink-0">
            <img alt={mention.username} className="w-full h-full object-cover" src={mention.avatar} />
          </div>
          <div>
            <div className="font-bold text-[#1e1613] text-sm">{mention.username}</div>
            <div className="text-[10px] text-[#5c4a43]/60">{mention.followers}</div>
          </div>
        </div>
        <p className="text-body-sm text-[#1e1613] italic leading-relaxed">
          {mention.content}
        </p>
      </div>

      {/* Interactive Verification Workflow */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        {!verified && !verifying && (
          <div className="text-center py-10">
            <button
              onClick={handleVerify}
              className="px-8 py-3.5 rounded-lg bg-[#3d2f2b] !text-[#f4efe2] font-label-caps text-[12px] tracking-wider font-extrabold hover:bg-[#1e1613] shadow-[3px_3px_0px_#1e1613] transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <i className="material-symbols-outlined text-[18px] !text-[#f4efe2]">verified_user</i>
              BẮT ĐẦU KIỂM CHỨNG BẰNG AI
            </button>
            <p className="text-xs text-[#5c4a43]/50 mt-3 font-data-mono">Gemini AI sẽ đối chiếu dữ liệu với nguồn chính thống</p>
          </div>
        )}

        {verifying && (
          <div className="w-full py-12 flex flex-col items-center justify-center gap-4 bg-[#faf8f2] border border-dashed border-[#5c4a43]/30 rounded-lg">
            <span className="material-symbols-outlined animate-spin text-[#3f6771] text-[32px]">sync</span>
            <span className="font-data-mono text-xs text-[#5c4a43]/70">Đang quét bài đăng và tìm kiếm nguồn đối chiếu...</span>
            <div className="scan-effect absolute w-full left-0 h-1 bg-gradient-to-r from-transparent via-[#bb2d3b] to-transparent" />
          </div>
        )}

        {verified && (
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[480px] pr-2 custom-scrollbar">
            {/* Gauges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#faf8f2] border border-[#5c4a43]/15 p-4 rounded-lg flex flex-col items-center justify-center">
                <RadialProgress value={currentVerify.trustScore} color="#10B981" />
                <span className="font-label-caps text-[10px] text-[#5c4a43] font-bold uppercase tracking-wider mt-3">Độ tin cậy</span>
              </div>
              <div className="bg-[#faf8f2] border border-[#5c4a43]/15 p-4 rounded-lg flex flex-col items-center justify-center">
                <RadialProgress value={currentVerify.publicImpact} color="#3f6771" />
                <span className="font-label-caps text-[10px] text-[#5c4a43] font-bold uppercase tracking-wider mt-3">Mức độ ảnh hưởng</span>
              </div>
            </div>

            {/* Official Sources */}
            <div>
              <h4 className="font-label-caps text-[11px] text-[#1e1613] font-extrabold uppercase mb-3 tracking-widest">Nguồn tin đối chiếu</h4>
              <div ref={sourcesRef} className="space-y-3">
                {currentVerify.sources.map((source, idx) => (
                  <div key={idx} className="source-item bg-[#faf8f2] border border-[#5c4a43]/15 p-3.5 rounded-lg flex flex-col gap-1.5">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[#1e1613] text-xs leading-snug">{source.name}</span>
                      <span className="font-data-mono text-[#10B981] text-[10px] bg-[#d1e7dd]/70 border border-[#157347]/20 px-2 py-0.5 rounded font-extrabold uppercase shrink-0">{source.match}</span>
                    </div>
                    <p className="text-[11px] text-[#5c4a43]/80 leading-relaxed">{source.description}</p>
                    <div className="flex items-center gap-1 font-data-mono text-[10px] text-[#4988C4] mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">link</span>
                      Mã nguồn: {source.hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Outline Button & Section */}
            <div className="border-t border-[#5c4a43]/15 pt-4">
              {!outlineGenerated && !outlineLoading && (
                <button
                  onClick={handleGenerateOutline}
                  className="w-full py-3 px-6 rounded-lg bg-[#3d2f2b] !text-[#f4efe2] font-label-caps text-[11px] tracking-wider font-extrabold hover:bg-[#1e1613] shadow-[3px_3px_0px_#1e1613] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="material-symbols-outlined text-[16px] !text-[#f4efe2]">auto_awesome</i>
                  TẠO DÀN Ý PHẢN HỒI TIN TỨC
                </button>
              )}

              {outlineLoading && (
                <div className="w-full p-5 rounded-lg bg-[#faf8f2] border border-dashed border-[#5c4a43]/20 flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[#3f6771] text-[24px]">sync</span>
                  <span className="font-data-mono text-[10px] text-[#5c4a43]/70">Đang phác thảo dàn ý văn bản...</span>
                </div>
              )}

              {outlineGenerated && (
                <div ref={outlineRef} className="relative rotate-[0.5deg] mt-3">
                  <TiltContainer>
                    <div className="paper-pin pin-blue pin-top-left" style={{ top: '-10px', left: '15px' }} />
                    <div className="paper-tape tape-top-right" style={{ top: '-12px', right: '10px', width: '50px' }} />

                    <div className="p-5 rounded bg-[#fbf9e3] border border-[#5c4a43]/20 shadow-md">
                      <div className="flex justify-between items-center mb-3 border-b border-[#5c4a43]/15 pb-1.5">
                        <h4 className="font-headline-md text-xs text-[#1e1613] font-extrabold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#3f6771] text-[16px]">format_list_bulleted</span>
                          Dàn ý phản hồi gợi ý
                        </h4>
                        <button
                          onClick={(e) => handleCopy(outlineText.join('\n'), e)}
                          className="text-[#5c4a43]/50 hover:text-[#1e1613] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>
                      </div>
                      <div className="font-handwriting text-[11px] text-[#1e1613] leading-relaxed whitespace-pre-wrap space-y-1.5">
                        {outlineText.map((line, idx) => (
                          <p key={idx} className={line.startsWith('   ') ? 'pl-3' : 'font-bold mt-1.5'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </TiltContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
