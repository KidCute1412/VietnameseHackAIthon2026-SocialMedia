# -*- coding: utf-8 -*-
"""
HypeRoom PoC - PostgreSQL pgvector Integration Test
Tính năng: 
  1. Kết nối PostgreSQL và kích hoạt extension vector.
  2. Tạo bảng lưu trữ bài viết kèm vector nhúng ngữ nghĩa (768 chiều).
  3. Xây dựng chỉ mục HNSW để tìm kiếm siêu tốc không scan table.
  4. Nhúng câu truy vấn (Query Claim) và tìm kiếm Cosine Similarity trực tiếp bằng SQL.
Cách chạy: python pocs/pgvector_test.py
"""

import psycopg2
from sentence_transformers import SentenceTransformer
import numpy as np

# Cấu hình kết nối PostgreSQL (Khớp với docker-compose.yml)
DB_CONFIG = {
    "dbname": "hyproom_db",
    "user": "hyproom_user",
    "password": "hyproom_password",
    "host": "localhost",
    "port": "5432"
}

# 1. Khởi tạo mô hình nhúng SBERT Tiếng Việt
print("[*] Đang tải mô hình nhúng Tiếng Việt SBERT...")
model = SentenceTransformer("keepitreal/vietnamese-sbert")

# Dữ liệu bài báo mẫu của tòa soạn để làm kho tri thức đối chiếu
knowledge_base = [
    {
        "title": "Bộ Tài chính bác bỏ tin đồn tăng thuế VAT lên 12%",
        "content": "Bộ Tài chính khẳng định hoàn toàn không có đề xuất tăng thuế VAT lên 12% đối với các mặt hàng tiêu dùng từ tháng sau. Đây là các thông tin bịa đặt gây hoang mang dư luận."
    },
    {
        "title": "Chính phủ họp thường kỳ tháng 6 bàn về giá xăng dầu",
        "content": "Thủ tướng Chính phủ yêu cầu các bộ ngành giữ bình ổn thị trường giá xăng dầu, hỗ trợ tối đa hoạt động khôi phục sản xuất của doanh nghiệp trong quý III."
    },
    {
        "title": "Hướng dẫn mới về thuế suất ưu đãi linh kiện điện tử nhập khẩu",
        "content": "Nghị định quy định chi tiết việc áp dụng thuế suất ưu đãi đối với các linh kiện nhập khẩu phục vụ cho việc lắp ráp thiết bị công nghệ cao."
    }
]

def init_database_and_insert_data():
    try:
        # Kết nối tới database
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Kích hoạt extension pgvector
        print("[*] Đang kích hoạt extension pgvector trong database...")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        
        # Xóa bảng cũ nếu có và tạo bảng mới
        cursor.execute("DROP TABLE IF EXISTS articles;")
        # Lưu ý: vector(768) tương ứng với số chiều đầu ra của model vietnamese-sbert
        cursor.execute("""
            CREATE TABLE articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                content TEXT,
                embedding vector(768)
            );
        """)
        print("[+] Đã tạo bảng 'articles' thành công.")
        
        # Mã hóa và chèn các bài báo vào database
        print("[*] Đang tiến hành nhúng văn bản và lưu trữ vào database...")
        for doc in knowledge_base:
            # Nhúng gộp Tiêu đề và Nội dung
            text_to_embed = f"{doc['title']}: {doc['content']}"
            vector = model.encode(text_to_embed).tolist()
            
            # Chèn dòng dữ liệu kèm vector
            cursor.execute(
                "INSERT INTO articles (title, content, embedding) VALUES (%s, %s, %s);",
                (doc['title'], doc['content'], vector)
            )
        print(f"[+] Đã lưu thành công {len(knowledge_base)} bài viết vào PostgreSQL.")
        
        # Xây dựng index HNSW cho tìm kiếm khoảng cách Cosine (Cosine Distance <=> <=>)
        # Index này giúp tìm kiếm đồ thị đa tầng O(log N) mà không cần quét bảng
        print("[*] Đang xây dựng HNSW index trên cột embedding...")
        cursor.execute("""
            CREATE INDEX ON articles USING hnsw (embedding vector_cosine_ops);
        """)
        print("[+] Đã cấu hình chỉ mục HNSW thành công.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"[!] Lỗi kết nối hoặc xử lý Database: {e}")
        print("[!] Đảm bảo rằng Container Docker PostgreSQL đang chạy tại localhost:5432.")

def search_similar_articles(query_claim: str, top_k: int = 1):
    print(f"\n[*] Đang tìm kiếm bài báo đối chiếu cho Claim: \"{query_claim}\"")
    try:
        # 1. Nhúng câu truy vấn Claim thành Vector
        query_vector = model.encode(query_claim).tolist()
        
        # 2. Truy vấn tìm kiếm gần nhất bằng độ tương đồng Cosine trong SQL
        # Toán tử <=> biểu diễn Khoảng cách Cosine (Cosine Distance = 1 - Cosine Similarity)
        # Sắp xếp tăng dần theo khoảng cách (tương đương giảm dần theo độ tương đồng)
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Câu lệnh SQL truy vấn sử dụng Index HNSW (Không scan table)
        cursor.execute("""
            SELECT title, content, (1 - (embedding <=> %s::vector)) as similarity_score
            FROM articles
            ORDER BY embedding <=> %s::vector
            LIMIT %s;
        """, (query_vector, query_vector, top_k))
        
        results = cursor.fetchall()
        
        print("\n--- KẾT QUẢ ĐỐI CHIẾU TRUY VẤN TỪ PGVECTOR ---")
        for idx, row in enumerate(results):
            title, content, score = row
            print(f"Top {idx+1}: {title} | Điểm tương đồng ngữ nghĩa: {score:.4f}")
            print(f" -> Nội dung đối chiếu: {content}\n")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"[!] Lỗi truy vấn: {e}")

if __name__ == "__main__":
    # Bước 1: Khởi tạo DB, kích hoạt extension, nhúng và chèn data
    init_database_and_insert_data()
    
    # Bước 2: Truy vấn test tìm kiếm ngữ nghĩa
    search_similar_articles("Giá xăng dầu sắp tới có biến động gì không và nhà nước xử lý thế nào?")
    search_similar_articles("Nghe nói sắp tăng thuế suất VAT lên 12%?")
