// ===== Market Intelligence Agent =====
// Analyzes market risks: price comparisons, history, speculation

const MarketAgent = {
    name: "Thị Trường & Giá",
    icon: "trending-up",
    type: "market",
    
    analyze(property) {
        return {
            agentName: this.name,
            agentIcon: this.icon,
            agentType: this.type,
            score: property.agents.market.score,
            riskLevel: getRiskLevel(property.agents.market.score),
            findings: property.agents.market.findings,
            categories: [
                "So sánh giá khu vực",
                "Lịch sử giao dịch",
                "Tốc độ tăng giá",
                "Dấu hiệu đầu cơ"
            ]
        };
    },
    
    // Call backend API which calls Gemini
    async analyzeWithAI(propertyText) {
        try {
            console.log(`🤖 MarketAgent analyzing with AI...`);
            const res = await fetch('http://localhost:3000/api/analyze/market', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyText })
            });
            
            if (!res.ok) throw new Error('API failed');
            
            const aiData = await res.json();
            return {
                agentName: this.name,
                agentIcon: this.icon,
                agentType: this.type,
                score: aiData.score || 0,
                riskLevel: getRiskLevel(aiData.score || 0),
                findings: aiData.findings || [],
                categories: [
                    "So sánh giá khu vực",
                    "Lịch sử giao dịch",
                    "Tốc độ tăng giá",
                    "Dấu hiệu đầu cơ"
                ],
                isAI: true
            };
        } catch (err) {
            console.warn('⚠️ MarketAgent AI failed, fallback to mock data:', err);
            return {
                agentName: this.name,
                agentIcon: this.icon,
                agentType: this.type,
                score: 50,
                riskLevel: 'medium',
                findings: [{ text: "Không thể kết nối AI, dữ liệu mô phỏng.", neutral: true }],
                categories: ["Lỗi kết nối"],
                isAI: false
            };
        }
    }
};
