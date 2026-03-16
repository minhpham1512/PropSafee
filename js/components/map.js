// ===== Map Component =====
// Leaflet map with custom markers colored by risk level

const PropMap = {
    map: null,
    markers: [],
    markersLayer: null,

    init() {
        // Initialize Leaflet map centered on HCMC
        this.map = L.map('map', {
            center: [10.7769, 106.6900],
            zoom: 11,
            zoomControl: true,
            attributionControl: true
        });

        // Dark map tiles (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> | PropSafe AI',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        // Create markers layer
        this.markersLayer = L.layerGroup().addTo(this.map);

        // Add all property markers
        this.addMarkers(PROPERTIES);
        
        // Fit bounds to show all markers
        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    },

    addMarkers(properties) {
        this.markers = [];
        this.markersLayer.clearLayers();

        properties.forEach(property => {
            const marker = this.createMarker(property);
            this.markers.push(marker);
            this.markersLayer.addLayer(marker);
        });
    },

    createMarker(property) {
        const level = getRiskLevel(property.riskScore);
        const colors = {
            low: '#22c55e',
            medium: '#f59e0b',
            high: '#ef4444'
        };
        const color = colors[level];
        
        // Custom circle marker with pulsing effect
        const marker = L.circleMarker([property.lat, property.lng], {
            radius: 10,
            fillColor: color,
            fillOpacity: 0.8,
            color: color,
            weight: 2,
            opacity: 1
        });

        // Add outer glow ring
        const glow = L.circleMarker([property.lat, property.lng], {
            radius: 16,
            fillColor: color,
            fillOpacity: 0.15,
            color: color,
            weight: 1,
            opacity: 0.3,
            interactive: false
        });
        this.markersLayer.addLayer(glow);

        // Popup content
        const popupContent = `
            <div class="popup-content">
                <div class="popup-name">${property.name}</div>
                <div class="popup-address">${property.address}</div>
                <div class="popup-score risk-${level}">
                    Risk Score: ${property.riskScore}/100
                </div>
                <button class="popup-btn" onclick="PropMap.selectProperty(${property.id})">
                    Xem phân tích chi tiết →
                </button>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 280,
            className: 'custom-popup'
        });

        // Hover effect
        marker.on('mouseover', function() {
            this.setStyle({ radius: 14, fillOpacity: 1 });
            glow.setStyle({ radius: 22, fillOpacity: 0.25 });
        });

        marker.on('mouseout', function() {
            this.setStyle({ radius: 10, fillOpacity: 0.8 });
            glow.setStyle({ radius: 16, fillOpacity: 0.15 });
        });

        // Click to select
        marker.on('click', () => {
            // Popup will show automatically
        });

        // Store reference
        marker.propertyId = property.id;

        return marker;
    },

    selectProperty(id) {
        const property = PROPERTIES.find(p => p.id === id);
        if (property) {
            this.map.closePopup();
            Sidebar.selectProperty(property);
        }
    },

    focusProperty(property) {
        this.map.flyTo([property.lat, property.lng], 15, {
            duration: 0.8,
            easeLinearity: 0.5
        });

        // Flash the marker
        const marker = this.markers.find(m => m.propertyId === property.id);
        if (marker) {
            const originalRadius = 10;
            let flashCount = 0;
            const flash = setInterval(() => {
                marker.setStyle({ radius: flashCount % 2 === 0 ? 18 : originalRadius });
                flashCount++;
                if (flashCount > 5) {
                    clearInterval(flash);
                    marker.setStyle({ radius: originalRadius });
                }
            }, 200);
        }
    },

    // Update visible markers based on filtered properties
    updateVisibleMarkers(visibleIds) {
        this.markers.forEach(marker => {
            const opacity = visibleIds.includes(marker.propertyId) ? 0.8 : 0.15;
            marker.setStyle({ fillOpacity: opacity, opacity: opacity });
        });
    }
};
