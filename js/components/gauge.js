// ===== Risk Gauge Component =====
// Animated SVG radial gauge showing overall risk score

const RiskGauge = {
    render(report) {
        const score = report.overallScore;
        const level = report.riskLevel;
        const label = report.riskLabel;
        
        // SVG circle calculations
        const radius = 65;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;
        
        const descriptions = {
            low: "Bất động sản an toàn để giao dịch",
            medium: "Cần kiểm tra thêm trước khi quyết định",
            high: "Cảnh báo - Rủi ro cao, cần cẩn trọng"
        };

        return `
            <div class="gauge-container">
                <div class="gauge-wrapper">
                    <div class="gauge-glow risk-${level}"></div>
                    <svg class="gauge-svg" viewBox="0 0 150 150">
                        <circle class="gauge-bg" cx="75" cy="75" r="${radius}" />
                        <circle 
                            class="gauge-fill risk-${level}" 
                            cx="75" cy="75" r="${radius}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${circumference}"
                            data-target-offset="${offset}"
                        />
                    </svg>
                    <div class="gauge-center">
                        <span class="gauge-score risk-${level}" data-target="${score}">0</span>
                        <span class="gauge-max">/ 100</span>
                    </div>
                </div>
                <span class="gauge-label risk-${level}">Rủi ro ${label}</span>
                <span class="gauge-desc">${descriptions[level]}</span>
            </div>
        `;
    },

    animate(container) {
        // Animate the SVG stroke
        const gaugeFill = container.querySelector('.gauge-fill');
        const gaugeScore = container.querySelector('.gauge-score');
        
        if (!gaugeFill || !gaugeScore) return;
        
        const targetOffset = parseFloat(gaugeFill.dataset.targetOffset);
        const targetScore = parseInt(gaugeScore.dataset.target);
        
        // Delay for dramatic effect
        setTimeout(() => {
            gaugeFill.style.strokeDashoffset = targetOffset;
        }, 200);
        
        // Animate score counter
        this.animateCounter(gaugeScore, 0, targetScore, 1200);
    },

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
};
