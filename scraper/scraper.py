"""
PropSafe Real Estate Scraper
============================
Cào dữ liệu bất động sản từ kết quả tìm kiếm Google
và chuyển đổi sang định dạng JSON khớp với PropSafe.

Sử dụng:
    python scraper.py
    python scraper.py --query "mua nhà quận 7"
    python scraper.py --output properties.json
    python scraper.py --post-to-api http://localhost:3000/api/properties/bulk

Lưu ý:
    - Script này cào từ Google Search để lấy danh sách listings
    - Có thể bị chặn nếu gửi quá nhiều request
    - Nên dùng --delay để tránh bị block
"""

import json
import re
import sys
import time
import random
import argparse
from datetime import datetime

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("❌ Cần cài thư viện. Chạy lệnh:")
    print("   pip install requests beautifulsoup4 lxml")
    sys.exit(1)


# ============ CONFIGURATION ============

DEFAULT_QUERIES = [
    "mua bán nhà đất TP HCM",
    "căn hộ chung cư TP HCM giá tốt",
    "đất nền Long An giá rẻ",
    "biệt thự Quận 7 HCM",
    "nhà phố Thủ Đức bán"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

# HCMC area approximate coords for random placement  
HCMC_BOUNDS = {
    "lat_min": 10.65,
    "lat_max": 10.90,
    "lng_min": 106.55,
    "lng_max": 106.80
}


# ============ SCRAPER FUNCTIONS ============

def search_google(query, num_results=10):
    """Search Google and extract result links and snippets."""
    print(f"🔍 Tìm kiếm: {query}")
    
    url = "https://www.google.com/search"
    params = {
        "q": f"site:batdongsan.com.vn {query}",
        "num": num_results,
        "hl": "vi"
    }
    
    try:
        response = requests.get(url, params=params, headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "lxml")
        
        results = []
        for g in soup.select("div.g, div[data-hveid]"):
            # Extract title
            title_el = g.select_one("h3")
            if not title_el:
                continue
            title = title_el.get_text(strip=True)
            
            # Extract link
            link_el = g.select_one("a[href]")
            link = link_el["href"] if link_el else ""
            
            # Extract snippet
            snippet_el = g.select_one("div.VwiC3b, span.aCOpRe, div[data-sncf]")
            snippet = snippet_el.get_text(strip=True) if snippet_el else ""
            
            if title and ("bán" in title.lower() or "mua" in title.lower() or 
                         "nhà" in title.lower() or "đất" in title.lower() or
                         "căn hộ" in title.lower()):
                results.append({
                    "title": title,
                    "link": link,
                    "snippet": snippet
                })
        
        print(f"   → Tìm thấy {len(results)} kết quả")
        return results
        
    except requests.RequestException as e:
        print(f"   ⚠️  Lỗi tìm kiếm: {e}")
        return []


def parse_listing(result):
    """Parse a search result into PropSafe property format."""
    title = result.get("title", "")
    snippet = result.get("snippet", "")
    link = result.get("link", "")
    combined_text = f"{title} {snippet}"
    
    # Extract price
    price = extract_price(combined_text)
    price_num = price_to_number(price)
    
    # Extract area
    area = extract_area(combined_text)
    
    # Determine property type
    prop_type = detect_type(combined_text)
    
    # Extract address  
    address = extract_address(combined_text)
    
    # Extract bedrooms
    bedrooms = extract_bedrooms(combined_text)
    
    # Generate random coords within HCMC area
    lat = random.uniform(HCMC_BOUNDS["lat_min"], HCMC_BOUNDS["lat_max"])
    lng = random.uniform(HCMC_BOUNDS["lng_min"], HCMC_BOUNDS["lng_max"])
    
    return {
        "name": clean_title(title),
        "address": address or "TP. Hồ Chí Minh",
        "lat": round(lat, 4),
        "lng": round(lng, 4),
        "price": price,
        "priceNum": price_num,
        "area": area,
        "type": prop_type,
        "bedrooms": bedrooms,
        "description": snippet[:200] if snippet else title,
        "riskScore": 0,  # Will be computed by AI agents
        "agents": {
            "legal": {"score": 0, "findings": []},
            "market": {"score": 0, "findings": []},
            "environment": {"score": 0, "findings": []},
            "fraud": {"score": 0, "findings": []}
        },
        "source": "scraper",
        "sourceUrl": link
    }


# ============ EXTRACTION HELPERS ============

def extract_price(text):
    """Extract price from text."""
    # Match patterns like "5.2 tỷ", "850 triệu", "3,5 tỷ"
    patterns = [
        r'(\d+[.,]?\d*)\s*tỷ',
        r'(\d+[.,]?\d*)\s*triệu',
        r'(\d+[.,]?\d*)\s*tr(?:iệu)?(?:\s|/)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            num = match.group(1).replace(',', '.')
            if 'tỷ' in text[match.start():match.end() + 5].lower():
                return f"{num} tỷ"
            else:
                return f"{num} triệu"
    
    return "Thương lượng"


def price_to_number(price_str):
    """Convert price string to number (in millions)."""
    try:
        match = re.search(r'(\d+[.,]?\d*)', price_str)
        if not match:
            return 0
        
        num = float(match.group(1).replace(',', '.'))
        
        if 'tỷ' in price_str:
            return int(num * 1000)
        elif 'triệu' in price_str or 'tr' in price_str:
            return int(num)
        return 0
    except:
        return 0


def extract_area(text):
    """Extract area from text."""
    match = re.search(r'(\d+[.,]?\d*)\s*m[²2]', text, re.IGNORECASE)
    if match:
        return f"{match.group(1)}m²"
    return "N/A"


def detect_type(text):
    """Detect property type from text."""
    text_lower = text.lower()
    types = [
        ("biệt thự", "Biệt thự"),
        ("penthouse", "Penthouse"),
        ("shophouse", "Shophouse"),
        ("căn hộ", "Căn hộ"),
        ("chung cư", "Căn hộ"),
        ("nhà phố", "Nhà phố"),
        ("nhà mặt tiền", "Nhà phố"),
        ("đất nền", "Đất nền"),
        ("đất thổ cư", "Đất thổ cư"),
        ("đất vườn", "Đất vườn"),
        ("nhà xưởng", "Nhà xưởng"),
        ("nhà cấp 4", "Nhà cấp 4"),
        ("nhà", "Nhà phố"),
        ("đất", "Đất nền"),
    ]
    
    for keyword, prop_type in types:
        if keyword in text_lower:
            return prop_type
    
    return "Khác"


def extract_address(text):
    """Extract address from text."""
    # Look for common address patterns
    patterns = [
        r'(?:tại|ở|địa chỉ:?)\s*(.+?)(?:\.|,|\s*-\s*giá|\s*diện tích)',
        r'((?:Quận|Q\.|Huyện|TP\.|Phường|Đường|Xã)\s+[\w\s,]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            addr = match.group(1).strip()
            if len(addr) > 10:
                return addr[:100]
    
    return ""


def extract_bedrooms(text):
    """Extract number of bedrooms from text."""
    match = re.search(r'(\d+)\s*(?:phòng ngủ|PN|pn|bedroom)', text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return 0


def clean_title(title):
    """Clean up title text."""
    # Remove common prefixes/suffixes
    title = re.sub(r'^(?:Bán|Cho thuê|Cần bán)\s*', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\s*-\s*Batdongsan\.com\.vn$', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\s*\|\s*.*$', '', title)
    return title.strip()[:100] or "Bất động sản"


# ============ MAIN FLOW ============

def scrape(queries=None, num_per_query=5, delay=2):
    """Run the full scraping pipeline."""
    queries = queries or DEFAULT_QUERIES
    all_properties = []
    seen_titles = set()
    
    print(f"\n🛡️  PropSafe Scraper")
    print(f"   Queries: {len(queries)}")
    print(f"   Results/query: {num_per_query}")
    print(f"   Delay: {delay}s\n")
    
    for i, query in enumerate(queries):
        results = search_google(query, num_per_query)
        
        for result in results:
            prop = parse_listing(result)
            
            # Deduplicate by title
            if prop["name"] not in seen_titles:
                seen_titles.add(prop["name"])
                all_properties.append(prop)
                print(f"   ✅ {prop['name']} | {prop['price']} | {prop['type']}")
        
        # Rate limiting
        if i < len(queries) - 1:
            wait = delay + random.uniform(0, 2)
            print(f"   ⏳ Chờ {wait:.1f}s...")
            time.sleep(wait)
    
    print(f"\n📊 Tổng cộng: {len(all_properties)} bất động sản\n")
    return all_properties


def save_json(properties, filename="scraped_properties.json"):
    """Save properties to JSON file."""
    output = {
        "metadata": {
            "scraped_at": datetime.now().isoformat(),
            "total": len(properties),
            "source": "Google Search / batdongsan.com.vn"
        },
        "properties": properties
    }
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Saved to {filename}")
    return filename


def post_to_api(properties, api_url):
    """Post scraped properties to PropSafe backend API."""
    print(f"📡 Posting {len(properties)} properties to {api_url}")
    
    try:
        response = requests.post(
            api_url,
            json={"properties": properties},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        response.raise_for_status()
        result = response.json()
        print(f"✅ Imported: {result.get('inserted', 0)} properties")
        return result
    except requests.RequestException as e:
        print(f"❌ API error: {e}")
        return None


# ============ CLI ============

def main():
    parser = argparse.ArgumentParser(
        description="PropSafe Real Estate Scraper - Cào dữ liệu BĐS từ Google"
    )
    parser.add_argument(
        "--query", "-q",
        type=str,
        help="Custom search query (default: multiple HCMC queries)"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default="scraped_properties.json",
        help="Output JSON filename (default: scraped_properties.json)"
    )
    parser.add_argument(
        "--num", "-n",
        type=int,
        default=5,
        help="Number of results per query (default: 5)"
    )
    parser.add_argument(
        "--delay", "-d",
        type=float,
        default=3,
        help="Delay between queries in seconds (default: 3)"
    )
    parser.add_argument(
        "--post-to-api",
        type=str,
        help="URL to POST results to (e.g., http://localhost:3000/api/properties/bulk)"
    )
    
    args = parser.parse_args()
    
    # Build query list
    queries = [args.query] if args.query else DEFAULT_QUERIES
    
    # Scrape
    properties = scrape(
        queries=queries,
        num_per_query=args.num,
        delay=args.delay
    )
    
    if not properties:
        print("⚠️  Không tìm thấy dữ liệu. Thử lại với query khác.")
        return
    
    # Save to JSON
    save_json(properties, args.output)
    
    # Optionally post to API
    if args.post_to_api:
        post_to_api(properties, args.post_to_api)
    
    print("\n🎉 Hoàn tất! Kiểm tra file JSON hoặc import vào PropSafe backend.\n")


if __name__ == "__main__":
    main()
