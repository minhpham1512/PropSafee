// ===== Behavioral & Fraud Detection Agent =====
// Detects anomalies: suspicious pricing, inconsistent info, fraud patterns

const BehaviorAgent = {
    name: "Phát Hiện Gian Lận",
    icon: "scan-eye",
    type: "fraud",
    
    analyze(property) {
        return {
            agentName: this.name,
            agentIcon: this.icon,
            agentType: this.type,
            score: property.agents.fraud.score,
            riskLevel: getRiskLevel(property.agents.fraud.score),
            findings: property.agents.fraud.findings,
            categories: [
                "Bất thường giá cả",
                "Thông tin không nhất quán",
                "Mẫu lừa đảo phổ biến",
                "Xác minh danh tính"
            ]
        };
    },
    
    // Call backend API which calls Gemini
    async analyzeWithAI(propertyText) {
        try {
            console.log(`🤖 BehaviorAgent analyzing with AI...`);
            const res = await fetch('http://localhost:3000/api/analyze/fraud', {
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
                    "Bất thường giá cả",
                    "Thông tin không nhất quán",
                    "Mẫu lừa đảo phổ biến",
                    "Xác minh danh tính"
                ],
                isAI: true
            };
        } catch (err) {
            console.warn('⚠️ BehaviorAgent AI failed, fallback to mock data:', err);
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
