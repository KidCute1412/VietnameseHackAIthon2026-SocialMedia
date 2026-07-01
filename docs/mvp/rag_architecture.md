# HypeRoom MVP RAG

## 1. Cách làm được chốt

MVP không build vector database riêng.

RAG của HypeRoom sẽ làm theo cách:

- backend tự đi tìm evidence;
- backend tự lọc và chuẩn hóa evidence;
- backend gửi evidence đã chọn sang VNPT SmartBot để reasoning và sinh câu trả lời.

Nói ngắn gọn:

**retrieval ở backend, generation ở SmartBot**

## 2. Dữ liệu lấy từ đâu

Input cần kiểm chứng:

- text người dùng nhập;
- PDF / ảnh;
- audio;
- trend và social metrics từ VNPT vnSocial.

Evidence để kiểm chứng:

- báo chính thống;
- cổng thông tin chính phủ;
- thông cáo / văn bản chính thức;
- tài liệu nội bộ đã chọn trước nếu cần.

## 3. RAG chạy như nào

Luồng xử lý:

1. Nhận input.
2. Nếu là file thì gọi OCR/STT để lấy text.
3. Gọi SmartBot để trích xuất claim.
4. Với từng claim, backend search evidence online.
5. Backend crawl text bài viết.
6. Backend lọc, dedupe, chọn evidence tốt nhất.
7. Backend lưu evidence vào PostgreSQL.
8. Backend gửi claim + evidence sang SmartBot.
9. SmartBot trả về kết luận, giải thích, outline hoặc câu trả lời.

## 4. Dùng công nghệ gì

- API backend: FastAPI
- Database: PostgreSQL
- OCR: VNPT SmartReader
- STT: VNPT SmartVoice
- Social signals: VNPT vnSocial
- Search online: Tavily
- Extract text bài báo: Trafilatura
- LLM reasoning / generation: VNPT SmartBot

## 5. Backend làm gì

Backend chịu trách nhiệm:

- điều phối toàn bộ pipeline RAG;
- tạo query search từ claim;
- search theo domain whitelist;
- lọc nguồn rác;
- dedupe kết quả;
- chọn evidence tốt nhất;
- lưu evidence và audit;
- build context gửi SmartBot.

## 6. SmartBot làm gì

SmartBot chỉ dùng cho:

- trích xuất claim;
- đọc claim + evidence;
- suy luận đúng/sai/chưa đủ dữ kiện;
- sinh giải thích;
- sinh outline;
- trả lời Q&A có bám theo evidence.

SmartBot không dùng để:

- tự search internet;
- tự chọn nguồn cuối cùng;
- tự làm retrieval.

## 7. Lọc dữ liệu thế nào

Chỉ giữ evidence:

- thuộc domain chính thống;
- có title và URL rõ ràng;
- có nội dung bài viết đủ dài;
- liên quan trực tiếp đến claim;
- không trùng bài đã lấy trước đó.

Không dùng làm evidence kết luận:

- Facebook post;
- TikTok post;
- comment mạng xã hội;
- blog cá nhân;
- trang copy báo.

## 8. Vì sao không dùng vector DB trong MVP

Vì MVP cần ship nhanh.

Nếu build vector DB riêng sẽ phát sinh thêm:

- ingest dữ liệu;
- chunking;
- embedding;
- index;
- sync dữ liệu;
- tuning retrieval.

Phần này không cần thiết cho MVP hiện tại.

## 9. Kết luận

Giải pháp RAG cho MVP là:

- **backend làm retrieval**
- **SmartBot làm reasoning và generation**
- **evidence lấy từ search online nguồn chính thống**
- **PostgreSQL lưu claims, evidences và kết quả**

Đây là cách đơn giản nhất, dễ làm nhất và phù hợp nhất cho MVP.
