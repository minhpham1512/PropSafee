// ===== Sidebar Component =====
// Search, filter, and property list

const Sidebar = {
    listEl: null,
    searchInput: null,
    filterBtns: null,
    currentFilter: 'all',
    currentSearch: '',

    init() {
        this.listEl = document.getElementById('property-list');
        this.searchInput = document.getElementById('search-input');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Search handler with debounce
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentSearch = e.target.value.toLowerCase();
                this.renderList();
            }, 200);
        });
        
        // Filter handlers
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderList();
            });
        });
        
        this.renderList();
    },

    getFilteredProperties() {
        return PROPERTIES.filter(p => {
            // Filter by risk level
            if (this.currentFilter !== 'all') {
                const level = getRiskLevel(p.riskScore);
                if (level !== this.currentFilter) return false;
            }
            
            // Filter by search
            if (this.currentSearch) {
                const searchStr = `${p.name} ${p.address} ${p.type}`.toLowerCase();
                if (!searchStr.includes(this.currentSearch)) return false;
            }
            
            return true;
        });
    },

    renderList() {
        const filtered = this.getFilteredProperties();
        
        if (filtered.length === 0) {
            this.listEl.innerHTML = `
                <div class="no-results">
                    <i data-lucide="search-x"></i>
                    <span>Không tìm thấy bất động sản</span>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }
        
        this.listEl.innerHTML = filtered.map((p, i) => this.renderCard(p, i)).join('');
        
        // Bind click events
        this.listEl.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const property = PROPERTIES.find(p => p.id === id);
                if (property) {
                    this.selectProperty(property);
                }
            });
        });
        
        if (window.lucide) lucide.createIcons();
    },

    renderCard(property, index) {
        const level = getRiskLevel(property.riskScore);
        const isActive = PropertyPanel.currentProperty && PropertyPanel.currentProperty.id === property.id;
        
        return `
            <div class="property-card ${isActive ? 'active' : ''}" 
                 data-id="${property.id}"
                 style="animation-delay: ${index * 50}ms">
                <div class="property-card-risk risk-${level}">
                    ${property.riskScore}
                </div>
                <div class="property-card-info">
                    <div class="property-card-name">${property.name}</div>
                    <div class="property-card-address">${property.address}</div>
                    <div class="property-card-meta">
                        <span class="property-card-price">${property.price}</span>
                        <span class="property-card-type">${property.type}</span>
                    </div>
                </div>
            </div>
        `;
    },

    selectProperty(property) {
        // Highlight card
        document.querySelectorAll('.property-card').forEach(c => c.classList.remove('active'));
        const card = document.querySelector(`.property-card[data-id="${property.id}"]`);
        if (card) card.classList.add('active');
        
        // Open detail panel
        PropertyPanel.open(property);
        
        // Center map on property
        if (window.PropMap) {
            PropMap.focusProperty(property);
        }
    }
};
