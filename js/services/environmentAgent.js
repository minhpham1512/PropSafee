// ===== Environmental Risk Agent =====
// Analyzes environmental risks: flooding, landslide, pollution, infrastructure

const EnvironmentAgent = {
    name: "Môi Trường & Hạ Tầng",
    icon: "trees",
    type: "environment",
    
    analyze(property) {
        return {
            agentName: this.name,
            agentIcon: this.icon,
            agentType: this.type,
            score: property.agents.environment.score,
            riskLevel: getRiskLevel(property.agents.environment.score),
            findings: property.agents.environment.findings,
            categories: [
                "Rủi ro ngập lụt",
                "Sạt lở & địa chất",
                "Ô nhiễm khu vực",
                "Hạ tầng giao thông"
            ]
        };
    },
    
    // Call backend API which calls Gemini
    async analyzeWithAI(propertyText) {
        try {
            console.log(`🤖 EnvironmentAgent analyzing with AI...`);
            const res = await fetch('http://localhost:3000/api/analyze/environment', {
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
                    "Rủi ro ngập lụt",
                    "Sạt lở & địa chất",
                    "Ô nhiễm khu vực",
                    "Hạ tầng giao thông"
                ],
                isAI: true
            };
        } catch (err) {
            console.warn('⚠️ EnvironmentAgent AI failed, fallback to mock data:', err);
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
