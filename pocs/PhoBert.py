# -*- coding: utf-8 -*-
"""
HypeRoom PoC - PhoBERT Sensitive Topic Classification
Tính năng: Sử dụng pipeline Transformers local để phân loại các chủ đề rủi ro/nhạy cảm.
Cách chạy: python pocs/PhoBert.py
"""

from transformers import pipeline
import sys

# Tập nhãn phân loại mẫu của tòa soạn
LABELS = ["Chính trị", "Pháp luật", "Kinh tế", "Xã hội", "An ninh trật tự", "Thông thường"]

def classify_news_text(text: str):
    print(f"[*] Đang khởi tạo pipeline phân loại zero-shot (HuggingFace)...")
    try:
        # Sử dụng mô hình đa ngôn ngữ hỗ trợ tiếng Việt cực tốt cho zero-shot classification
        # Thích hợp cho môi trường MVP 2 tuần không cần fine-tune lại nhãn
        classifier = pipeline(
            "zero-shot-classification",
            model="symanto/xlm-roberta-base-snli-mnli-anli-xnli",
            device=-1 # Chạy trên CPU
        )
    except Exception as e:
        print(f"[!] Lỗi khi tải mô hình: {e}")
        print("[!] Vui lòng cài đặt đầy đủ dependencies: pip install transformers torch sentencepiece")
        return
        
    print(f"[*] Đang tiến hành phân loại văn bản: \"{text[:60]}...\"")
    try:
        # Thực hiện phân loại zero-shot dựa trên tập nhãn tự định nghĩa
        result = classifier(text, candidate_labels=LABELS, hypothesis_template="Đây là tin tức về chủ đề {}.")
        
        print("\n--- KẾT QUẢ PHÂN LOẠI NHẠY CẢM ---")
        for label, score in zip(result["labels"], result["scores"]):
            # Hiển thị độ tự tin của từng nhãn
            print(f" - {label:20s}: {score:.2%}")
            
    except Exception as e:
        print(f"[!] Lỗi phân loại: {e}")

if __name__ == "__main__":
    print("=== HYPE ROOM POC: PHOBERT / ZERO-SHOT CLASSIFIER ===")
    
    # Text demo mang tính chất nhạy cảm tài chính/luật pháp cần kiểm duyệt
    demo_text = "Bộ Tài chính đang lấy ý kiến về dự thảo điều chỉnh thuế suất VAT lên 12% từ đầu tháng sau đối với hàng loạt mặt hàng tiêu dùng."
    
    # Nhận text truyền vào từ dòng lệnh nếu có
    if len(sys.argv) > 1:
        demo_text = " ".join(sys.argv[1:])
        
    classify_news_text(demo_text)
