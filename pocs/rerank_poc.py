# -*- coding: utf-8 -*-
"""
HypeRoom PoC - Document Reranking (Tái xếp hạng chứng cứ)
Tính năng: Sử dụng mô hình Cross-Encoder local (BAAI/bge-reranker-base) để xếp hạng độ liên quan
          của các đoạn văn bản chứng cứ đối với tin tức cần xác minh (Claim).
Cách chạy: python pocs/rerank_poc.py
"""

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import sys

def run_rerank_poc():
    # 1. Định nghĩa Claim (Tuyên bố cần kiểm chứng) và các nguồn tài liệu thô (đã qua bước lọc Vector thô)
    query = "Bộ Tài chính đề xuất điều chỉnh tăng thuế suất VAT lên 12%"
    
    documents = [
        # Tài liệu 1: Rất liên quan trực tiếp
        "Bộ Tài chính đang lấy ý kiến về dự thảo luật sửa đổi, trong đó đề xuất điều chỉnh mức thuế suất giá trị gia tăng (VAT) từ 10% lên 12% để tăng ngân sách nhà nước.",
        
        # Tài liệu 2: Có chứa từ khóa thuế nhưng nội dung khác (Không liên quan trực tiếp đến việc tăng lên 12%)
        "Cục Thuế TP.HCM thông báo về việc triển khai chương trình hỗ trợ quyết toán thuế thu nhập cá nhân năm nay qua cổng thông tin điện tử trực tuyến.",
        
        # Tài liệu 3: Nói về VAT nhưng là giảm thuế chứ không phải tăng thuế
        "Chính phủ vừa ban hành nghị định tiếp tục giảm 2% thuế suất thuế giá trị gia tăng (VAT) đối với các nhóm hàng hóa, dịch vụ đang áp dụng mức thuế suất 10%.",
        
        # Tài liệu 4: Hoàn toàn không liên quan
        "Thời tiết khu vực Nam Bộ chiều tối nay dự báo có mưa rào và dông vài nơi, nhiệt độ cao nhất dao động từ 32 đến 35 độ C."
    ]

    print("=== HYPE ROOM POC: DOCUMENT RERANKING ===")
    print(f"[*] Claim cần xác minh: \"{query}\"\n")
    print("[*] Đang tải mô hình Reranker (BAAI/bge-reranker-base ~ 270MB)...")
    
    try:
        model_name = "BAAI/bge-reranker-base"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name)
        model.eval() # Chuyển sang chế độ evaluation
    except Exception as e:
        print(f"[!] Lỗi khi tải mô hình: {e}")
        return

    print("[*] Đang tiến hành chấm điểm độ tương quan thực tế (Reranking)...")
    
    # Chuẩn bị cặp (Query, Document) cho mô hình Cross-Encoder
    pairs = [[query, doc] for doc in documents]
    
    try:
        with torch.no_grad():
            # Tokenize các cặp câu
            inputs = tokenizer(pairs, padding=True, truncation=True, return_tensors='pt', max_length=512)
            
            # Mô hình dự đoán điểm logits tương quan
            scores = model(**inputs).logits.view(-1).float()
            
            # Chuyển điểm số sang dạng xác suất hoặc phần trăm (dùng hàm Sigmoid)
            probabilities = torch.sigmoid(scores).tolist()
            
        # Gộp kết quả và sắp xếp giảm dần theo điểm số
        results = sorted(
            zip(documents, probabilities),
            key=lambda x: x[1],
            reverse=True
        )
        
        print("\n--- KẾT QUẢ TÁI XẾP HẠNG (RERANKED RESULTS) ---")
        for rank, (doc, score) in enumerate(results, 1):
            print(f"Hạng 1 [Độ liên quan: {score:.2%}]" if rank == 1 else f"Hạng {rank} [Độ liên quan: {score:.2%}]")
            print(f" > Nội dung: {doc}\n")
            
        print("[*] Gợi ý cho RAG: Nên chọn tài liệu Hạng 1 để làm ngữ cảnh sinh văn bản (Context) cho LLM.")
        
    except Exception as e:
        print(f"[!] Lỗi trong quá trình xếp hạng: {e}")

if __name__ == "__main__":
    # Chạy thử nghiệm
    run_rerank_poc()
