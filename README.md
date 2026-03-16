# 🛡️ PropSafe — Real Estate Risk Intelligence Platform

> Hệ thống phân tích rủi ro bất động sản sử dụng kiến trúc Multi-Agent AI, giúp người mua đánh giá và phòng tránh rủi ro trước khi giao dịch.

![PropSafe Dashboard](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)
![Agents](https://img.shields.io/badge/AI_Agents-5-6366f1?style=for-the-badge)
![Properties](https://img.shields.io/badge/Properties-15-f59e0b?style=for-the-badge)

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Kiến trúc Agent](#-kiến-trúc-agent)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [Công nghệ](#-công-nghệ)
- [API Reference](#-api-reference)
- [Đóng góp](#-đóng-góp)

---

## 🎯 Tổng quan

### Vấn đề

Thị trường bất động sản Việt Nam tồn tại nhiều rủi ro:

- **Pháp lý không rõ ràng**: sổ đỏ giả, đất nằm trong quy hoạch, tranh chấp
- **Giá bị thổi phồng**: đầu cơ, định giá cao bất thường
- **Rủi ro môi trường**: ngập lụt, sạt lở, ô nhiễm, hạ tầng yếu
- **Lừa đảo**: dự án ma, tin đăng giả, thông tin không nhất quán

Người mua hiện phải tự kiểm tra từ nhiều nguồn rời rạc, dễ bỏ sót rủi ro quan trọng.

### Giải pháp

**PropSafe** sử dụng 5 AI Agent phân tích tự động, kết hợp dữ liệu pháp lý, thị trường, môi trường và hành vi để tạo **điểm rủi ro tổng hợp (0–100)** cho mỗi bất động sản, hiển thị trực quan trên bản đồ tương tác.

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🗺️ **Bản đồ tương tác** | Leaflet map với dark theme, marker xanh/vàng/đỏ theo mức rủi ro |
| 🔍 **Tìm kiếm & Lọc** | Tìm theo tên/địa chỉ, lọc theo mức rủi ro (Thấp/Trung bình/Cao) |
| 📊 **Risk Score Gauge** | Animated SVG radial gauge hiển thị điểm rủi ro 0–100 |
| 🤖 **5 AI Agents** | Phân tích pháp lý, thị trường, môi trường, gian lận + tổng hợp |
| 📄 **Báo cáo rủi ro** | Tải báo cáo chi tiết cho mỗi bất động sản |
| 🎨 **Dark Glassmorphism UI** | Giao diện premium với micro-animations |
| ⚡ **Zero Dependencies** | Không cần cài đặt, chỉ mở file HTML |

---

## 🤖 Kiến trúc Agent

```
Bất động sản được rao bán
         │
         ├──→ 📈 Market Agent ──────→ Phân tích giá thị trường
         ├──→ ⚖️ Legal Agent ───────→ Kiểm tra pháp lý & quy hoạch
         ├──→ 🌿 Environment Agent ─→ Phân tích rủi ro môi trường
         ├──→ 🔍 Behavior Agent ────→ Phát hiện dấu hiệu gian lận
         │
         └──→ 🎯 Orchestrator Agent
                    │
                    ├── Trọng số: Legal 30% | Market 25% | Environment 20% | Fraud 25%
                    └── Output: Risk Score (0-100) + Báo cáo tổng hợp
```

### Phân loại rủi ro

| Điểm | Mức độ | Màu | Khuyến nghị |
|------|--------|-----|-------------|
| 0–35 | 🟢 Thấp | Xanh | An toàn để giao dịch |
| 36–65 | 🟡 Trung bình | Vàng | Cần kiểm tra thêm |
| 66–100 | 🔴 Cao | Đỏ | Cảnh báo - Không nên giao dịch |

---

## 📁 Cấu trúc dự án

```
PropSafe/
├── index.html                  # Entry point
├── README.md
├── css/
│   ├── index.css               # Design system (tokens, animations, reset)
│   ├── header.css              # Header & navigation
│   ├── sidebar.css             # Sidebar, search, filters, property cards
│   ├── map.css                 # Leaflet map overrides & legend
│   ├── panel.css               # Property detail panel
│   ├── gauge.css               # Risk score SVG gauge
│   └── breakdown.css           # Agent breakdown cards
└── js/
    ├── app.js                  # App initialization
    ├── data/
    │   └── properties.js       # 15 mock properties (TP.HCM)
    ├── services/
    │   ├── legalAgent.js       # Legal & Regulation Agent
    │   ├── marketAgent.js      # Market Intelligence Agent
    │   ├── environmentAgent.js # Environmental Risk Agent
    │   ├── behaviorAgent.js    # Behavioral & Fraud Detection Agent
    │   └── orchestrator.js     # Orchestrator Agent
    └── components/
        ├── gauge.js            # Animated risk gauge
        ├── breakdown.js        # Agent breakdown grid
        ├── panel.js            # Property detail panel
        ├── sidebar.js          # Sidebar with search/filter
        └── map.js              # Leaflet map with markers
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Edge)
- Kết nối internet (để tải CDN: Leaflet, Google Fonts, Lucide Icons)

### Chạy ứng dụng

```bash
# Cách 1: Mở trực tiếp
# Double-click file index.html

# Cách 2: Dùng Live Server (nếu có VS Code)
# Click chuột phải vào index.html → Open with Live Server

# Cách 3: Dùng Python HTTP server
cd PropSafe
python -m http.server 8080
# Mở http://localhost:8080

# Cách 4: Dùng Node.js (nếu có)
npx serve .
```

> **Lưu ý**: Không cần `npm install` hay bất kỳ build step nào.

---

## 📖 Hướng dẫn sử dụng

1. **Xem bản đồ**: Các marker trên bản đồ hiển thị vị trí bất động sản với màu sắc theo mức rủi ro
2. **Tìm kiếm**: Nhập tên hoặc địa chỉ vào ô tìm kiếm ở sidebar
3. **Lọc rủi ro**: Click các nút "An toàn", "Trung bình", "Cao" để lọc
4. **Xem chi tiết**: Click vào property card hoặc marker trên bản đồ
5. **Phân tích**: Panel bên phải hiển thị:
   - Điểm rủi ro tổng hợp (animated gauge)
   - Nhận xét tổng quan
   - Phân tích từ 4 AI Agents
   - Quy trình phân tích workflow
6. **Tải báo cáo**: Click "Tải Báo Cáo Rủi Ro" để tải file báo cáo

---

## 🛠️ Công nghệ

| Thành phần | Công nghệ | Phiên bản |
|------------|-----------|-----------|
| Bản đồ | [Leaflet.js](https://leafletjs.com/) | 1.9.4 |
| Map Tiles | [CartoDB Dark Matter](https://carto.com/basemaps/) | — |
| Icons | [Lucide](https://lucide.dev/) | Latest |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) | — |
| Styling | Vanilla CSS (Glassmorphism + Dark Theme) | — |
| Core | HTML5 + Vanilla JavaScript (ES6+) | — |

---

## 🔌 API Reference

### Buyer Decision Support API

PropSafe cung cấp các object API có thể tích hợp vào nền tảng bất động sản:

```javascript
// Phân tích rủi ro một bất động sản
const report = Orchestrator.analyze(property);

// Kết quả trả về
{
  overallScore: 72,           // Điểm rủi ro tổng hợp (0-100)
  riskLevel: "high",          // "low" | "medium" | "high"
  riskLabel: "Cao",           // Label tiếng Việt
  summary: "⚠️ CẢNH BÁO...", // Nhận xét tự động
  agentResults: [             // Kết quả từ 4 agents
    { agentName: "Pháp Lý & Quy Hoạch", score: 78, findings: [...] },
    { agentName: "Thị Trường & Giá",     score: 65, findings: [...] },
    { agentName: "Môi Trường & Hạ Tầng", score: 70, findings: [...] },
    { agentName: "Phát Hiện Gian Lận",   score: 55, findings: [...] }
  ],
  workflow: [...]             // Quy trình phân tích
}

// Phân tích từng agent riêng lẻ
const legalResult  = LegalAgent.analyze(property);
const marketResult = MarketAgent.analyze(property);
const envResult    = EnvironmentAgent.analyze(property);
const fraudResult  = BehaviorAgent.analyze(property);
```

---

## 🤝 Đóng góp

1. Fork repo
2. Tạo branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

---

## 📄 License

MIT License — Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<p align="center">
  <strong>🛡️ PropSafe</strong> — Bảo vệ tài sản, minh bạch thị trường
  <br>
  <em>Built with ❤️ for Vietnamese real estate buyers</em>
</p>
