// ===== Legal & Regulation Agent =====
// Analyzes legal risks: land type, red book status, zoning, disputes

const LegalAgent = {
    name: "Pháp Lý & Quy Hoạch",
    icon: "scale",
    type: "legal",
    
    analyze(property) {
        return {
            agentName: this.name,
            agentIcon: this.icon,
            agentType: this.type,
            score: property.agents.legal.score,
            riskLevel: getRiskLevel(property.agents.legal.score),
            findings: property.agents.legal.findings,
            categories: [
                "Tình trạng sổ đỏ/sổ hồng",
                "Quy hoạch sử dụng đất",
                "Tranh chấp & khiếu nại",
                "Giấy phép xây dựng"
            ]
        };
    },
    
    // Call backend API which calls Gemini
    async analyzeWithAI(propertyText) {
        try {
            console.log(`🤖 LegalAgent analyzing with AI...`);
            const res = await fetch('http://localhost:3000/api/analyze/legal', {
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
                    "Tình trạng sổ đỏ/sổ hồng",
                    "Quy hoạch sử dụng đất",
                    "Tranh chấp & khiếu nại",
                    "Giấy phép xây dựng"
                ],
                isAI: true
            };
        } catch (err) {
            console.warn('⚠️ LegalAgent AI failed, fallback to mock data:', err);
            // Fallback object struct
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
