# -*- coding: utf-8 -*-
"""
HypeRoom PoC - RSS Article Extractor
Tính năng: Đọc RSS Feed, lấy link 3 bài báo mới nhất, tải HTML và trích xuất nội dung bài viết sạch.
Cách chạy: python pocs/rss-extract.py
"""

import xml.etree.ElementTree as ET
import requests
import trafilatura

# Sử dụng RSS Tin thế giới của VnExpress làm Demo đầu vào
RSS_URL = "https://vnexpress.net/rss/the-gioi.rss"

def get_latest_rss_items(rss_url: str, limit: int = 3):
    print(f"[*] Đang tải RSS Feed từ: {rss_url}...")
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(rss_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Phân tích cú pháp XML RSS
        root = ET.fromstring(response.content)
        items = []
        
        # Duyệt tìm các thẻ <item> trong channel
        for item in root.findall(".//item")[:limit]:
            title = item.find("title").text
            link = item.find("link").text
            pub_date = item.find("pubDate").text if item.find("pubDate") is not None else "N/A"
            items.append({
                "title": title,
                "link": link,
                "pub_date": pub_date
            })
        return items
    except Exception as e:
        print(f"[!] Lỗi khi tải/parse RSS: {e}")
        return []

def extract_article_body(url: str) -> str:
    try:
        # Tải HTML
        html_data = trafilatura.fetch_url(url)
        if not html_data:
            return "Không thể tải HTML."
            
        # Trích xuất text sạch loại bỏ boilerplate
        text = trafilatura.extract(html_data, output_format="txt")
        return text if text else "Không thể trích xuất văn bản từ HTML."
    except Exception as e:
        return f"Lỗi cào dữ liệu: {e}"

if __name__ == "__main__":
    print("=== HYPE ROOM POC: RSS & ARTICLE EXTRACTOR ===")
    
    # 1. Lấy 3 bài báo mới nhất từ RSS
    articles = get_latest_rss_items(RSS_URL, limit=3)
    
    if not articles:
        print("[!] Không tìm thấy bài báo nào hoặc có lỗi xảy ra.")
    else:
        print(f"[+] Tìm thấy {len(articles)} bài viết mới nhất.\n")
        
        # 2. Lấy nội dung chi tiết cho từng bài
        for idx, art in enumerate(articles):
            print(f"--- BÀI BÁO {idx+1} ---")
            print(f"Tiêu đề: {art['title']}")
            print(f"Link: {art['link']}")
            print(f"Thời gian: {art['pub_date']}")
            print("[*] Đang tải và trích xuất nội dung sạch...")
            
            body = extract_article_body(art["link"])
            
            print(body)
