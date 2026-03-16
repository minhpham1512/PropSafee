// ===== Compare 2 Properties Feature =====

const Compare = {
    isSelectMode: false,
    selectedProperties: [],
    overlayEl: null,
    bannerEl: null,

    init() {
        // Create overlay + banner elements
        this.createOverlay();
        this.createBanner();

        // Bind compare button in header
        const compareBtn = document.getElementById('btn-compare');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.toggleSelectMode());
        }
    },

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'compare-overlay';
        overlay.className = 'compare-overlay';
        overlay.innerHTML = '<div class="compare-modal" id="compare-modal"></div>';
        document.body.appendChild(overlay);
        this.overlayEl = overlay;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    },

    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'compare-banner';
        banner.className = 'compare-banner';
        banner.innerHTML = `
            <span class="compare-banner-text" id="compare-banner-text">
                Chọn 2 bất động sản để so sánh (0/2)
            </span>
            <div class="compare-banner-actions">
                <button class="compare-banner-btn" onclick="Compare.cancelSelectMode()">Hủy</button>
                <button class="compare-banner-btn primary" id="compare-go-btn" onclick="Compare.showComparison()" disabled>
                    So sánh ngay
                </button>
            </div>
        `;
        // Insert banner at top of sidebar
        const sidebar = document.getElementById('sidebar');
        sidebar.insertBefore(banner, sidebar.firstChild);
        this.bannerEl = banner;
    },

    toggleSelectMode() {
        if (this.isSelectMode) {
            this.cancelSelectMode();
        } else {
            this.enterSelectMode();
        }
    },

    enterSelectMode() {
        this.isSelectMode = true;
        this.selectedProperties = [];
        this.bannerEl.classList.add('active');
        this.updateBannerText();

        // Close any open panel
        PropertyPanel.close();

        // Add selection styling to cards
        document.querySelectorAll('.property-card').forEach(card => {
            card.classList.add('compare-selectable');
            card.classList.remove('compare-selected');
        });

        // Override card click behavior
        this.bindSelectionClicks();
    },

    cancelSelectMode() {
        this.isSelectMode = false;
        this.selectedProperties = [];
        this.bannerEl.classList.remove('active');

        // Remove selection styling
        document.querySelectorAll('.property-card').forEach(card => {
            card.classList.remove('compare-selectable', 'compare-selected');
        });
    },

    bindSelectionClicks() {
        document.querySelectorAll('.property-card').forEach(card => {
            // Remove old listeners by cloning
            const newCard = card.cloneNode(true);
            newCard.classList.add('compare-selectable');
            card.parentNode.replaceChild(newCard, card);

            newCard.addEventListener('click', (e) => {
                if (!this.isSelectMode) return;
                e.stopPropagation();

                const id = parseInt(newCard.dataset.id);
                const property = PROPERTIES.find(p => p.id === id);
                if (!property) return;

                const index = this.selectedProperties.findIndex(p => p.id === id);
                if (index > -1) {
                    // Deselect
                    this.selectedProperties.splice(index, 1);
                    newCard.classList.remove('compare-selected');
                } else if (this.selectedProperties.length < 2) {
                    // Select
                    this.selectedProperties.push(property);
                    newCard.classList.add('compare-selected');
                }

                this.updateBannerText();
            });
        });
    },

    updateBannerText() {
        const text = document.getElementById('compare-banner-text');
        const btn = document.getElementById('compare-go-btn');
        const count = this.selectedProperties.length;

        text.textContent = `Chọn 2 bất động sản để so sánh (${count}/2)`;
        btn.disabled = count !== 2;
    },

    showComparison() {
        if (this.selectedProperties.length !== 2) return;

        const [propA, propB] = this.selectedProperties;
        const reportA = Orchestrator.analyze(propA);
        const reportB = Orchestrator.analyze(propB);

        const modal = document.getElementById('compare-modal');
        modal.innerHTML = this.renderModal(propA, propB, reportA, reportB);

        this.overlayEl.classList.add('active');
        this.cancelSelectMode();

        // Re-render sidebar to restore normal click behavior
        Sidebar.renderList();

        // Initialize icons
        if (window.lucide) lucide.createIcons();

        // Animate bars
        setTimeout(() => {
            document.querySelectorAll('.compare-agent-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.targetWidth;
            });
        }, 300);
    },

    closeModal() {
        this.overlayEl.classList.remove('active');
    },

    renderModal(propA, propB, reportA, reportB) {
        const agents = [
            { key: 'legal', name: 'Pháp Lý', icon: 'scale' },
            { key: 'market', name: 'Thị Trường', icon: 'trending-up' },
            { key: 'environment', name: 'Môi Trường', icon: 'trees' },
            { key: 'fraud', name: 'Gian Lận', icon: 'scan-eye' }
        ];

        const levelA = reportA.riskLevel;
        const levelB = reportB.riskLevel;

        return `
            <div class="compare-header">
                <div class="compare-header-title">
                    <i data-lucide="columns-2"></i>
                    So Sánh Bất Động Sản
                </div>
                <button class="compare-close" onclick="Compare.closeModal()">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="compare-body">
                <div class="compare-grid">
                    <!-- Property A -->
                    <div class="compare-col">
                        <div class="compare-col-header">
                            <div class="compare-col-name">${propA.name}</div>
                            <div class="compare-col-address">${propA.address}</div>
                        </div>
                        <div class="compare-score-section">
                            <div class="compare-score risk-${levelA}">${reportA.overallScore}</div>
                            <div class="compare-score-label risk-${levelA}">Rủi ro ${reportA.riskLabel}</div>
                        </div>
                        ${this.renderDetailRows(propA, propB, 'A')}
                        ${agents.map(a => this.renderAgentBar(a, propA, propB, 'A')).join('')}
                    </div>

                    <!-- VS -->
                    <div class="compare-vs">
                        <div class="compare-vs-badge">VS</div>
                    </div>

                    <!-- Property B -->
                    <div class="compare-col">
                        <div class="compare-col-header">
                            <div class="compare-col-name">${propB.name}</div>
                            <div class="compare-col-address">${propB.address}</div>
                        </div>
                        <div class="compare-score-section">
                            <div class="compare-score risk-${levelB}">${reportB.overallScore}</div>
                            <div class="compare-score-label risk-${levelB}">Rủi ro ${reportB.riskLabel}</div>
                        </div>
                        ${this.renderDetailRows(propB, propA, 'B')}
                        ${agents.map(a => this.renderAgentBar(a, propB, propA, 'B')).join('')}
                    </div>
                </div>

                <!-- Summary -->
                <div style="margin-top: var(--space-xl); padding: var(--space-lg); background: var(--bg-elevated); border: 1px solid var(--border-glass); border-radius: var(--radius-md);">
                    <div style="font-size: var(--font-sm); font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                        <i data-lucide="bot" style="width:16px;height:16px;display:inline;vertical-align:-3px"></i>
                        Nhận xét AI
                    </div>
                    <div style="font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.6;">
                        ${this.generateVerdictText(propA, propB, reportA, reportB)}
                    </div>
                </div>
            </div>
        `;
    },

    renderDetailRows(prop, otherProp, side) {
        const rows = [
            { label: 'Giá', value: prop.price, compare: 'price' },
            { label: 'Diện tích', value: prop.area, compare: 'area' },
            { label: 'Loại hình', value: prop.type },
            { label: 'Phòng ngủ', value: prop.bedrooms > 0 ? `${prop.bedrooms} PN` : 'N/A' }
        ];

        return rows.map(row => {
            let valueClass = '';
            if (row.compare === 'price') {
                valueClass = prop.priceNum < otherProp.priceNum ? 'better' : prop.priceNum > otherProp.priceNum ? 'worse' : '';
            }

            return `
                <div class="compare-row">
                    <span class="compare-row-label">${row.label}</span>
                    <span class="compare-row-value ${valueClass}">${row.value}</span>
                </div>
            `;
        }).join('');
    },

    renderAgentBar(agent, prop, otherProp, side) {
        const score = prop.agents[agent.key].score;
        const otherScore = otherProp.agents[agent.key].score;
        const level = getRiskLevel(score);
        const isBetter = score < otherScore;

        return `
            <div class="compare-agent-row">
                <span class="compare-agent-name">${agent.name}</span>
                <div class="compare-agent-bar-wrap">
                    <div class="compare-agent-bar">
                        <div class="compare-agent-bar-fill risk-${level}" 
                             style="width: 0%" 
                             data-target-width="${score}%"></div>
                    </div>
                    <span class="compare-agent-score" style="color: var(--risk-${level})">${score}</span>
                </div>
            </div>
        `;
    },

    generateVerdictText(propA, propB, reportA, reportB) {
        const scoreA = reportA.overallScore;
        const scoreB = reportB.overallScore;
        const diff = Math.abs(scoreA - scoreB);

        const better = scoreA <= scoreB ? propA : propB;
        const worse = scoreA <= scoreB ? propB : propA;
        const betterScore = Math.min(scoreA, scoreB);
        const worseScore = Math.max(scoreA, scoreB);

        if (diff <= 5) {
            return `Hai bất động sản có mức rủi ro <strong>tương đương nhau</strong> (chênh lệch chỉ ${diff} điểm). 
                    Cần xem xét kỹ từng yếu tố riêng biệt để đưa ra quyết định.`;
        }

        let verdict = `<strong>${better.name}</strong> có mức rủi ro thấp hơn đáng kể 
                       (${betterScore} vs ${worseScore}, chênh lệch ${diff} điểm).`;

        // Find the agent with biggest difference
        const agentKeys = ['legal', 'market', 'environment', 'fraud'];
        const agentNames = { legal: 'Pháp lý', market: 'Thị trường', environment: 'Môi trường', fraud: 'Gian lận' };
        let maxDiffAgent = '';
        let maxDiffValue = 0;

        agentKeys.forEach(key => {
            const d = Math.abs(propA.agents[key].score - propB.agents[key].score);
            if (d > maxDiffValue) {
                maxDiffValue = d;
                maxDiffAgent = key;
            }
        });

        if (maxDiffAgent) {
            verdict += ` Sự khác biệt lớn nhất nằm ở yếu tố <strong>${agentNames[maxDiffAgent]}</strong> (chênh ${maxDiffValue} điểm).`;
        }

        return verdict;
    }
};
