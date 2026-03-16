// ===== Property Mongoose Schema =====
const mongoose = require('mongoose');

const FindingSchema = new mongoose.Schema({
    text: { type: String, required: true },
    positive: { type: Boolean, default: false },
    negative: { type: Boolean, default: false },
    neutral: { type: Boolean, default: false }
}, { _id: false });

const AgentResultSchema = new mongoose.Schema({
    score: { type: Number, required: true, min: 0, max: 100 },
    findings: [FindingSchema]
}, { _id: false });

const PropertySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        index: true
    },
    address: { 
        type: String, 
        required: true,
        trim: true 
    },
    lat: { 
        type: Number, 
        required: true,
        min: -90, 
        max: 90 
    },
    lng: { 
        type: Number, 
        required: true,
        min: -180, 
        max: 180 
    },
    price: { 
        type: String, 
        required: true  // Display format: "5.2 tỷ"
    },
    priceNum: { 
        type: Number, 
        required: true  // Numeric in millions: 5200
    },
    area: { 
        type: String, 
        required: true  // e.g. "85m²"
    },
    type: { 
        type: String, 
        required: true,
        enum: [
            'Căn hộ', 'Nhà phố', 'Đất nền', 'Đất vườn', 
            'Biệt thự', 'Penthouse', 'Shophouse', 'Nhà cấp 4',
            'Đất thổ cư', 'Nhà xưởng', 'Khác'
        ]
    },
    bedrooms: { 
        type: Number, 
        default: 0, 
        min: 0 
    },
    description: { 
        type: String, 
        default: '' 
    },
    riskScore: { 
        type: Number, 
        default: 0,
        min: 0, 
        max: 100,
        index: true
    },
    agents: {
        legal: { type: AgentResultSchema, default: () => ({ score: 0, findings: [] }) },
        market: { type: AgentResultSchema, default: () => ({ score: 0, findings: [] }) },
        environment: { type: AgentResultSchema, default: () => ({ score: 0, findings: [] }) },
        fraud: { type: AgentResultSchema, default: () => ({ score: 0, findings: [] }) }
    },
    source: { 
        type: String, 
        enum: ['manual', 'scraper', 'api'],
        default: 'manual' 
    },
    sourceUrl: { 
        type: String, 
        default: '' 
    }
}, { 
    timestamps: true  // auto createdAt, updatedAt
});

// Text search index
PropertySchema.index({ name: 'text', address: 'text', description: 'text' });

// Virtual: risk level
PropertySchema.virtual('riskLevel').get(function() {
    if (this.riskScore <= 35) return 'low';
    if (this.riskScore <= 65) return 'medium';
    return 'high';
});

// Ensure virtuals are included in JSON
PropertySchema.set('toJSON', { virtuals: true });
PropertySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Property', PropertySchema);
