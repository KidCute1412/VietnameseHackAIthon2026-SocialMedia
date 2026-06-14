# HypeRoom - Các Gói Dịch Vụ & Chiến Lược Thương Mại Hóa

Tài liệu này định nghĩa chi tiết 4 gói dịch vụ (Subscription Plans) của nền tảng **HypeRoom**, được thiết kế tối ưu dựa trên kiến trúc hệ thống và chi phí vận hành thực tế của các dịch vụ cốt lõi (VNPT APIs, LLM, Vector DB).

---

## 1. HypeFree (Gói Trải Nghiệm)
*   **Chi phí**: 0đ
*   **Đối tượng**: Cá nhân dùng thử, sinh viên ngành báo chí/truyền thông.
*   **Tính năng chính**:
    *   Cá nhân sử dụng (1 tài khoản).
    *   Nhập văn bản trực tiếp để kiểm chứng tin tức.
    *   Giới hạn số hóa tài liệu (VNPT SmartReader OCR): 20 trang/tháng.
    *   Giới hạn số hóa âm thanh (VNPT SmartVoice STT): 30 phút/tháng.
    *   Đánh giá độ tin cậy (Trust Engine): 50 tin bài/tháng (Chỉ đối chiếu nguồn báo chí chính thống & cổng thông tin chính phủ có sẵn).
    *   Lưu lịch sử tác nghiệp trong vòng 7 ngày.

---

## 2. HypePro (Gói Tác Nghiệp Cá Nhân)
*   **Chi phí**: Thu phí theo tháng (Cá nhân)
*   **Đối tượng**: Phóng viên, Nhà báo tự do, Nhà sáng tạo nội dung (Content Creator).
*   **Tính năng chính**:
    *   Mở khóa đầy đủ công cụ phân tích cá nhân.
    *   Giới hạn số hóa tài liệu (VNPT SmartReader OCR): 200 trang/tháng.
    *   Giới hạn số hóa âm thanh (VNPT SmartVoice STT): 300 phút/tháng.
    *   Đánh giá độ tin cậy (Trust Engine): 500 tin bài/tháng.
    *   Lắng nghe MXH (VNPT vnSocial API): Theo dõi cơ bản tối đa 3 từ khóa/chủ đề trên không gian mạng.
    *   Trợ lý ảo tác nghiệp (SmartBot): Hỗ trợ tối đa 50 câu hỏi/tháng.
    *   Lưu lịch sử tác nghiệp trong vòng 90 ngày.

---

## 3. HypePremium (Gói Toà Soạn Nhỏ / Nhóm Tác Nghiệp)
*   **Chi phí**: Thu phí theo tháng (Theo nhóm/Workspace)
*   **Đối tượng**: Ban biên tập, nhóm phóng viên điều tra, phòng truyền thông doanh nghiệp quy mô nhỏ.
*   **Tính năng chính**:
    *   Hỗ trợ Không gian làm việc chung (Workspace) tối đa 5 thành viên.
    *   Giới hạn số hóa tài liệu (VNPT SmartReader OCR): 1,000 trang/tháng.
    *   Giới hạn số hóa âm thanh (VNPT SmartVoice STT): 1,500 phút/tháng.
    *   Đánh giá độ tin cậy (Trust Engine): 2,500 tin bài/tháng.
    *   Lắng nghe MXH (VNPT vnSocial API): Theo dõi thời gian thực (real-time) 15 từ khóa, phân tích sắc thái dư luận (Sentiment Analysis).
    *   Trợ lý ảo tác nghiệp (SmartBot): Hỏi đáp không giới hạn dựa trên dữ liệu tác nghiệp.
    *   Xuất bản & Pháp lý: Hỗ trợ xuất báo cáo rủi ro truyền thông đạt chuẩn pháp lý (PDF).
    *   Lưu trữ lịch sử tác nghiệp vĩnh viễn.

---

## 4. HypeEnterprise (Gói Doanh Nghiệp & Toà Soạn Lớn)
*   **Chi phí**: Báo giá theo nhu cầu thực tế (Custom Contract)
*   **Đối tượng**: Tòa soạn báo lớn, Tập đoàn đa quốc gia, Cơ quan quản lý nhà nước.
*   **Tính năng chính**:
    *   Workspace doanh nghiệp: Không giới hạn thành viên, phân quyền theo phòng ban/vị trí.
    *   Hạn ngạch dịch vụ số hóa (OCR & STT): Dùng chung (Shared Pool) linh hoạt theo nhu cầu của tổ chức.
    *   Lắng nghe MXH (VNPT vnSocial API) toàn diện: Không giới hạn từ khóa, tự động cảnh báo khủng hoảng truyền thông.
    *   Tùy chỉnh kho tri thức (Custom Vector DB): Tải lên cẩm nang nghiệp vụ, quy chế phát ngôn nội bộ của đơn vị để hệ thống đối chiếu rủi ro riêng.
    *   Quản trị & Bảo mật cao cấp: Tích hợp đăng nhập một lần (SSO), lưu vết lịch sử thao tác hệ thống (Audit Logs phục vụ hậu kiểm).
    *   Hỗ trợ kỹ thuật 24/7 và cam kết chất lượng dịch vụ (SLA).
