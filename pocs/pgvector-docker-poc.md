# Hướng dẫn Chạy Thử nghiệm PoC Docker & pgvector cho HypeRoom

Tài liệu này hướng dẫn bạn cách khởi dựng nhanh một cơ sở dữ liệu PostgreSQL có tích hợp sẵn extension `pgvector` thông qua Docker để chạy kiểm thử tính năng **Tìm kiếm ngữ nghĩa siêu tốc (No Scan Table)** cho MVP.

---

## 1. Khởi động PostgreSQL Vector qua Docker

Đảm bảo bạn đã cài đặt Docker và Docker Desktop trên máy tính.

Mở terminal và di chuyển đến thư mục dự án, sau đó khởi chạy container PostgreSQL bằng file cấu hình đã được tạo:

```powershell
docker compose -f pocs/docker-compose.yml up -d
```

*Lệnh này sẽ tự động tải image `ankane/pgvector:latest` và khởi chạy cơ sở dữ liệu chạy ngầm tại cổng `5432`.*

---

## 2. Cài đặt các thư viện Python bổ trợ

Các thư viện kết nối database và nhúng vector được chỉ định cụ thể trong file `requirements.txt`. Bạn có thể cài đặt nhanh qua lệnh:

```powershell
pip install psycopg2-binary sentence-transformers numpy
```

---

## 3. Chạy mã kiểm thử truy vấn hình học

File script Python [pocs/pgvector_test.py](file:///D:/HackAIthon%202026/VietnameseHackAIthon2026-SocialMedia/pocs/pgvector_test.py) sẽ tự động thực hiện:
1. Kết nối tới database Docker vừa dựng.
2. Tạo extension `vector` và bảng lưu trữ tri thức `articles` có cột `embedding` kiểu vector 768 chiều.
3. Nhúng và chèn các bài viết mẫu.
4. Xây dựng index đồ thị đa tầng HNSW để tìm kiếm $\mathcal{O}(\log N)$.
5. Chạy hai câu truy vấn tìm kiếm ngữ nghĩa ngẫu nhiên (không chứa từ khóa trùng khớp 100%) để lấy ra kết quả đối chiếu.

Thực thi script:

```powershell
python pocs/pgvector_test.py
```

---

## 4. Kiểm tra mã nguồn

- File cấu hình Docker: [pocs/docker-compose.yml](file:///D:/HackAIthon%202026/VietnameseHackAIthon2026-SocialMedia/pocs/docker-compose.yml)
- File script kiểm thử: [pocs/pgvector_test.py](file:///D:/HackAIthon%202026/VietnameseHackAIthon2026-SocialMedia/pocs/pgvector_test.py)
