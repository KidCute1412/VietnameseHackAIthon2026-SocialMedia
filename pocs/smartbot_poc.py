# -*- coding: utf-8 -*-
"""
HypeRoom PoC - VNPT SmartBot Integration (Tích hợp Trợ lý ảo tác nghiệp)
Tính năng: Mô phỏng kết nối và gửi/nhận dữ liệu từ API VNPT SmartBot (Dịch vụ SmartBot nâng cao hỏi đáp dùng LLM).
          Trợ lý ảo sẽ trả lời câu hỏi của phóng viên dựa trên ngữ cảnh bài viết đang soạn thảo 
          và báo cáo từ động cơ kiểm chứng (Trust/Risk Engine).
Cách chạy: python pocs/smartbot_poc.py
"""

import json
import requests
import sys
import time

class VNPTSmartBotClient:
    def __init__(self, api_url=None, token=None, bot_id=None):
        # Địa chỉ API mặc định của VNPT SmartBot (giả định theo tài liệu tích hợp)
        self.api_url = api_url or "https://api.vnpt.vn/smartbot/v2/chat"
        self.token = token or "MOCK_VNPT_TOKEN_123456"
        self.bot_id = bot_id or "bot_hyperoom_assistant_01"
        self.session_id = f"session_{int(time.time())}"

    def send_message(self, user_message, context_data=None, stream=False):
        """
        Gửi tin nhắn của phóng viên kèm theo ngữ cảnh bài viết/báo cáo xác thực lên VNPT SmartBot
        """
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        # Cấu trúc Payload gửi đi theo tài liệu tích hợp API VNPT SmartBot nâng cao
        payload = {
            "bot_id": self.bot_id,
            "session_id": self.session_id,
            "message": user_message,
            "stream": stream,
            # Gửi thêm ngữ cảnh (Context) để SmartBot trả lời chính xác, tránh ảo giác (Hallucination)
            "context": context_data or {}
        }

        # Nếu có Token thật thì gọi API thật, nếu không sẽ chạy chế độ Mock/Simulation
        if self.token != "MOCK_VNPT_TOKEN_123456":
            try:
                response = requests.post(self.api_url, headers=headers, json=payload, timeout=10)
                if response.status_code == 200:
                    return response.json()
                else:
                    return {"error": True, "message": f"API Error: {response.status_code} - {response.text}"}
            except Exception as e:
                return {"error": True, "message": f"Connection failed: {str(e)}"}
        else:
            # Mô phỏng phản hồi của VNPT SmartBot dựa trên câu hỏi và ngữ cảnh (Mock Engine)
            return self._simulate_smartbot_response(user_message, context_data)

    def _simulate_smartbot_response(self, message, context):
        """
        Hàm giả lập phản hồi thông minh của SmartBot (RAG) khi chạy thử nghiệm ngoại tuyến
        """
        time.sleep(1.2)  # Giả lập độ trễ mạng và LLM sinh từ
        msg_lower = message.lower()
        
        article_title = context.get("article_title", "Không rõ")
        draft_content = context.get("draft_content", "")
        trust_score = context.get("trust_score", 100)
        risk_level = context.get("risk_level", "Low")
        evidences = context.get("evidences", [])

        # Luật phản hồi đơn giản dựa trên từ khóa câu hỏi
        if "tại sao" in msg_lower or "rủi ro" in msg_lower or "risk" in msg_lower:
            if risk_level == "High":
                text = (
                    f"Trợ lý HypeRoom xin trả lời:\n"
                    f"Bài viết '{article_title}' bị đánh giá rủi ro CAO (High Risk) chủ yếu do chứa các thực thể nhạy cảm "
                    f"và tuyên bố có độ tương đồng thấp với các nguồn tin chính thống (Trust Score: {trust_score}/100).\n"
                    f"Bằng chứng đối chiếu: {evidences[0] if evidences else 'Không tìm thấy bằng chứng phản bác trực tiếp'}.\n"
                    f"Khuyến nghị: Bạn cần kiểm tra lại nguồn trích dẫn hoặc thay đổi cách tiếp cận trước khi xuất bản."
                )
            else:
                text = f"Bài viết hiện tại có mức rủi ro thấp ({risk_level}). Bạn có thể yên tâm tiếp tục biên tập."

        elif "sapo" in msg_lower or "viết" in msg_lower or "outline" in msg_lower:
            text = (
                f"Dưới đây là gợi ý viết lại đoạn Sapo/Tóm tắt cho bài báo '{article_title}':\n\n"
                f"\"Trong bối cảnh các nguồn tin không chính thống đang lan truyền thông tin sai lệch về chủ đề X, "
                f"báo cáo xác thực mới nhất từ cơ quan chức năng đã đưa ra những số liệu làm sáng tỏ vấn đề này...\"\n\n"
                f"Bạn có muốn tôi điều chỉnh văn phong trang trọng hơn hay ngắn gọn hơn không?"
            )
        
        elif "chứng cứ" in msg_lower or "bằng chứng" in msg_lower or "verify" in msg_lower:
            text = (
                f"Đã tìm thấy {len(evidences)} chứng cứ liên quan trong Vector DB:\n"
                + "\n".join([f"- {ev}" for ev in evidences]) + 
                f"\nĐộ tin cậy tổng thể của nguồn tin: {trust_score}/100."
            )
        else:
            text = (
                f"Trợ lý SmartBot HypeRoom đã nhận được yêu cầu.\n"
                f"Đang phân tích bài viết: '{article_title}'.\n"
                f"Bạn có thể yêu cầu tôi viết lại Sapo, giải thích mức độ rủi ro ({risk_level}) "
                f"hoặc trích dẫn các chứng cứ kiểm chứng."
            )

        return {
            "status": "success",
            "bot_response": text,
            "usage": {
                "prompt_tokens": 150,
                "completion_tokens": 200,
                "total_tokens": 350
            }
        }


def main():
    print("=== HYPE ROOM POC: VNPT SMARTBOT INTEGRATION DEMO ===")
    
    # Giả lập Ngữ cảnh bài viết và báo cáo xác định từ các Core Engine gửi kèm lên API
    sample_context = {
        "article_title": "Tin đồn điều chỉnh thuế suất VAT lên 12%",
        "draft_content": "Có thông tin cho rằng Bộ Tài chính sẽ áp dụng mức thuế VAT mới 12% ngay từ tháng sau.",
        "trust_score": 35,
        "risk_level": "High",
        "evidences": [
            "Nghị định 72/2026/NĐ-CP: Tiếp tục giảm 2% thuế suất thuế giá trị gia tăng (VAT) đến hết năm 2026.",
            "Phát ngôn của Đại diện Bộ Tài chính: Chưa có kế hoạch tăng thuế suất VAT lên 12% trong năm nay."
        ]
    }

    client = VNPTSmartBotClient()
    
    print("\n[*] Ngữ cảnh bài viết hiện tại:")
    print(f" - Tiêu đề: {sample_context['article_title']}")
    print(f" - Trust Score: {sample_context['trust_score']}/100")
    print(f" - Risk Level: {sample_context['risk_level']}")
    print("-" * 50)

    # Các câu hỏi demo phóng viên thường hỏi
    questions = [
        "Tại sao bài viết này của tôi lại có mức rủi ro High Risk?",
        "Viết giúp tôi một đoạn Sapo để cải thiện bài viết này.",
        "Cho tôi xem các bằng chứng đối chiếu từ hệ thống."
    ]

    for i, q in enumerate(questions, 1):
        print(f"\n[Phóng viên hỏi {i}]: \"{q}\"")
        print("[*] Đang gửi yêu cầu và ngữ cảnh lên VNPT SmartBot API...")
        
        # Gửi tin nhắn kèm context
        result = client.send_message(q, context_data=sample_context)
        
        if "error" in result:
            print(f"[!] Lỗi: {result['message']}")
        else:
            print(f"[SmartBot trả lời]:\n{result['bot_response']}")
            print(f"[Token sử dụng]: {result['usage']['total_tokens']} tokens")
            print("-" * 50)

if __name__ == "__main__":
    main()
