// ===== Risk Breakdown Component =====
// Grid of 4 agent cards with scores and findings

const RiskBreakdown = {
    render(report) {
        const cards = report.agentResults.map((result, i) => this.renderCard(result, i));
        return `
            <div>
                <div class="panel-section-title">
                    <i data-lucide="bot"></i>
                    <span>Phân Tích Từ AI Agents</span>
                </div>
                <div class="breakdown-grid">
                    ${cards.join('')}
                </div>
            </div>
        `;
    },

    renderCard(result, index) {
        const level = result.riskLevel;
        const findings = result.findings.map(f => this.renderFinding(f)).join('');
        
        return `
            <div class="breakdown-card" style="animation-delay: ${index * 100}ms">
                <div class="breakdown-card-header">
                    <div class="breakdown-card-icon ${result.agentType}">
                        <i data-lucide="${result.agentIcon}"></i>
                    </div>
                    <span class="breakdown-card-score risk-${level}">${result.score}</span>
                </div>
                <div class="breakdown-card-title">${result.agentName}</div>
                <div class="breakdown-bar">
                    <div class="breakdown-bar-fill risk-${level}" style="width: 0%" data-target-width="${result.score}%"></div>
                </div>
                <div class="breakdown-findings">
                    ${findings}
                </div>
            </div>
        `;
    },

    renderFinding(finding) {
        let iconClass = 'neutral';
        let icon = 'minus';
        
        if (finding.positive) {
            iconClass = 'positive';
            icon = 'check';
        } else if (finding.negative) {
            iconClass = 'negative';
            icon = 'x';
        }
        
        return `
            <div class="breakdown-finding">
                <span class="breakdown-finding-icon ${iconClass}">
                    <i data-lucide="${icon}" style="width:10px;height:10px"></i>
                </span>
                <span>${finding.text}</span>
            </div>
        `;
    },

    animate(container) {
        // Animate score bars
        const bars = container.querySelectorAll('.breakdown-bar-fill');
        bars.forEach((bar, i) => {
            setTimeout(() => {
                bar.style.width = bar.dataset.targetWidth;
            }, 300 + i * 150);
        });
    }
};
