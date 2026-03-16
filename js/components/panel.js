// ===== Property Panel Component =====
// Slide-in detail panel showing full risk analysis

const PropertyPanel = {
    panelEl: null,
    contentEl: null,
    closeBtn: null,
    currentProperty: null,

    init() {
        this.panelEl = document.getElementById('property-panel');
        this.contentEl = document.getElementById('panel-content');
        this.closeBtn = document.getElementById('panel-close');
        
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    open(property) {
        this.currentProperty = property;
        const report = Orchestrator.analyze(property);
        
        this.contentEl.innerHTML = this.render(report);
        this.panelEl.classList.add('panel-open');
        this.panelEl.classList.remove('panel-closed');
        
        // Initialize lucide icons in new content
        if (window.lucide) lucide.createIcons();
        
        // Animate gauge and breakdown
        setTimeout(() => {
            RiskGauge.animate(this.contentEl);
            RiskBreakdown.animate(this.contentEl);
        }, 100);
    },

    close() {
        this.panelEl.classList.remove('panel-open');
        this.panelEl.classList.add('panel-closed');
        this.currentProperty = null;
        
        // Deselect in sidebar
        document.querySelectorAll('.property-card.active').forEach(c => c.classList.remove('active'));
    },

    render(report) {
        const p = report.property;
        const level = report.riskLevel;
        
        return `
            <div class="panel-hero">
                <div class="panel-hero-icon">
                    <i data-lucide="${this.getPropertyIcon(p.type)}"></i>
                </div>
                <div class="panel-hero-badge risk-${level}">
                    <i data-lucide="shield-alert" style="width:14px;height:14px"></i>
                    Risk Score: ${report.overallScore}
                </div>
                <div class="panel-hero-gradient"></div>
            </div>
            
            <div class="panel-body">
                <!-- Title -->
                <div>
                    <div class="panel-title">${p.name}</div>
                    <div class="panel-address">
                        <i data-lucide="map-pin"></i>
                        ${p.address}
                    </div>
                </div>
                
                <!-- Property Details -->
                <div class="panel-details">
                    <div class="panel-detail-item">
                        <span class="panel-detail-label">Giá</span>
                        <span class="panel-detail-value price">${p.price}</span>
                    </div>
                    <div class="panel-detail-item">
                        <span class="panel-detail-label">Diện tích</span>
                        <span class="panel-detail-value">${p.area}</span>
                    </div>
                    <div class="panel-detail-item">
                        <span class="panel-detail-label">Loại hình</span>
                        <span class="panel-detail-value">${p.type}</span>
                    </div>
                    <div class="panel-detail-item">
                        <span class="panel-detail-label">${p.bedrooms > 0 ? 'Phòng ngủ' : 'Mục đích'}</span>
                        <span class="panel-detail-value">${p.bedrooms > 0 ? p.bedrooms + ' PN' : 'Đầu tư'}</span>
                    </div>
                </div>

                <!-- Description -->
                <div style="font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.6;">
                    ${p.description}
                </div>
                
                <!-- Risk Gauge -->
                <div>
                    <div class="panel-section-title">
                        <i data-lucide="gauge"></i>
                        <span>Điểm Rủi Ro Tổng Hợp</span>
                    </div>
                    ${RiskGauge.render(report)}
                </div>
                
                <!-- Summary -->
                <div style="padding: var(--space-md); background: ${level === 'high' ? 'var(--risk-high-bg)' : level === 'medium' ? 'var(--risk-medium-bg)' : 'var(--risk-low-bg)'}; border: 1px solid ${level === 'high' ? 'var(--risk-high-border)' : level === 'medium' ? 'var(--risk-medium-border)' : 'var(--risk-low-border)'}; border-radius: var(--radius-md); font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.6;">
                    ${report.summary}
                </div>
                
                <!-- Agent Breakdown -->
                ${RiskBreakdown.render(report)}
                
                <!-- Workflow -->
                <div>
                    <div class="panel-section-title">
                        <i data-lucide="workflow"></i>
                        <span>Quy Trình Phân Tích</span>
                    </div>
                    <div class="workflow-container">
                        ${report.workflow.map((step, i) => `
                            <div class="workflow-step" style="animation-delay: ${i * 80}ms">
                                <div class="workflow-step-dot completed">
                                    <i data-lucide="check" style="width:14px;height:14px"></i>
                                </div>
                                <div class="workflow-step-text">
                                    <strong>${step.agent}</strong> — ${step.action}
                                </div>
                            </div>
                            ${i < report.workflow.length - 1 ? '<div class="workflow-step-line"></div>' : ''}
                        `).join('')}
                    </div>
                </div>
                
                <!-- Report Button -->
                <button class="panel-report-btn" onclick="PropertyPanel.downloadReport()">
                    <i data-lucide="file-text"></i>
                    Tải Báo Cáo Rủi Ro (PDF)
                </button>
            </div>
        `;
    },

    getPropertyIcon(type) {
        const icons = {
            'Căn hộ': 'building-2',
            'Nhà phố': 'home',
            'Đất nền': 'map',
            'Đất vườn': 'trees',
            'Biệt thự': 'castle',
            'Penthouse': 'crown',
            'Shophouse': 'store',
            'Nhà cấp 4': 'house',
            'Đất thổ cư': 'land-plot',
            'Nhà xưởng': 'factory'
        };
        return icons[type] || 'building';
    },

    downloadReport() {
        if (!this.currentProperty) return;
        
        // Create a simple text report
        const p = this.currentProperty;
        const report = Orchestrator.analyze(p);
        
        let text = `
═══════════════════════════════════════════════════
     PROPSAFE - BÁO CÁO PHÂN TÍCH RỦI RO 
═══════════════════════════════════════════════════

BẤT ĐỘNG SẢN: ${p.name}
ĐỊA CHỈ: ${p.address}
GIÁ: ${p.price}
DIỆN TÍCH: ${p.area}
LOẠI HÌNH: ${p.type}

───────────────────────────────────────────────────
ĐIỂM RỦI RO TỔNG HỢP: ${report.overallScore}/100 (${report.riskLabel})
───────────────────────────────────────────────────

${report.summary}

`;
        report.agentResults.forEach(agent => {
            text += `\n▶ ${agent.agentName}: ${agent.score}/100\n`;
            agent.findings.forEach(f => {
                const icon = f.positive ? '✓' : f.negative ? '✗' : '•';
                text += `  ${icon} ${f.text}\n`;
            });
        });

        text += `\n═══════════════════════════════════════════════════
Phân tích bởi PropSafe AI - ${new Date().toLocaleDateString('vi-VN')}
═══════════════════════════════════════════════════\n`;

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PropSafe_Report_${p.name.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
};
