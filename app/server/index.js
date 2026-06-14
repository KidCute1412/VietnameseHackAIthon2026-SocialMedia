const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup multer for mock file upload
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Middleware
app.use(cors());
app.use(express.json());

// In-memory verification database simulating the user's AI skills
let verifications = [
  {
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
        name: 'Chinhphu.vn',
        description: 'Quyết định số 123/QĐ-TTg phê duyệt chiến lược chuyển đổi số quốc gia...',
        match: '98% Match',
        hash: 'hash:af92...'
      },
      {
        id: 2,
        icon: 'newspaper',
        name: 'VTV News',
        description: 'Bộ Tài chính bác bỏ tin đồn thất thiệt về điều chỉnh thuế suất VAT lên 12%...',
        match: '82% Match',
        hash: 'hash:bc41...'
      }
    ],
    storyAngles: [
      {
        id: 1,
        title: 'Neutral Report Angle',
        content: 'Hi Lok! Bản báo cáo trung lập tập trung vào tính pháp lý của văn bản số 123/QĐ-TTg, trích dẫn chính xác các điều khoản về phát triển hạ tầng số mà không thêm thắt các yếu tố cảm xúc hay suy đoán chính trị.',
        defaultOpen: true
      },
      {
        id: 2,
        title: 'Fact-Check Bulletin',
        content: 'Hi Lok! Xác minh tính xác thực của chữ ký và con dấu trên tài liệu. Đối chiếu với cơ sở dữ liệu quốc gia về văn bản pháp luật để đảm bảo không có sự sai lệch về nội dung hoặc thời gian ban hành.',
        defaultOpen: false
      },
      {
        id: 3,
        title: 'Crisis Mitigation Angle',
        content: 'Hi Lok! Trong trường hợp có tin giả xoay quanh văn bản này, góc nhìn giảm thiểu khủng hoảng sẽ nhấn mạnh vào quy trình phản bác thông tin nhanh chóng bằng chứng cứ số đã được xác thực.',
        defaultOpen: false
      }
    ]
  },
  {
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
        name: 'HypeRoom Security Node',
        description: 'Log kiểm tra định kỳ không ghi nhận lỗi rò rỉ entropy hệ thống...',
        match: '90% Match',
        hash: 'hash:de82...'
      }
    ],
    storyAngles: [
      {
        id: 1,
        title: 'Fact-Check Bulletin',
        content: 'Hi Lok! Đối chiếu thông số kỹ thuật và báo cáo bảo mật hệ thống. Khẳng định phiên bản V3.4 Alpha vẫn hoạt động an toàn theo tiêu chuẩn mã hóa quốc tế.',
        defaultOpen: true
      }
    ]
  },
  {
    id: '3',
    fileName: 'Bao_cao_Tai_chinh.pdf',
    timestamp: 'Hôm qua',
    status: 'warning',
    confidence: 42,
    trustScore: 42,
    publicImpact: 78,
    ocrText: `BÁO CÁO TÀI CHÍNH TÓM TẮT\nQuý II năm 2026\n\nNợ phải trả tăng mạnh so với cùng kỳ năm ngoái, vượt ngưỡng cảnh báo an toàn tài chính của doanh nghiệp. Đề xuất tái cấu trúc danh mục đầu tư dài hạn.`,
    evidenceSources: [
      {
        id: 1,
        icon: 'newspaper',
        name: 'Báo Đầu Tư',
        description: 'Phân tích cơ cấu nợ và các khoản phải thu của doanh nghiệp trong quý II...',
        match: '75% Match',
        hash: 'hash:ea33...'
      }
    ],
    storyAngles: [
      {
        id: 1,
        title: 'Neutral Report Angle',
        content: 'Hi Lok! Phân tích trung lập về cơ cấu nợ tài chính của doanh nghiệp dựa trên báo cáo đã công bố, tránh suy diễn gây ảnh hưởng tiêu cực đến thị trường chứng khoán.',
        defaultOpen: true
      }
    ]
  }
];

// ── API Routes ──────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'SYSTEM_READY',
    timestamp: new Date().toISOString(),
    node: '0x71C...392b',
    connected: true,
  });
});

// Get verification history
app.get('/api/verifications', (req, res) => {
  res.json(verifications);
});

// Get single verification details
app.get('/api/verifications/:id', (req, res) => {
  const item = verifications.find(v => v.id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Verification not found' });
  }
});

// Upload and verify endpoint simulating the AI skills from gemini.md
app.post('/api/verify', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileName = file ? file.originalname : 'raw_text_input.txt';
  const id = String(verifications.length + 1);
  
  // OCR/SmartReader Skill Simulation
  let ocrText = `NỘI DUNG TÀI LIỆU: ${fileName}\n\n`;
  if (fileName.endsWith('.pdf')) {
    ocrText += `[VNPT SmartReader OCR Scan]\n`;
  }
  ocrText += `Tài liệu xác thực hệ thống HypeRoom Copilot.\n`;
  ocrText += `Đề cập đến việc phân tích luồng thông tin và đánh giá rủi ro pháp lý theo Luật Báo chí Việt Nam.\n`;
  ocrText += `Đã trích xuất các khẳng định quan trọng về chính sách điều hành và xu hướng dư luận mạng xã hội.`;

  // evaluate_trust & analyze_risk Simulation
  const confidence = Math.floor(Math.random() * 40) + 60; // 60 - 100
  const trustScore = Math.floor(Math.random() * 30) + 70; // 70 - 100
  const publicImpact = Math.floor(Math.random() * 40) + 50; // 50 - 90
  
  const newVerification = {
    id,
    fileName,
    timestamp: 'Vừa xong',
    status: confidence >= 80 ? 'verified' : 'warning',
    confidence,
    trustScore,
    publicImpact,
    ocrText,
    evidenceSources: [
      {
        id: 1,
        icon: 'account_balance',
        name: 'Chinhphu.vn',
        description: `Cổng thông tin điện tử xác thực nguồn tin liên quan đến ${fileName}...`,
        match: `${confidence}% Match`,
        hash: `hash:${Math.random().toString(16).substring(2, 8)}...`
      },
      {
        id: 2,
        icon: 'newspaper',
        name: 'Thông tấn xã Việt Nam',
        description: `Bản tin xác minh chính thức đối chiếu nội dung tài liệu...`,
        match: `${confidence - 10}% Match`,
        hash: `hash:${Math.random().toString(16).substring(2, 8)}...`
      }
    ],
    storyAngles: [
      {
        id: 1,
        title: 'Fact-Check Bulletin',
        content: `Hi Lok! Phân tích xác minh tài liệu ${fileName}. Toàn bộ thông tin đã được đối chiếu với cơ sở dữ liệu quốc gia về văn bản pháp lý. Kết quả cho thấy độ chính xác đạt ${confidence}%.`,
        defaultOpen: true
      },
      {
        id: 2,
        title: 'Neutral Report Angle',
        content: `Hi Lok! Bài viết trung lập đưa tin khách quan về nội dung ${fileName}. Đảm bảo tuân thủ đầy đủ Luật Báo chí Việt Nam, trích dẫn chính xác nguồn tin chính thống từ các cơ quan nhà nước.`,
        defaultOpen: false
      }
    ]
  };

  verifications.unshift(newVerification); // Add to the beginning of the list
  res.json({
    message: 'Verification completed',
    id,
    status: newVerification.status,
    verification: newVerification
  });
});

// ── Production: Serve React Build ───────────────────────────

// In production, serve the Vite build output
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback: all non-API routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════════╗`);
  console.log(`  ║  HypeRoom Copilot Server                 ║`);
  console.log(`  ║  http://localhost:${PORT}                    ║`);
  console.log(`  ╚══════════════════════════════════════════╝\n`);
  console.log(`  API routes: /api/health, /api/verifications, /api/verify`);
  console.log(`  Serving React build from: ${clientDistPath}\n`);
});
