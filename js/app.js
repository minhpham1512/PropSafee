// ===== PropSafe App =====
// Main application initialization

const App = {
    async init() {
        // Load data first
        if (typeof loadProperties === 'function') {
            await loadProperties();
        }

        // Initialize components
        PropertyPanel.init();
        Sidebar.init();
        PropMap.init();
        Compare.init();
        
        // Update header stats
        this.updateStats();
        
        // Initialize lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
        
        console.log('🛡️ PropSafe initialized — 5 AI Agents active');
    },

    updateStats() {
        const total = PROPERTIES.length;
        const safe = PROPERTIES.filter(p => getRiskLevel(p.riskScore) === 'low').length;
        const warning = PROPERTIES.filter(p => getRiskLevel(p.riskScore) === 'medium').length;
        const danger = PROPERTIES.filter(p => getRiskLevel(p.riskScore) === 'high').length;
        
        // Animate counters
        this.animateCounter('stat-total', total);
        this.animateCounter('stat-safe', safe);
        this.animateCounter('stat-warning', warning);
        this.animateCounter('stat-danger', danger);
    },

    animateCounter(elementId, target) {
        const el = document.querySelector(`#${elementId} .stat-value`);
        if (!el) return;
        
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 20));
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current;
        }, 50);
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
