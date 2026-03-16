// ===== AI Analysis Routes (Gemini API) =====
const express = require('express');
const router = express.Router();

// Lazy-load Gemini to avoid crash if key not set
let genAI = null;
let model = null;

function initGemini() {
    if (model) return model;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_GEMINI')) {
        return null;
    }
    
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        console.log('✅ Gemini AI initialized');
        return model;
    } catch (err) {
        console.error('❌ Gemini init failed:', err.message);
        return null;
    }
}

// Helper: call Gemini with a structured prompt
async function analyzeWithGemini(agentType, propertyText) {
    const gemini = initGemini();
    if (!gemini) {
        throw new Error('Gemini API not configured. Set GEMINI_API_KEY in .env');
    }

    const prompts = {
        legal: `Bạn là Legal & Regulation Agent trong hệ thống PropSafe phân tích rủi ro bất động sản.
Hãy phân tích RỦI RO PHÁP LÝ cho bất động sản sau và trả về KẾT QUẢ dạng JSON.

Đánh giá các yếu tố:
- Tình trạng sổ đỏ/sổ hồng
- Quy hoạch sử dụng đất
- Tranh chấp & khiếu nại
- Giấy phép xây dựng

BẤT ĐỘNG SẢN:
${propertyText}

Trả về ĐÚNG định dạng JSON sau (KHÔNG kèm markdown):
{
  "score": <số từ 0-100, 0 = an toàn nhất, 100 = rủi ro nhất>,
  "findings": [
    {"text": "<nhận xét 1>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 2>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 3>", "positive": true/false, "negative": true/false}
  ]
}`,

        market: `Bạn là Market Intelligence Agent trong hệ thống PropSafe phân tích rủi ro bất động sản.
Hãy phân tích RỦI RO THỊ TRƯỜNG cho bất động sản sau và trả về KẾT QUẢ dạng JSON.

Đánh giá các yếu tố:
- So sánh giá với khu vực
- Lịch sử giao dịch
- Tốc độ tăng giá
- Dấu hiệu đầu cơ

BẤT ĐỘNG SẢN:
${propertyText}

Trả về ĐÚNG định dạng JSON sau (KHÔNG kèm markdown):
{
  "score": <số từ 0-100, 0 = an toàn nhất, 100 = rủi ro nhất>,
  "findings": [
    {"text": "<nhận xét 1>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 2>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 3>", "positive": true/false, "negative": true/false}
  ]
}`,

        environment: `Bạn là Environmental Risk Agent trong hệ thống PropSafe phân tích rủi ro bất động sản.
Hãy phân tích RỦI RO MÔI TRƯỜNG cho bất động sản sau và trả về KẾT QUẢ dạng JSON.

Đánh giá các yếu tố:
- Rủi ro ngập lụt
- Sạt lở & địa chất
- Ô nhiễm khu vực
- Hạ tầng giao thông

BẤT ĐỘNG SẢN:
${propertyText}

Trả về ĐÚNG định dạng JSON sau (KHÔNG kèm markdown):
{
  "score": <số từ 0-100, 0 = an toàn nhất, 100 = rủi ro nhất>,
  "findings": [
    {"text": "<nhận xét 1>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 2>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 3>", "positive": true/false, "negative": true/false}
  ]
}`,

        fraud: `Bạn là Behavioral & Fraud Detection Agent trong hệ thống PropSafe phân tích rủi ro bất động sản.
Hãy phân tích DẤU HIỆU GIAN LẬN cho bất động sản sau và trả về KẾT QUẢ dạng JSON.

Đánh giá các yếu tố:
- Bất thường giá cả
- Thông tin không nhất quán
- Mẫu lừa đảo phổ biến
- Xác minh danh tính

BẤT ĐỘNG SẢN:
${propertyText}

Trả về ĐÚNG định dạng JSON sau (KHÔNG kèm markdown):
{
  "score": <số từ 0-100, 0 = an toàn nhất, 100 = rủi ro nhất>,
  "findings": [
    {"text": "<nhận xét 1>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 2>", "positive": true/false, "negative": true/false},
    {"text": "<nhận xét 3>", "positive": true/false, "negative": true/false}
  ]
}`
    };

    const prompt = prompts[agentType];
    if (!prompt) throw new Error(`Unknown agent type: ${agentType}`);

    const result = await gemini.generateContent(prompt);
    const response = result.response.text();
    
    // Clean response: remove markdown code fences if present
    const cleaned = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
    
    return JSON.parse(cleaned);
}

// POST /api/analyze/legal
router.post('/legal', async (req, res) => {
    try {
        const { propertyText, property } = req.body;
        const text = propertyText || formatProperty(property);
        const result = await analyzeWithGemini('legal', text);
        res.json({ agent: 'legal', ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/analyze/market
router.post('/market', async (req, res) => {
    try {
        const { propertyText, property } = req.body;
        const text = propertyText || formatProperty(property);
        const result = await analyzeWithGemini('market', text);
        res.json({ agent: 'market', ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/analyze/environment
router.post('/environment', async (req, res) => {
    try {
        const { propertyText, property } = req.body;
        const text = propertyText || formatProperty(property);
        const result = await analyzeWithGemini('environment', text);
        res.json({ agent: 'environment', ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/analyze/fraud
router.post('/fraud', async (req, res) => {
    try {
        const { propertyText, property } = req.body;
        const text = propertyText || formatProperty(property);
        const result = await analyzeWithGemini('fraud', text);
        res.json({ agent: 'fraud', ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/analyze/full — Run all 4 agents + orchestrator
router.post('/full', async (req, res) => {
    try {
        const { propertyText, property } = req.body;
        const text = propertyText || formatProperty(property);

        // Run all 4 agents in parallel
        const [legal, market, environment, fraud] = await Promise.all([
            analyzeWithGemini('legal', text),
            analyzeWithGemini('market', text),
            analyzeWithGemini('environment', text),
            analyzeWithGemini('fraud', text)
        ]);

        // Orchestrator: compute weighted score
        const weights = { legal: 0.30, market: 0.25, environment: 0.20, fraud: 0.25 };
        const overallScore = Math.round(
            legal.score * weights.legal +
            market.score * weights.market +
            environment.score * weights.environment +
            fraud.score * weights.fraud
        );

        const riskLevel = overallScore <= 35 ? 'low' : overallScore <= 65 ? 'medium' : 'high';
        const riskLabel = overallScore <= 35 ? 'Thấp' : overallScore <= 65 ? 'Trung bình' : 'Cao';

        res.json({
            overallScore,
            riskLevel,
            riskLabel,
            agents: { legal, market, environment, fraud },
            analyzedAt: new Date().toISOString()
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Helper: format property object into readable text for AI
function formatProperty(property) {
    if (!property) return '';
    return `
Tên: ${property.name || ''}
Địa chỉ: ${property.address || ''}
Giá: ${property.price || ''}
Diện tích: ${property.area || ''}
Loại: ${property.type || ''}
Phòng ngủ: ${property.bedrooms || 0}
Mô tả: ${property.description || ''}
    `.trim();
}

module.exports = router;
