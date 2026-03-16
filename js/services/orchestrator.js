// ===== Orchestrator Agent =====
// Combines all agent results to create comprehensive risk report

const Orchestrator = {
    agents: [LegalAgent, MarketAgent, EnvironmentAgent, BehaviorAgent],
    
    // Weights for each agent's contribution to overall score
    weights: {
        legal: 0.30,
        market: 0.25,
        environment: 0.20,
        fraud: 0.25
    },

    analyze(property) {
        const agentResults = this.agents.map(agent => agent.analyze(property));
        
        // Calculate weighted risk score
        const weightedScore = Math.round(
            property.agents.legal.score * this.weights.legal +
            property.agents.market.score * this.weights.market +
            property.agents.environment.score * this.weights.environment +
            property.agents.fraud.score * this.weights.fraud
        );

        return {
            property: property,
            overallScore: property.riskScore,
            weightedScore: weightedScore,
            riskLevel: getRiskLevel(property.riskScore),
            riskLabel: getRiskLabel(property.riskScore),
            agentResults: agentResults,
            summary: this.generateSummary(property, agentResults),
            workflow: this.getWorkflow(property)
        };
    },

    generateSummary(property, results) {
        const level = getRiskLevel(property.riskScore);
        const highRiskAgents = results.filter(r => getRiskLevel(r.score) === 'high');
        const medRiskAgents = results.filter(r => getRiskLevel(r.score) === 'medium');
        
        if (level === 'low') {
            return `Bất động sản này có mức rủi ro THẤP. Tất cả các yếu tố pháp lý, thị trường, môi trường và gian lận đều trong ngưỡng an toàn.`;
        }
        if (level === 'medium') {
            const areas = medRiskAgents.map(a => a.agentName).join(', ');
            return `Bất động sản có mức rủi ro TRUNG BÌNH. Cần lưu ý các yếu tố: ${areas}. Nên tìm hiểu kỹ trước khi giao dịch.`;
        }
        const areas = highRiskAgents.map(a => a.agentName).join(', ');
        return `⚠️ CẢNH BÁO: Bất động sản có mức rủi ro CAO. Các yếu tố nghiêm trọng: ${areas}. Khuyến nghị KHÔNG nên giao dịch.`;
    },

    getWorkflow(property) {
        return [
            { agent: "Market Agent", action: "Phân tích giá thị trường", done: true },
            { agent: "Legal Agent", action: "Kiểm tra pháp lý & quy hoạch", done: true },
            { agent: "Environment Agent", action: "Phân tích rủi ro môi trường", done: true },
            { agent: "Behavior Agent", action: "Kiểm tra dấu hiệu gian lận", done: true },
            { agent: "Orchestrator", action: "Tổng hợp báo cáo rủi ro", done: true }
        ];
    },

    // Method to trigger full AI analysis via Backend API
    async analyzeWithAI(property) {
        try {
            console.log('🧠 Orchestrator requesting full AI analysis...');
            const res = await fetch('http://localhost:3000/api/analyze/full', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ property })
            });

            if (!res.ok) throw new Error('API failed');

            const aiData = await res.json();
            
            // Format into expected agentResults structure
            const agentsData = aiData.agents;
            const agentResults = Object.keys(agentsData).map(key => {
                const agentDef = this.agents.find(a => a.type === key);
                return {
                    agentName: agentDef ? agentDef.name : key,
                    agentIcon: agentDef ? agentDef.icon : 'brain',
                    agentType: key,
                    score: agentsData[key].score || 0,
                    riskLevel: getRiskLevel(agentsData[key].score || 0),
                    findings: agentsData[key].findings || [],
                    isAI: true
                };
            });

            // Update property with new scores
            property.riskScore = aiData.overallScore;
            property.agents = agentsData;
            
            // Optionally, save updated property to backend
            try {
                if (property._id) {
                    await fetch(`http://localhost:3000/api/properties/${property._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(property)
                    });
                }
            } catch (e) {
                console.warn('Could not save updated property to DB:', e);
            }

            return {
                property: property,
                overallScore: aiData.overallScore,
                weightedScore: aiData.overallScore,
                riskLevel: aiData.riskLevel,
                riskLabel: aiData.riskLabel,
                agentResults: agentResults,
                summary: `[AI GENERATED] ` + this.generateSummary(property, agentResults),
                workflow: this.getWorkflow(property),
                isAI: true
            };
        } catch (err) {
            console.error('❌ Full AI analysis failed:', err);
            // Fallback to synchronous analysis
            return this.analyze(property);
        }
    }
};
