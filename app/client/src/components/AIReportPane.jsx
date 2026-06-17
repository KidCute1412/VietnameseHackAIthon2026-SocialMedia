import { useState, useEffect, useRef } from 'react'
import RadialProgress from './RadialProgress'
import { animate, stagger } from 'animejs'

export default function AIReportPane({ data, onClose, className = "" }) {
  const trustScore = data.trustScore || 85
  const publicImpact = data.publicImpact || 92
  const evidenceSources = data.evidenceSources || []

  const [outlineLoading, setOutlineLoading] = useState(false)
  const [outlineText, setOutlineText] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState('article')
  const [showPublicImpactAnalysis, setShowPublicImpactAnalysis] = useState(false)
  const [showChatbot, setShowChatbot] = useState(true)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý Biên tập SmartBot. Tôi có thể hỗ trợ bạn phân tích sâu điểm số, các nguồn tin hoặc tùy chỉnh dàn ý biên tập của tài liệu này. Hãy chọn một câu hỏi nhanh bên dưới hoặc nhập yêu cầu của bạn.'
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [highlightOutline, setHighlightOutline] = useState(false)

  const outlineRef = useRef(null)
  const sourcesRef = useRef(null)
  const modalCardRef = useRef(null)
  const modalBackdropRef = useRef(null)
  const messagesEndRef = useRef(null)
  const chatListRef = useRef(null)

  // Reset state when data item changes
  useEffect(() => {
    setOutlineLoading(false)
    setOutlineText(null)
    setSelectedFormat('article')
    setShowPublicImpactAnalysis(false)
    setShowChatbot(true)
    setHighlightOutline(false)
    setChatMessages([
      {
        id: 1,
        sender: 'ai',
        text: 'Xin chào! Tôi là Trợ lý Biên tập SmartBot. Tôi có thể hỗ trợ bạn phân tích sâu điểm số, các nguồn tin hoặc tùy chỉnh dàn ý biên tập của tài liệu này. Hãy chọn một câu hỏi nhanh bên dưới hoặc nhập yêu cầu của bạn.'
      }
    ])
    setChatInput('')
  }, [data.id])

  const publicImpactData = {
    '1': {
      title: 'Tin đồn tăng thuế VAT lên 12%',
      volume: 'Rất cao (High Volume)',
      sentiment: { negative: 82, neutral: 15, positive: 3 },
      channels: [
        { name: 'TikTok', percentage: 45, icon: 'smart_display' },
        { name: 'Facebook Groups', percentage: 35, icon: 'groups' },
        { name: 'Báo chí điện tử', percentage: 20, icon: 'newspaper' }
      ],
      summary: 'Tin đồn Bộ Tài chính đề xuất tăng thuế suất giá trị gia tăng (VAT) lên 12% đối với các mặt hàng tiêu dùng từ tháng sau.',
      conclusion: 'Nếu đăng tin này mà không có đính chính, dư luận sẽ ngay lập tức bùng nổ sự phẫn nộ do đánh thẳng vào chi phí sinh hoạt hàng ngày.',
      targetAudience: 'Người lao động thu nhập thấp, chủ cửa hàng bán lẻ, người kinh doanh online và các hộ gia đình.',
      mainPlatform: 'TikTok (dưới dạng video ngắn giật tít) và các nhóm cộng đồng lớn trên Facebook.',
      misunderstandings: 'Dư luận tin rằng chính phủ đang tăng gánh nặng thuế khóa để thắt chặt tài khóa, dẫn đến kêu gọi đầu cơ hàng hóa tích trữ.',
      recommendation: 'Bắt buộc phải đưa thông tin bác bỏ chính thức từ Bộ Tài chính vào tiêu đề và Sapo. Nhấn mạnh việc tiếp tục giảm 2% thuế suất VAT hiện nay.',
      keyOpinions: [
        '“Lại tăng thuế à, lương không tăng mà cái gì cũng tăng thế này sống sao nổi!” (12.4k tương tác)',
        '“Thông tin này đã được xác thực chưa mọi người, nghe hoang mang quá.” (5.2k tương tác)'
      ]
    },
    '2': {
      title: 'Sự cố rò rỉ entropy HypeRoom V3.4 Alpha',
      volume: 'Trung bình (Medium Volume)',
      sentiment: { negative: 45, neutral: 50, positive: 5 },
      channels: [
        { name: 'Telegram Channels', percentage: 50, icon: 'send' },
        { name: 'X (Twitter)', percentage: 40, icon: 'public' },
        { name: 'Diễn đàn Công nghệ', percentage: 10, icon: 'forum' }
      ],
      summary: 'Đồn đoán về lỗi kỹ thuật nghiêm trọng làm rò rỉ entropy lõi bảo mật trên phiên bản HypeRoom V3.4 Alpha.',
      conclusion: 'Sẽ làm giảm giá trị token và làm suy giảm nhẹ niềm tin của người dùng nếu không kịp thời đưa ra giải thích kỹ thuật chuẩn xác.',
      targetAudience: 'Cộng đồng thợ đào, nhà phát triển blockchain, chuyên gia mật mã học và nhà đầu tư nắm giữ token.',
      mainPlatform: 'Các kênh Telegram kín của dự án, mạng xã hội X (Twitter) và một số diễn đàn công nghệ lớn.',
      misunderstandings: 'Người dùng hiểu lầm toàn bộ tài sản kỹ thuật số trong ví của họ đã bị lộ khóa bí mật và có nguy cơ bị rút sạch.',
      recommendation: 'Trích dẫn nhanh báo cáo giám định độc lập của Hiệp hội An toàn thông tin và log từ nút bảo mật, công bố chữ ký số xác thực.',
      keyOpinions: [
        '“Nếu rò rỉ entropy thật thì toàn bộ khóa bảo mật của các nút sẽ bị ảnh hưởng, mong dự án sớm giải trình.” (1.2k tương tác)',
        '“Đang đợi thông cáo chính thức từ ban kỹ thuật xem thực hư thế nào.” (800 tương tác)'
      ]
    },
    '3': {
      title: 'Báo cáo tài chính tóm tắt Quý II - Nợ phải trả tăng mạnh',
      volume: 'Cao (High Volume)',
      sentiment: { negative: 70, neutral: 25, positive: 5 },
      channels: [
        { name: 'Diễn đàn Tài chính', percentage: 60, icon: 'trending_up' },
        { name: 'Báo điện tử chính thống', percentage: 30, icon: 'newspaper' },
        { name: 'Facebook', percentage: 10, icon: 'chat' }
      ],
      summary: 'Báo cáo tài chính Quý II ghi nhận các khoản nợ phải trả tăng mạnh vượt ngưỡng cảnh báo an toàn tài chính.',
      conclusion: 'Kích hoạt tâm lý hoang mang về khả năng thanh toán nợ của doanh nghiệp, có nguy cơ dẫn đến làn sóng bán tháo cổ phiếu trên sàn.',
      targetAudience: 'Các nhà đầu tư cá nhân, cổ đông doanh nghiệp, đối tác thương mại và các ngân hàng chủ nợ.',
      mainPlatform: 'Diễn đàn chứng khoán (F319), các room Zalo tư vấn tài chính và trang báo tài chính chính thống.',
      misunderstandings: 'Nhà đầu tư hiểu lầm doanh nghiệp đang kề cận bờ vực vỡ nợ hoặc chuẩn bị tuyên bố phá sản.',
      recommendation: 'Công bố rõ lý do nợ tăng là dùng để phục vụ đầu tư dài hạn vào các dự án tiềm năng và đưa ra lộ trình tái cấu trúc nợ chi tiết.',
      keyOpinions: [
        '“Nợ thế này thì khả năng trả nợ ngắn hạn cực kỳ báo động, mai lo bán tháo gấp thôi.” (3.5k tương tác)',
        '“Doanh nghiệp cần giải trình rõ cơ cấu nợ này dùng để đầu tư dự án nào.” (1.1k tương tác)'
      ]
    }
  }

  const currentDocId = data.id || '1'
  const currentAnalysis = publicImpactData[currentDocId] || {
    title: data.fileName || 'Tài liệu vừa tải lên',
    volume: publicImpact > 75 ? 'Cao (High Volume)' : publicImpact > 40 ? 'Trung bình (Medium Volume)' : 'Thấp (Low Volume)',
    sentiment: {
      negative: Math.round(publicImpact * 0.7),
      neutral: Math.round((100 - publicImpact) * 0.8),
      positive: Math.round(100 - (publicImpact * 0.7) - ((100 - publicImpact) * 0.8))
    },
    channels: [
      { name: 'Mạng xã hội', percentage: 60, icon: 'share' },
      { name: 'Báo chí điện tử', percentage: 30, icon: 'newspaper' },
      { name: 'Khác', percentage: 10, icon: 'devices_other' }
    ],
    summary: `Tài liệu "${data.fileName || 'Tài liệu mới'}" đang chuẩn bị được xuất bản.`,
    conclusion: `Mức độ ảnh hưởng dư luận dự báo ở mức ${publicImpact > 75 ? 'Cao' : publicImpact > 40 ? 'Trung bình' : 'Thấp'}, có thể gây chú ý nhẹ.`,
    targetAudience: 'Độc giả và các nhóm đối tượng liên quan trực tiếp tới nội dung của tài liệu.',
    mainPlatform: 'Các trang mạng xã hội và kênh tin tức điện tử lớn.',
    misunderstandings: 'Độc giả hiểu sai nội dung văn bản nếu trích dẫn ngoài ngữ cảnh hoặc thiếu nguồn tin chính thống.',
    recommendation: 'Luôn đính kèm link tài liệu gốc đã được hệ thống kiểm chứng để đảm bảo tính minh bạch.',
    keyOpinions: [
      '“Cần kiểm chứng lại nguồn tin này trước khi chia sẻ.” (120 tương tác)',
      '“Mong sớm có thông tin chính thức từ cơ quan chức năng.” (80 tương tác)'
    ]
  }

  // Fade/slide-in animation for outline box (no rotation)
  useEffect(() => {
    if (outlineText && outlineRef.current) {
      animate(outlineRef.current, {
        translateY: ['-30px', '0px'],
        scale: [0.96, 1],
        opacity: [0, 1],
        duration: 800,
        ease: 'outQuad'
      })
    }
  }, [outlineText])

  // Stagger entry animation for evidence sources
  useEffect(() => {
    if (sourcesRef.current && evidenceSources.length > 0) {
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
  }, [data.id, evidenceSources.length])

  // Anime.js animation for Public Opinion Modal (slide up, scale, stagger fade-in contents)
  useEffect(() => {
    if (showPublicImpactAnalysis && modalCardRef.current && modalBackdropRef.current) {
      // Animate backdrop
      animate(modalBackdropRef.current, {
        opacity: [0, 1],
        duration: 300,
        ease: 'outQuad'
      })

      // Animate card
      animate(modalCardRef.current, {
        translateY: ['40px', '0px'],
        scale: [0.95, 1],
        opacity: [0, 1],
        duration: 500,
        ease: 'outBack'
      })

      // Stagger child elements inside the card
      const items = modalCardRef.current.querySelectorAll('.modal-info-block')
      if (items.length > 0) {
        animate(items, { opacity: 0, translateY: 15, duration: 0 })
        animate(items, {
          opacity: [0, 1],
          translateY: [15, 0],
          delay: stagger(80, { start: 150 }),
          duration: 650,
          ease: 'outQuad'
        })
      }
    }
  }, [showPublicImpactAnalysis])

  const handleCloseModal = () => {
    if (modalCardRef.current && modalBackdropRef.current) {
      animate(modalCardRef.current, {
        translateY: [0, 30],
        scale: [1, 0.95],
        opacity: [1, 0],
        duration: 250,
        ease: 'inQuad'
      })
      animate(modalBackdropRef.current, {
        opacity: [1, 0],
        duration: 250,
        ease: 'inQuad',
        complete: () => {
          setShowPublicImpactAnalysis(false)
        }
      })
    } else {
      setShowPublicImpactAnalysis(false)
    }
  }

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  }, [chatMessages, chatLoading])

  const quickPrompts = [
    {
      label: '💬 Giải thích điểm số',
      category: 'score',
      text: `Giải thích giúp tôi tại sao điểm tin cậy là ${trustScore}% và điểm ảnh hưởng dư luận là ${publicImpact}%?`
    },
    {
      label: '🔍 Phân tích nguồn đối chiếu',
      category: 'sources',
      text: `Hãy phân tích độ tin cậy của các nguồn đối chiếu như ${evidenceSources.map(s => s.name).join(', ')}.`
    },
    {
      label: '✏️ Tối ưu dàn ý biên tập',
      category: 'outline',
      text: `Hãy viết lại dàn ý ${selectedFormat === 'article' ? 'Bài báo chí' : selectedFormat === 'facebook' ? 'Bài đăng Facebook' : 'Kịch bản Reel'} này một cách chuyên nghiệp và tối ưu hơn.`
    }
  ]

  const applyOutlineFromChat = (newOutlineArray) => {
    setOutlineText(prev => {
      const base = prev || { article: [], facebook: [], reel: [] };
      return {
        ...base,
        [selectedFormat]: newOutlineArray
      }
    })
    setHighlightOutline(true)
    setTimeout(() => setHighlightOutline(false), 1500)
  }

  const handleExecuteAction = (action) => {
    if (action.type === 'apply_outline') {
      applyOutlineFromChat(action.data)
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: `✅ Đã áp dụng dàn ý mới vào tab **${selectedFormat === 'article' ? 'Báo chí' : selectedFormat === 'facebook' ? 'Facebook Post' : 'Kịch bản Reel'}** ở bảng bên cạnh thành công!`
      }])
    }
  }

  const handleSendQuickQuestion = (questionText, category) => {
    setShowChatbot(true)
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: questionText
    }
    setChatMessages(prev => [...prev, userMsg])
    setChatLoading(true)

    setTimeout(() => {
      let botResponseText = ''
      let action = null

      if (category === 'score') {
        if (currentDocId === '1') {
          botResponseText = "Tôi xin giải thích về Điểm tin cậy (85%) và Ảnh hưởng dư luận (92%) của tin đồn VAT 12%:\n\n- **Điểm tin cậy (85%)**: Đạt mức khá cao vì văn bản đính chính chính thức mang tính pháp lý từ Bộ Tài chính đã được xác thực qua chữ ký số. Điểm chưa đạt 100% vì hệ thống vẫn đang quét thêm phản hồi từ cơ quan thuế địa phương.\n- **Ảnh hưởng dư luận (92%)**: Ở mức cực kỳ nguy cấp. Lý do là thông tin tăng thuế trực tiếp tác động đến túi tiền của người lao động và hộ kinh doanh, tạo ra làn sóng bình luận tiêu cực rất lớn trên TikTok (chiếm 45% thảo luận)."
        } else if (currentDocId === '2') {
          botResponseText = "Tôi xin giải thích về Điểm tin cậy (50%) và Ảnh hưởng dư luận (60%) của lỗi Entropy HypeRoom:\n\n- **Điểm tin cậy (50%)**: Ở mức trung bình vì đây là thông cáo báo chí mang tính một chiều từ dự án, hệ thống chưa ghi nhận báo cáo kiểm toán độc lập của bên thứ ba.\n- **Ảnh hưởng dư luận (60%)**: Mức độ trung bình-cao, chủ yếu gây hoang mang trong các nhóm Telegram kín của thợ đào và cộng đồng X (Twitter) mật mã học."
        } else {
          botResponseText = "Tôi xin giải thích về Điểm tin cậy (42%) và Ảnh hưởng dư luận (78%) của Báo cáo tài chính Quý II:\n\n- **Điểm tin cậy (42%)**: Đạt mức cảnh báo thấp vì các con số nợ phải trả tăng mạnh là chính xác, tuy nhiên giải trình của doanh nghiệp chưa đủ rõ ràng để xoa dịu nhà đầu tư.\n- **Ảnh hưởng dư luận (78%)**: Ở mức cao. Thông tin nợ nần vượt ngưỡng an toàn kích hoạt tâm lý bán tháo trên các diễn đàn chứng khoán lớn như F319."
        }
      } else if (category === 'sources') {
        if (currentDocId === '1') {
          botResponseText = "Nguồn đối chiếu chính là **Cổng thông tin Chính phủ** (Trùng khớp 98%) và **VTV News** (Trùng khớp 82%). Cả hai đều là cơ quan truyền thông cấp quốc gia. Việc đối chiếu chéo xác nhận tin đồn này là hoàn toàn thất thiệt. Bạn có thể trích dẫn nguyên văn văn bản từ Cổng thông tin Chính phủ để tăng tính pháp lý cho bài viết."
        } else if (currentDocId === '2') {
          botResponseText = "Nguồn đối chiếu duy nhất hiện tại là **Log kiểm tra định kỳ của Nút bảo mật HypeRoom** (Trùng khớp 90%). Nguồn này có tính kỹ thuật cao nhưng mang tính nội bộ. Để tăng tính khách quan, ban biên tập nên đợi kết quả kiểm toán từ Hiệp hội An toàn thông tin vào tuần tới."
        } else {
          botResponseText = "Nguồn đối chiếu là **Báo Đầu Tư** (Trùng khớp 75%). Đây là báo chuyên ngành kinh tế uy tín, xác nhận cơ cấu nợ của doanh nghiệp thực sự có sự gia tăng mạnh nhưng đi kèm với giải trình về đầu tư dài hạn."
        }
      } else if (category === 'outline') {
        if (currentDocId === '1') {
          botResponseText = "Dưới đây là phương án đề xuất dàn ý **Facebook Post** mới, được tối ưu hóa giật tít và có cấu trúc súc tích hơn giúp người đọc dễ tiếp cận:\n\n📌 TIN CHÍNH THỨC: BỘ TÀI CHÍNH BÁC TIN ĐỒN TĂNG THUẾ VAT LÊN 12%!\n\n1️⃣ **Tin đồn sai sự thật**: Gần đây lan truyền tin đồn tăng thuế VAT từ tháng sau gây hoang mang dư luận.\n2️⃣ **Bộ Tài chính khẳng định**: Quyết định số 08/QĐ-BTC chính thức bác bỏ hoàn toàn tin đồn này.\n3️⃣ **Vẫn duy trì hỗ trợ**: Chính sách giảm 2% thuế VAT vẫn đang có hiệu lực để hỗ trợ người dân.\n🔔 **Khuyến cáo**: Độc giả không chia sẻ các thông tin chưa kiểm chứng.\n\n*Bạn có thể nhấp vào nút bên dưới để áp dụng trực tiếp dàn ý mới này vào bảng dàn ý ở cột bên trái!*"
          action = {
            label: "Áp dụng Dàn ý Facebook mới",
            icon: "assignment_turned_in",
            type: "apply_outline",
            data: [
              "📌 TIN CHÍNH THỨC: BỘ TÀI CHÍNH BÁC TIN ĐỒN TĂNG THUẾ VAT LÊN 12!",
              "1️⃣ Tin đồn sai sự thật: Gần đây lan truyền tin đồn tăng thuế VAT từ tháng sau gây hoang mang dư luận.",
              "2️⃣ Bộ Tài chính khẳng định: Quyết định số 08/QĐ-BTC chính thức bác bỏ hoàn toàn tin đồn này.",
              "3️⃣ Vẫn duy trì hỗ trợ: Chính sách giảm 2% thuế VAT vẫn đang có hiệu lực để hỗ trợ người dân.",
              "🔔 Khuyến cáo: Độc giả không chia sẻ các thông tin chưa kiểm chứng."
            ]
          }
        } else if (currentDocId === '2') {
          botResponseText = "Dưới đây là đề xuất dàn ý **Bài viết Báo chí** mới tập trung giải thích kỹ thuật dễ hiểu hơn:\n\n1. Tiêu đề: Thực hư việc rò rỉ Entropy lõi bảo mật trên HypeRoom V3.4 Alpha.\n2. Sapo: Ban kỹ thuật HypeRoom bác bỏ tin đồn và công bố log an ninh hệ thống.\n3. Nội dung chính:\n   - Giải thích khái niệm Entropy hệ thống bảo mật một cách đơn giản.\n   - Trích dẫn log hoạt động từ nút bảo mật chứng minh hệ thống hoạt động bình thường.\n   - Kế hoạch công bố báo cáo kiểm toán độc lập.\n4. Kết luận: Người dùng ví không cần lo lắng về tính an toàn của tài sản kỹ thuật số.\n\n*Bạn có thể nhấp vào nút bên dưới để áp dụng trực tiếp dàn ý mới này vào bảng dàn ý ở cột bên trái!*"
          action = {
            label: "Áp dụng Dàn ý Báo chí mới",
            icon: "assignment_turned_in",
            type: "apply_outline",
            data: [
              "1. Tiêu đề: Thực hư việc rò rỉ Entropy lõi bảo mật trên HypeRoom V3.4 Alpha.",
              "2. Sapo: Ban kỹ thuật HypeRoom bác bỏ tin đồn và công bố log an ninh hệ thống.",
              "3. Nội dung chính:",
              "   - Giải thích khái niệm Entropy hệ thống bảo mật một cách đơn giản.",
              "   - Trích dẫn log hoạt động từ nút bảo mật chứng minh hệ thống hoạt động bình thường.",
              "   - Kế hoạch công bố báo cáo kiểm toán độc lập.",
              "4. Kết luận: Người dùng ví không cần lo lắng về tính an toàn của tài sản kỹ thuật số."
            ]
          }
        } else {
          botResponseText = "Dưới đây là đề xuất **Kịch bản Reel** mới, tăng tính giật gân thu hút người xem tài chính:\n\n🎬 [0:00 - 0:05] Cảnh: Zoom vào biểu đồ nợ tăng vọt kèm text \"Doanh nghiệp A sắp vỡ nợ?\".\n🎤 [0:05 - 0:15] MC: \"Đừng vội bán tháo cổ phiếu! Nợ phải trả tăng mạnh thật nhưng lý do đằng sau là gì?\"\n📊 [0:15 - 0:30] Cảnh chỉ vào cơ cấu đầu tư dự án hạ tầng dài hạn tiềm năng.\n💡 [0:30 - 0:45] MC: \"Tái cấu trúc nợ là nước đi cần thiết để bứt phá. Đăng ký kênh để theo dõi phân tích tài chính tiếp theo nhé!\"\n\n*Bạn có thể nhấp vào nút bên dưới để áp dụng trực tiếp kịch bản mới này vào bảng dàn ý ở cột bên trái!*"
          action = {
            label: "Áp dụng Kịch bản Reel mới",
            icon: "assignment_turned_in",
            type: "apply_outline",
            data: [
              "🎬 [0:00 - 0:05] Cảnh: Zoom vào biểu đồ nợ tăng vọt kèm text \"Doanh nghiệp A sắp vỡ nợ?\".",
              "🎤 [0:05 - 0:15] MC: \"Đừng vội bán tháo cổ phiếu! Nợ phải trả tăng mạnh thật nhưng lý do đằng sau là gì?\"",
              "📊 [0:15 - 0:30] Cảnh chỉ vào cơ cấu đầu tư dự án hạ tầng dài hạn tiềm năng.",
              "💡 [0:30 - 0:45] MC: \"Tái cấu trúc nợ là nước đi cần thiết để bứt phá. Đăng ký kênh để theo dõi phân tích tài chính tiếp theo nhé!\""
            ]
          }
        }
      } else {
        botResponseText = "Tôi hiểu câu hỏi của bạn. Để tối ưu hóa khâu biên tập, bạn nên trích dẫn chéo các nguồn tin xác thực đã được HypeRoom đối chiếu và điều chỉnh giọng văn phù hợp với thị hiếu độc giả của nền tảng mục tiêu."
      }

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: botResponseText,
        action: action
      }])
      setChatLoading(false)
    }, 1200)
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    const userText = chatInput
    setChatInput('')

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText
    }
    setChatMessages(prev => [...prev, userMsg])
    setChatLoading(true)

    setTimeout(() => {
      let botResponseText = ''
      let action = null
      const inputLower = userText.toLowerCase()

      if (inputLower.includes('dàn ý') || inputLower.includes('outline') || inputLower.includes('kịch bản') || inputLower.includes('bài đăng')) {
        if (currentDocId === '1') {
          botResponseText = "Dưới đây là phương án đề xuất dàn ý **Facebook Post** mới, được tối ưu hóa giật tít và có cấu trúc súc tích hơn giúp người đọc dễ tiếp cận:\n\n📌 TIN CHÍNH THỨC: BỘ TÀI CHÍNH BÁC TIN ĐỒN TĂNG THUẾ VAT LÊN 12%!\n\n1️⃣ **Tin đồn sai sự thật**: Gần đây lan truyền tin đồn tăng thuế VAT từ tháng sau gây hoang mang dư luận.\n2️⃣ **Bộ Tài chính khẳng định**: Quyết định số 08/QĐ-BTC chính thức bác bỏ hoàn toàn tin đồn này.\n3️⃣ **Vẫn duy trì hỗ trợ**: Chính sách giảm 2% thuế VAT vẫn đang có hiệu lực để hỗ trợ người dân.\n🔔 **Khuyến cáo**: Độc giả không chia sẻ các thông tin chưa kiểm chứng.\n\n*Bạn có thể nhấp vào nút bên dưới để áp dụng trực tiếp dàn ý mới này vào bảng dàn ý ở cột bên trái!*"
          action = {
            label: "Áp dụng Dàn ý Facebook mới",
            icon: "assignment_turned_in",
            type: "apply_outline",
            data: [
              "📌 TIN CHÍNH THỨC: BỘ TÀI CHÍNH BÁC TIN ĐỒN TĂNG THUẾ VAT LÊN 12!",
              "1️⃣ Tin đồn sai sự thật: Gần đây lan truyền tin đồn tăng thuế VAT từ tháng sau gây hoang mang dư luận.",
              "2️⃣ Bộ Tài chính khẳng định: Quyết định số 08/QĐ-BTC chính thức bác bỏ hoàn toàn tin đồn này.",
              "3️⃣ Vẫn duy trì hỗ trợ: Chính sách giảm 2% thuế VAT vẫn đang có hiệu lực để hỗ trợ người dân.",
              "🔔 Khuyến cáo: Độc giả không chia sẻ các thông tin chưa kiểm chứng."
            ]
          }
        } else if (currentDocId === '2') {
          botResponseText = "Dưới đây là đề xuất dàn ý **Bài viết Báo chí** mới tập trung giải thích kỹ thuật dễ hiểu hơn:\n\n1. Tiêu đề: Thực hư việc rò rỉ Entropy lõi bảo mật trên HypeRoom V3.4 Alpha.\n2. Sapo: Ban kỹ thuật HypeRoom bác bỏ tin đồn và công bố log an ninh hệ thống.\n3. Nội dung chính:\n   - Giải thích khái niệm Entropy hệ thống bảo mật một cách đơn giản.\n   - Trích dẫn log hoạt động từ nút bảo mật chứng minh hệ thống hoạt động bình thường.\n   - Kế hoạch công bố báo cáo kiểm toán độc lập.\n4. Kết luận: Người dùng ví không cần lo lắng về tính an toàn của tài sản kỹ thuật số.\n\n*Bạn có thể nhấp vào nút bên dưới để áp dụng trực tiếp dàn ý mới này vào bảng dàn ý ở cột bên trái!*"
          action = {
            label: "Áp dụng Dàn ý Báo chí mới",
            icon: "assignment_turned_in",
            type: "apply_outline",
            data: [
              "1. Tiêu đề: Thực hư việc rò rỉ Entropy lõi bảo mật trên HypeRoom V3.4 Alpha.",
              "2. Sapo: Ban kỹ thuật HypeRoom bác bỏ tin đồn và công bố log an ninh hệ thống.",
              "3. Nội dung chính:",
              "   - Giải thích khái niệm Entropy hệ thống bảo mật một cách đơn giản.",
              "   - Trích dẫn log hoạt động từ nút bảo mật chứng minh hệ thống hoạt động bình thường.",
              "   - Kế hoạch công bố báo cáo kiểm toán độc lập.",
              "4. Kết luận: Người dùng ví không cần lo lắng về tính an toàn của tài sản kỹ thuật số."
            ]
          }
        } else {
          botResponseText = "Dưới đây là đề xuất **Kịch bản Reel** mới, tăng tính giật gân thu hút người xem tài chính:\n\n🎬 [0:00 - 0:05] Cảnh: Zoom vào biểu đồ nợ tăng vọt kèm text \"Doanh nghiệp A sắp vỡ nợ?\".\n🎤 [0:05 - 0:15] MC: \"Đừng vội bán tháo cổ phiếu! Nợ phải trả tăng mạnh thật nhưng lý do đằng sau là gì?\"\n📊 [0:15 - 0:30] Cảnh chỉ vào cơ cấu đầu tư dự án hạ tầng dài hạn tiềm năng.\n💡 [0:30 - 0:45] MC: \"Tái cấu trúc nợ là nước đi cần thiết để bứt phá. Đăng ký kênh để theo dõi phân tích tài chính tiếp theo nhé!\"\n\n*Bạn có thể nhấp vào nút bên dưới để áp dụng trực tiếp kịch bản mới này vào bảng dàn ý ở cột bên trái!*"
          action = {
            label: "Áp dụng Kịch bản Reel mới",
            icon: "assignment_turned_in",
            type: "apply_outline",
            data: [
              "🎬 [0:00 - 0:05] Cảnh: Zoom vào biểu đồ nợ tăng vọt kèm text \"Doanh nghiệp A sắp vỡ nợ?\".",
              "🎤 [0:05 - 0:15] MC: \"Đừng vội bán tháo cổ phiếu! Nợ phải trả tăng mạnh thật nhưng lý do đằng sau là gì?\"",
              "📊 [0:15 - 0:30] Cảnh chỉ vào cơ cấu đầu tư dự án hạ tầng dài hạn tiềm năng.",
              "💡 [0:30 - 0:45] MC: \"Tái cấu trúc nợ là nước đi cần thiết để bứt phá. Đăng ký kênh để theo dõi phân tích tài chính tiếp theo nhé!\""
            ]
          }
        }
      } else if (inputLower.includes('nguồn') || inputLower.includes('đối chiếu') || inputLower.includes('chính phủ') || inputLower.includes('vtv')) {
        if (currentDocId === '1') {
          botResponseText = "Nguồn đối chiếu chính là **Cổng thông tin Chính phủ** (Trùng khớp 98%) và **VTV News** (Trùng khớp 82%). Cả hai đều là cơ quan truyền thông cấp quốc gia. Việc đối chiếu chéo xác nhận tin đồn này là hoàn toàn thất thiệt. Bạn có thể trích dẫn nguyên văn văn bản từ Cổng thông tin Chính phủ để tăng tính pháp lý cho bài viết."
        } else if (currentDocId === '2') {
          botResponseText = "Nguồn đối chiếu duy nhất hiện tại là **Log kiểm tra định kỳ của Nút bảo mật HypeRoom** (Trùng khớp 90%). Nguồn này có tính kỹ thuật cao nhưng mang tính nội bộ. Để tăng tính khách quan, ban biên tập nên đợi kết quả kiểm toán từ Hiệp hội An toàn thông tin vào tuần tới."
        } else {
          botResponseText = "Nguồn đối chiếu là **Báo Đầu Tư** (Trùng khớp 75%). Đây là báo chuyên ngành kinh tế uy tín, xác nhận cơ cấu nợ của doanh nghiệp thực sự có sự gia tăng mạnh nhưng đi kèm với giải trình về đầu tư dài hạn."
        }
      } else if (inputLower.includes('điểm') || inputLower.includes('score') || inputLower.includes('tin cậy') || inputLower.includes('ảnh hưởng')) {
        if (currentDocId === '1') {
          botResponseText = "Tôi xin giải thích về Điểm tin cậy (85%) và Ảnh hưởng dư luận (92%) của tin đồn VAT 12%:\n\n- **Điểm tin cậy (85%)**: Đạt mức khá cao vì văn bản đính chính chính thức mang tính pháp lý từ Bộ Tài chính đã được xác thực qua chữ ký số. Điểm chưa đạt 100% vì hệ thống vẫn đang quét thêm phản hồi từ cơ quan thuế địa phương.\n- **Ảnh hưởng dư luận (92%)**: Ở mức cực kỳ nguy cấp. Lý do là thông tin tăng thuế trực tiếp tác động đến túi tiền của người lao động và hộ kinh doanh, tạo ra làn sóng bình luận tiêu cực rất lớn trên TikTok (chiếm 45% thảo luận)."
        } else if (currentDocId === '2') {
          botResponseText = "Tôi xin giải thích về Điểm tin cậy (50%) và Ảnh hưởng dư luận (60%) của lỗi Entropy HypeRoom:\n\n- **Điểm tin cậy (50%)**: Ở mức trung bình vì đây là thông cáo báo chí mang tính một chiều từ dự án, hệ thống chưa ghi nhận báo cáo kiểm toán độc lập của bên thứ ba.\n- **Ảnh hưởng dư luận (60%)**: Mức độ trung bình-cao, chủ yếu gây hoang mang trong các nhóm Telegram kín của thợ đào và cộng đồng X (Twitter) mật mã học."
        } else {
          botResponseText = "Tôi xin giải thích về Điểm tin cậy (42%) và Ảnh hưởng dư luận (78%) của Báo cáo tài chính Quý II:\n\n- **Điểm tin cậy (42%)**: Đạt mức cảnh báo thấp vì các con số nợ phải trả tăng mạnh là chính xác, tuy nhiên giải trình của doanh nghiệp chưa đủ rõ ràng để xoa dịu nhà đầu tư.\n- **Ảnh hưởng dư luận (78%)**: Ở mức cao. Thông tin nợ nần vượt ngưỡng an toàn kích hoạt tâm lý bán tháo trên các diễn đàn chứng khoán lớn như F319."
        }
      } else {
        botResponseText = "Tôi hiểu câu hỏi của bạn. SmartBot khuyên bạn nên trích dẫn chéo các nguồn tin xác thực đã được HypeRoom đối chiếu và điều chỉnh giọng văn phù hợp với thị hiếu độc giả của nền tảng mục tiêu. Hãy hỏi tôi về: 'điểm số', 'nguồn đối chiếu' hoặc 'dàn ý' để nhận hỗ trợ chuyên sâu."
      }

      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: botResponseText,
        action: action
      }])
      setChatLoading(false)
    }, 1200)
  }

  const outlines = {
    '1': {
      article: [
        '1. Mở đầu: Giới thiệu Quyết định số 08/QĐ-BTC của Bộ Tài chính ngày 12/06/2026.',
        '2. Nội dung chính:',
        '   - Khẳng định bác bỏ tin đồn thất thiệt về việc tăng thuế VAT lên 12% đối với hàng tiêu dùng từ tháng sau.',
        '   - Nhấn mạnh tác hại của các thông tin sai lệch lan truyền trên mạng xã hội nhằm gây hoang mang dư luận.',
        '   - Đề cập đề án số hóa và kế hoạch quản lý an ninh thông tin báo chí.',
        '3. Kết luận: Khuyến cáo dư luận cảnh giác và chỉ theo dõi tin tức chính thống từ Cổng thông tin điện tử Chính phủ.'
      ],
      facebook: [
        '📌 ĐÍNH CHÍNH TIN ĐỒN: Bộ Tài chính CHƯA TỪNG đề xuất tăng thuế VAT lên 12%!',
        '👉 Thời gian gần đây, trên mạng xã hội lan truyền tin đồn thất thiệt gây hoang mang về việc tăng thuế VAT.',
        '👉 Bộ Tài chính chính thức ban hành Quyết định số 08/QĐ-BTC khẳng định thông tin trên là SAI SỰ THẬT.',
        '👉 Hiện chính phủ vẫn đang thực hiện chính sách giảm 2% thuế VAT để hỗ trợ người dân và doanh nghiệp.',
        '🔔 Hãy là người tiếp nhận thông tin thông thái, chia sẻ bài viết này để mọi người cùng biết nhé!'
      ],
      reel: [
        '🎬 [0:00 - 0:05] Cảnh báo: "Tin đồn tăng thuế VAT lên 12% đang cực hot trên TikTok là sai sự thật!"',
        '🎤 [0:05 - 0:15] MC cầm mic: "Mọi người đừng hoang mang nhé! Bộ Tài chính vừa ra văn bản 08 bác bỏ hoàn toàn tin đồn này."',
        '📊 [0:15 - 0:30] Hiển thị ảnh chụp công văn chính thức. Thuế VAT vẫn được hỗ trợ giảm 2%.',
        '💡 [0:30 - 0:45] MC: "Bấm follow ngay để cập nhật tin tức kiểm chứng chính xác nhất từ HypeRoom!"'
      ]
    },
    '2': {
      article: [
        '1. Mở đầu: Giới thiệu thông cáo báo chí về việc phát hành thử nghiệm HypeRoom phiên bản V3.4 Alpha.',
        '2. Nội dung chính:',
        '   - Khẳng định tin đồn rò rỉ entropy lớn của hệ thống là hoàn toàn không có cơ sở khoa học.',
        '   - Ban kỹ thuật HypeRoom đang tiến hành rà soát toàn bộ hệ thống để bảo đảm an toàn dữ liệu.',
        '   - Cam kết công bố kết quả kiểm toán an ninh mạng chi tiết trong tuần tiếp theo.',
        '3. Kết luận: Đảm bảo độ tin cậy của phiên bản mới và củng cố niềm tin của cộng đồng người dùng mạng lưới.'
      ],
      facebook: [
        '🔒 AN NINH MẠNG LƯỚI: HypeRoom bác bỏ tin đồn rò rỉ Entropy!',
        '💻 Đội ngũ kỹ thuật HypeRoom vừa hoàn tất rà soát nhanh phiên bản V3.4 Alpha.',
        '❌ Tin đồn rò rỉ entropy là vô căn cứ và không có cơ sở mật mã học.',
        '📅 Kết quả kiểm toán an ninh chi tiết từ đơn vị độc lập sẽ được công bố vào tuần tới.',
        '👉 Đọc chi tiết thông cáo báo chí tại đường link bên dưới.'
      ],
      reel: [
        '🎬 [0:00 - 0:07] Cảnh: Hiển thị dòng chữ "HypeRoom bị hack rò rỉ Entropy?" và dấu gạch chéo đỏ.',
        '🎤 [0:07 - 0:20] Lời thoại: "Dừng lại 3 giây! Tin đồn rò rỉ entropy của HypeRoom V3.4 chỉ là tin vịt thôi."',
        '📊 [0:20 - 0:35] Show ảnh dòng log kiểm định bảo mật. Mọi khóa mã hóa vẫn an toàn tuyệt đối.',
        '💡 [0:35 - 0:45] Lời thoại: "Hãy follow để nhận phân tích bảo mật sớm nhất từ HypeRoom."'
      ]
    },
    '3': {
      article: [
        '1. Mở đầu: Khái quát báo cáo tài chính tóm tắt Quý II năm 2026 của doanh nghiệp.',
        '2. Nội dung chính:',
        '   - Phân tích nguyên nhân nợ phải trả tăng mạnh vượt ngưỡng cảnh báo an toàn tài chính.',
        '   - Đánh giá tác động của dư luận thị trường đối với cơ cấu nợ và danh mục đầu tư dài hạn.',
        '   - Đề xuất phương án tái cấu trúc danh mục đầu tư dài hạn nhằm cắt giảm chi phí và cải thiện dòng tiền.',
        '3. Kết luận: Kế hoạch cân đối tài chính nhằm nâng cao khả năng trả nợ và hướng tới sự phát triển ổn định.'
      ],
      facebook: [
        '📊 PHÂN TÍCH TÀI CHÍNH: Doanh nghiệp phản hồi về cơ cấu nợ Quý II/2026.',
        '⚠️ Báo cáo tài chính ghi nhận nợ phải trả tăng mạnh vượt ngưỡng cảnh báo an toàn.',
        '💡 Nguyên nhân chủ yếu đến từ việc tập trung vốn cho các dự án hạ tầng dài hạn.',
        '✅ Kế hoạch sắp tới: Tái cấu trúc danh mục đầu tư và tối ưu hóa chi phí vận hành.',
        '📈 Đọc phân tích chi tiết từ chuyên gia tài chính tại trang tin của chúng tôi.'
      ],
      reel: [
        '🎬 [0:00 - 0:05] Cảnh: Biểu đồ giá cổ phiếu biến động mạnh kèm tiêu đề "Nợ tăng vượt ngưỡng an toàn".',
        '🎤 [0:05 - 0:20] Lời thoại: "Doanh nghiệp A nợ tăng kỷ lục, liệu có nguy cơ vỡ nợ ngắn hạn?"',
        '📊 [0:20 - 0:35] Cảnh zoom vào cơ cấu đầu tư dài hạn. Giải thích kế hoạch cơ cấu lại danh mục để trả nợ.',
        '💡 [0:35 - 0:45] Lời thoại: "Bấm đăng ký kênh để không bỏ lỡ các phân tích tài chính chuyên sâu!"'
      ]
    }
  }

  const handleGenerateOutline = () => {
    setOutlineLoading(true)
    setShowChatbot(true)
    
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: 'Hãy phân tích tài liệu và thiết lập dàn ý văn bản đề xuất.'
    }
    setChatMessages(prev => [...prev, userMsg])
    setChatLoading(true)

    setTimeout(() => {
      const docId = data.id || '1'
      const matchedOutline = outlines[docId] || {
        article: [
          `1. Mở đầu: Giới thiệu văn bản tài liệu "${data.fileName || 'Tài liệu mới'}" đã được số hóa qua bản quét.`,
          '2. Nội dung chính:',
          '   - Tóm tắt ý chính của tài liệu và đánh giá mức độ tin cậy của các tuyên bố liên quan.',
          '   - Đối chiếu các dữ liệu quan trọng với nguồn tin chính thống từ Internet để kiểm chứng.',
          '3. Kết luận: Nhận định tính trung thực và đề xuất hướng xử lý văn bản báo chí.'
        ],
        facebook: [
          `📝 TÓM TẮT TÀI LIỆU: Phân tích nhanh văn bản "${data.fileName || 'Tài liệu mới'}"`,
          '👉 Nội dung chính đã được kiểm chứng và đối chiếu với cơ sở dữ liệu tin tức.',
          '🔍 Mức độ tin cậy tổng thể được đánh giá là khá cao.',
          '🔔 Chia sẻ và theo dõi kênh để không bỏ lỡ các báo cáo kiểm chứng tiếp theo.'
        ],
        reel: [
          `🎬 [0:00 - 0:10] Hiển thị tài liệu: "${data.fileName || 'Tài liệu mới'}" vừa được kiểm chứng.`,
          '🎤 [0:10 - 0:30] Lời thoại: "Bạn đã biết tin tức này chưa? Hệ thống kiểm chứng HypeRoom đã xác minh tài liệu này..."',
          '💡 [0:30 - 0:45] Lời thoại: "Theo dõi ngay HypeRoom để cập nhật các tin đồn công nghệ nhanh nhất nhé!"'
        ]
      }
      
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Tôi đã lập xong đề xuất dàn ý cho tài liệu này dưới 3 định dạng: Báo chí, Bài đăng Facebook, và Kịch bản Reel. Bạn có thể nhấn nút dưới đây để áp dụng dàn ý vào Notepad biên tập ở bảng kết quả đối chiếu.`,
        action: {
          type: 'apply_outline',
          label: '📋 ÁP DỤNG DÀN Ý MỚI',
          icon: 'task_alt',
          data: matchedOutline[selectedFormat] || matchedOutline.article
        }
      }
      
      setOutlineText(matchedOutline)
      setOutlineLoading(false)
      setChatLoading(false)
      setChatMessages(prev => [...prev, aiReply])
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
    <section className={`p-8 bg-surface-container-lowest flex flex-col ${className || 'w-1/2 h-full'}`} style={{ maxHeight: 'calc(100vh - 110px)', overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-[#5c4a43]/15 pb-3">
        <h2 className="font-headline-md text-[20px] text-[#1e1613] flex items-center gap-2 font-bold">
          <span className="material-symbols-outlined text-[#3f6771]">neurology</span>
          Kết quả Đối chiếu &amp; Xác thực Tin tức
        </h2>
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#5c4a43]/5 hover:bg-[#5c4a43]/10 flex items-center justify-center text-[#5c4a43] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </div>

      <div className={`flex-1 flex items-stretch w-full overflow-hidden transition-all duration-300 ${showChatbot ? 'gap-6' : 'gap-0'}`}>
        {/* Left Pane: Fact-Checking Content */}
        <div className={`flex flex-col overflow-y-auto pr-2 custom-scrollbar transition-all duration-300 ${showChatbot ? 'w-[calc(100%-424px)]' : 'w-full'}`}>
          {/* Gauges Section */}
          <div className="grid grid-cols-2 gap-6 mb-4 font-sans">
            <div 
              onClick={() => handleSendQuickQuestion(
                `Giải thích giúp tôi tại sao điểm tin cậy là ${trustScore}% của hồ sơ này?`,
                'score'
              )}
              className="bg-surface-container-high glass-panel border border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary-container/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-sm relative group select-none"
              title="Nhấp để hỏi Trợ lý giải thích Điểm tin cậy"
            >
              <RadialProgress value={trustScore} color="#10B981" />
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-4 group-hover:text-primary transition-colors">Điểm tin cậy</span>
            </div>
            <div 
              onClick={() => handleSendQuickQuestion(
                `Giải thích giúp tôi tại sao điểm ảnh hưởng dư luận là ${publicImpact}% của hồ sơ này?`,
                'score'
              )}
              className="bg-surface-container-high glass-panel border border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary-container/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-sm relative group"
              title="Nhấp để hỏi Trợ lý giải thích Ảnh hưởng dư luận"
            >
              <RadialProgress value={publicImpact} color="#3f6771" />
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-4 flex items-center gap-1 group-hover:text-primary transition-colors">
                Ảnh hưởng dư luận
              </span>
              <span 
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPublicImpactAnalysis(true)
                }}
                className="text-[10px] text-[#5c4a43]/60 mt-1 font-data-mono flex items-center gap-1 group-hover:underline cursor-pointer relative z-10"
              >
                <span className="material-symbols-outlined text-[12px]">open_in_new</span> Chi tiết
              </span>
            </div>
          </div>


          {/* Semantic Evidence Sources */}
          {evidenceSources.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 border-b border-[#5c4a43]/15 pb-2">
                <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Nguồn tin đối chiếu</h3>
              </div>
              <div ref={sourcesRef} className="space-y-4">
                {evidenceSources.map((source) => (
                  <div
                    key={source.id}
                    className="source-item bg-primary-container/40 hover:bg-primary-container/60 glass-panel border border-primary/20 p-4 rounded-xl transition-all duration-300 flex items-center justify-between group/source"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined">{source.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-body-md font-bold text-on-surface group-hover/source:text-primary transition-colors">{source.name}</h4>
                        <p className="text-body-sm text-on-surface-variant text-xs">{source.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1 shrink-0 ml-4">
                      <span className="font-data-mono text-[#10B981] text-xs font-bold">
                        {source.match ? `${source.match.replace('% Match', '%')}` : ''}
                      </span>
                      <a className="text-[#4988C4] hover:text-primary flex items-center gap-1 font-data-mono text-[10px]" href="#">
                        <span className="material-symbols-outlined text-[12px]">link</span>
                        {source.hash ? source.hash.replace('hash:', '') : ''}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Outline Generator Button/Notepad */}
          <div className="mt-4 border-t border-[#5c4a43]/15 pt-6 font-sans">
            {!outlineText && !outlineLoading && (
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

            {outlineText && (
              <div ref={outlineRef} className="relative w-full mt-4">
                <div className={`p-6 rounded-lg bg-[#faf8f2] border transition-all duration-500 ${
                  highlightOutline 
                    ? 'border-[#10B981] ring-2 ring-[#10B981]/30 shadow-md scale-[1.01]' 
                    : 'border-[#5c4a43]/15 shadow-sm'
                }`}>
                  <div className="flex justify-between items-center mb-4 border-b border-[#5c4a43]/15 pb-2">
                    <h4 className="font-headline-md text-sm text-[#1e1613] font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3f6771] text-[18px]">format_list_bulleted</span>
                      Dàn ý gợi ý từ AI
                    </h4>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSendQuickQuestion(
                          `Hãy viết lại dàn ý ${selectedFormat === 'article' ? 'Bài báo chí' : selectedFormat === 'facebook' ? 'Bài đăng Facebook' : 'Kịch bản Reel'} này một cách chuyên nghiệp và tối ưu hơn.`,
                          'outline'
                        )}
                        className="text-xs text-[#3f6771] hover:text-[#1e1613] hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
                        title="Yêu cầu AI tinh chỉnh dàn ý"
                      >
                        <span className="material-symbols-outlined text-[16px]">forum</span>
                        Tối ưu dàn ý
                      </button>
                      <button
                        onClick={(e) => handleCopy(outlineText[selectedFormat].join('\n'), e)}
                        className="text-[#5c4a43]/50 hover:text-[#1e1613] transition-colors cursor-pointer"
                        title="Sao chép dàn ý"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Format selection tabs */}
                  <div className="flex gap-2 mb-4 border-b border-[#5c4a43]/10 pb-2">
                    <button
                      onClick={() => setSelectedFormat('article')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        selectedFormat === 'article'
                          ? 'bg-[#3d2f2b] !text-[#f4efe2] shadow-sm'
                          : 'bg-transparent text-[#5c4a43]/60 hover:text-[#1e1613]'
                      }`}
                    >
                      📰 Báo chí
                    </button>
                    <button
                      onClick={() => setSelectedFormat('facebook')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        selectedFormat === 'facebook'
                          ? 'bg-[#3d2f2b] !text-[#f4efe2] shadow-sm'
                          : 'bg-transparent text-[#5c4a43]/60 hover:text-[#1e1613]'
                      }`}
                    >
                      👥 Facebook Post
                    </button>
                    <button
                      onClick={() => setSelectedFormat('reel')}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        selectedFormat === 'reel'
                          ? 'bg-[#3d2f2b] !text-[#f4efe2] shadow-sm'
                          : 'bg-transparent text-[#5c4a43]/60 hover:text-[#1e1613]'
                      }`}
                    >
                      🎬 Kịch bản Reel
                    </button>
                  </div>

                  <div className="font-sans text-[13.5px] text-[#2c1d11] leading-relaxed whitespace-pre-wrap space-y-2.5">
                    {outlineText[selectedFormat].map((line, idx) => (
                      <p key={idx} className={line.startsWith('   ') ? 'pl-4 text-[#5c4a43]/90' : 'font-bold text-[#1e1613] mt-3'}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chatbot Wrapper */}
        <div className="w-[400px] shrink-0 h-full">
          {/* Chatbot Content Pane (always visible) */}
          <div className="relative overflow-hidden h-full w-[400px]">
            {/* Inner Card Container */}
            <div 
              className="w-[400px] h-full flex flex-col border border-[#5c4a43]/15 rounded-lg bg-[#faf8f2]/95 shadow-md overflow-hidden chat-container"
              style={{
                backgroundBlendMode: 'multiply',
                backgroundImage: `url('https://www.transparenttextures.com/patterns/aged-paper.png')`
              }}
            >
              {/* Chatbot Header */}
              <div className="bg-[#3d2f2b] text-true-white px-4 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-true-white text-[18px]">forum</span>
                  <span className="font-sans font-bold text-xs tracking-wider uppercase text-true-white">Trợ lý Biên tập SmartBot</span>
                </div>
              </div>

              {/* Messages list */}
              <div 
                ref={chatListRef}
                className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar flex flex-col bg-[#faf8f2]/30"
              >
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`w-full flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Sender badge/label */}
                    <span className="font-data-mono text-[9px] uppercase tracking-widest text-[#5c4a43]/60 mb-1 px-1">
                      {msg.sender === 'user' ? '✎ Biên tập viên' : '🤖 Trợ lý SmartBot'}
                    </span>
                    
                    <div
                      className={`p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'chat-bubble-user self-end ml-auto'
                          : 'chat-bubble-ai self-start mr-auto'
                      }`}
                    >
                      {msg.text}
                      {msg.action && (
                        <button
                          onClick={() => handleExecuteAction(msg.action)}
                          className="mt-3 py-1.5 px-3 rounded bg-[#3d2f2b] !text-[#f4efe2] hover:bg-[#3f6771] font-bold text-[9px] tracking-wider transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_#1e1613] flex items-center gap-1.5 self-start border border-[#3d2f2b]"
                        >
                          <span className="material-symbols-outlined text-[12px]">{msg.action.icon}</span>
                          {msg.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="w-full flex flex-col items-start">
                    <span className="font-data-mono text-[9px] uppercase tracking-widest text-[#5c4a43]/60 mb-1 px-1">
                      🤖 Trợ lý SmartBot
                    </span>
                    <div className="chat-bubble-ai p-3 rounded text-xs leading-relaxed self-start mr-auto flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[#3f6771] text-[16px]">sync</span>
                      <span className="font-data-mono text-[10px] text-[#5c4a43]/70">SmartBot đang phân tích...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Question Prompts */}
              <div className="px-4 py-3 bg-[#5c4a43]/5 border-t border-[#5c4a43]/10 flex flex-wrap gap-2 shrink-0">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuickQuestion(p.text, p.category)}
                    className="py-1.5 px-3 border border-dashed border-[#3d2f2b]/40 hover:border-solid hover:bg-[#3d2f2b] bg-[#fbfaf4] text-[#3d2f2b] hover:text-white font-data-mono text-[9px] uppercase tracking-wider rounded transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Message input */}
              <div className="p-3 bg-[#fdfcf7] border-t border-[#5c4a43]/15 rounded-b-lg flex gap-2 items-center shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage()
                  }}
                  placeholder="Nhập phản hồi hoặc yêu cầu biên tập..."
                  className="flex-1 py-2 px-3 border border-[#5c4a43]/20 rounded-md focus:outline-none focus:border-[#3d2f2b] focus:ring-1 focus:ring-[#3d2f2b] font-sans text-xs bg-[#faf8f2]/60 text-[#1e1613] placeholder-[#5c4a43]/40"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-9 h-9 rounded bg-[#3d2f2b] hover:bg-[#1e1613] flex items-center justify-center transition-all cursor-pointer shrink-0 border border-[#3d2f2b] shadow-[2px_2px_0px_#1e1613] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none"
                  title="Gửi câu hỏi"
                >
                  <span className="material-symbols-outlined text-true-white text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Public Opinion Impact Analysis Modal */}
      {showPublicImpactAnalysis && (
        <div 
          ref={modalBackdropRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-[9999] overflow-y-auto py-8 px-4 flex justify-center items-start opacity-0"
          onClick={handleCloseModal}
        >
          <div 
            ref={modalCardRef}
            className="bg-[#fdfcf7] border border-[#5c4a43]/20 max-w-2xl w-full rounded-lg shadow-2xl p-6 my-auto relative overflow-hidden font-sans opacity-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b border-[#5c4a43]/15 pb-4">
              <h3 className="font-headline-md text-lg text-[#1e1613] flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-[#3f6771] text-[24px]">analytics</span>
                Báo cáo Ảnh hưởng Dư luận
              </h3>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-[#5c4a43]/5 hover:bg-[#5c4a43]/10 flex items-center justify-center text-[#5c4a43] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Document Info & Impact Level Stamp */}
            <div className="flex justify-between items-start gap-4 mb-6 bg-[#5c4a43]/5 p-4 rounded-lg border border-[#5c4a43]/10">
              <div>
                <span className="font-data-mono text-[10px] text-[#5c4a43]/70 block uppercase tracking-wider">HỒ SƠ ĐỐI CHIẾU:</span>
                <span className="font-sans text-[15px] text-[#1e1613] font-extrabold">{currentAnalysis.title}</span>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-data-mono text-[10px] text-[#5c4a43]/70 block uppercase tracking-wider">MỨC ĐỘ ẢNH HƯỞNG:</span>
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider mt-1 shadow-sm border ${
                  currentAnalysis.volume.includes('Cao') || currentAnalysis.volume.includes('rất cao') || currentAnalysis.volume.includes('High')
                    ? 'bg-[#f8d7da] text-[#bb2d3b] border-[#f5c2c7]'
                    : 'bg-[#fff3cd] text-[#664d03] border-[#ffecb5]'
                }`}>
                  {currentAnalysis.volume}
                </span>
              </div>
            </div>

            {/* Analysis details structured into clean info blocks */}
            <div className="space-y-4 mb-6">
              {/* Row 1: Tóm tắt & Kết luận */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="modal-info-block bg-[#faf8f2] border border-[#5c4a43]/15 p-4 rounded-lg hover:shadow-sm transition-all duration-300">
                  <span className="font-sans text-xs text-[#3d2f2b] font-bold flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <span className="w-6 h-6 rounded-full bg-[#3f6771]/10 text-[#3f6771] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">description</span>
                    </span>
                    Tóm tắt tin/chủ đề xuất bản
                  </span>
                  <p className="font-sans text-[13.5px] leading-relaxed text-[#2c1d11]">{currentAnalysis.summary}</p>
                </div>
                <div className="modal-info-block bg-[#faf8f2] border border-[#5c4a43]/15 p-4 rounded-lg hover:shadow-sm transition-all duration-300">
                  <span className="font-sans text-xs text-[#3d2f2b] font-bold flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <span className="w-6 h-6 rounded-full bg-[#bb2d3b]/10 text-[#bb2d3b] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                    </span>
                    Kết luận nhanh
                  </span>
                  <p className="font-sans text-[13.5px] leading-relaxed text-[#2c1d11]">{currentAnalysis.conclusion}</p>
                </div>
              </div>

              {/* Row 2: Đối tượng & Nền tảng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="modal-info-block bg-[#faf8f2] border border-[#5c4a43]/15 p-4 rounded-lg hover:shadow-sm transition-all duration-300">
                  <span className="font-sans text-xs text-[#3d2f2b] font-bold flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <span className="w-6 h-6 rounded-full bg-[#4988C4]/10 text-[#4988C4] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">groups</span>
                    </span>
                    Nhóm đối tượng quan tâm nhất
                  </span>
                  <p className="font-sans text-[13.5px] leading-relaxed text-[#2c1d11]">{currentAnalysis.targetAudience}</p>
                </div>
                <div className="modal-info-block bg-[#faf8f2] border border-[#5c4a43]/15 p-4 rounded-lg hover:shadow-sm transition-all duration-300">
                  <span className="font-sans text-xs text-[#3d2f2b] font-bold flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <span className="w-6 h-6 rounded-full bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">forum</span>
                    </span>
                    Nền tảng thảo luận chính
                  </span>
                  <p className="font-sans text-[13.5px] leading-relaxed text-[#2c1d11]">{currentAnalysis.mainPlatform}</p>
                </div>
              </div>

              {/* Row 3: Rủi ro / Hiểu lầm */}
              <div className="modal-info-block bg-[#faf8f2] border border-[#5c4a43]/15 p-4 rounded-lg hover:shadow-sm transition-all duration-300">
                <span className="font-sans text-xs text-[#3d2f2b] font-bold flex items-center gap-2 mb-2 uppercase tracking-wide">
                  <span className="w-6 h-6 rounded-full bg-[#e65100]/10 text-[#e65100] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                  </span>
                  Những hiểu nhầm, tranh cãi có thể xảy ra
                </span>
                <p className="font-sans text-[13.5px] leading-relaxed text-[#2c1d11]">{currentAnalysis.misunderstandings}</p>
              </div>

              {/* Row 4: Khuyến nghị (Highlight Memo Box) */}
              <div className="modal-info-block bg-[#fdfbeb] border-l-4 border-[#d97706] p-4 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-300">
                <span className="font-sans text-xs text-[#b45309] font-bold flex items-center gap-2 mb-2 uppercase tracking-wide">
                  <span className="w-6 h-6 rounded-full bg-[#d97706]/10 text-[#d97706] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                  </span>
                  Khuyến nghị
                </span>
                <p className="font-handwriting text-[16px] text-[#78350f] leading-relaxed tracking-wide">
                  {currentAnalysis.recommendation}
                </p>
              </div>
            </div>

            {/* Close Button / Bottom Action */}
            <div className="flex justify-end pt-4 border-t border-[#5c4a43]/15">
              <button 
                onClick={handleCloseModal}
                className="py-2.5 px-6 rounded-lg bg-[#3d2f2b] !text-[#f4efe2] hover:bg-[#1e1613] font-bold text-xs tracking-wider transition-colors cursor-pointer shadow-sm border border-[#3d2f2b]"
              >
                ĐÃ HIỂU
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

