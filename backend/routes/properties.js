// ===== Properties CRUD Routes =====
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Try to use Mongoose model, fallback to in-memory if DB not connected
function getModel() {
    try {
        return require('../models/Property');
    } catch {
        return null;
    }
}

// In-memory fallback data (loaded from seed)
let inMemoryProperties = [];

// Helper: check if DB is connected
function isDBConnected() {
    return mongoose.connection.readyState === 1;
}

// GET /api/properties — List all with optional filters
router.get('/', async (req, res) => {
    try {
        const { search, risk, type, minPrice, maxPrice, sort } = req.query;

        if (isDBConnected()) {
            const Property = getModel();
            let query = {};

            // Search filter
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { address: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Risk level filter
            if (risk === 'low') query.riskScore = { $lte: 35 };
            else if (risk === 'medium') query.riskScore = { $gt: 35, $lte: 65 };
            else if (risk === 'high') query.riskScore = { $gt: 65 };

            // Type filter
            if (type) query.type = type;

            // Price range filter
            if (minPrice || maxPrice) {
                query.priceNum = {};
                if (minPrice) query.priceNum.$gte = Number(minPrice);
                if (maxPrice) query.priceNum.$lte = Number(maxPrice);
            }

            // Sort
            let sortOption = { createdAt: -1 };
            if (sort === 'risk_asc') sortOption = { riskScore: 1 };
            else if (sort === 'risk_desc') sortOption = { riskScore: -1 };
            else if (sort === 'price_asc') sortOption = { priceNum: 1 };
            else if (sort === 'price_desc') sortOption = { priceNum: -1 };

            const properties = await Property.find(query).sort(sortOption);
            return res.json(properties);
        }

        // Fallback: in-memory
        let results = [...inMemoryProperties];
        if (search) {
            const s = search.toLowerCase();
            results = results.filter(p =>
                p.name.toLowerCase().includes(s) ||
                p.address.toLowerCase().includes(s)
            );
        }
        if (risk === 'low') results = results.filter(p => p.riskScore <= 35);
        else if (risk === 'medium') results = results.filter(p => p.riskScore > 35 && p.riskScore <= 65);
        else if (risk === 'high') results = results.filter(p => p.riskScore > 65);

        res.json(results);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/properties/:id — Get one
router.get('/:id', async (req, res) => {
    try {
        if (isDBConnected()) {
            const Property = getModel();
            const property = await Property.findById(req.params.id);
            if (!property) return res.status(404).json({ error: 'Property not found' });
            return res.json(property);
        }

        // Fallback
        const property = inMemoryProperties.find(p => p.id == req.params.id);
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json(property);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/properties — Create new
router.post('/', async (req, res) => {
    try {
        if (isDBConnected()) {
            const Property = getModel();
            const property = new Property(req.body);

            // Auto-compute risk score if agents provided
            if (property.agents) {
                const weights = { legal: 0.30, market: 0.25, environment: 0.20, fraud: 0.25 };
                property.riskScore = Math.round(
                    (property.agents.legal?.score || 0) * weights.legal +
                    (property.agents.market?.score || 0) * weights.market +
                    (property.agents.environment?.score || 0) * weights.environment +
                    (property.agents.fraud?.score || 0) * weights.fraud
                );
            }

            await property.save();
            return res.status(201).json(property);
        }

        // Fallback
        const property = { ...req.body, id: Date.now() };
        inMemoryProperties.push(property);
        res.status(201).json(property);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/properties/:id — Update
router.put('/:id', async (req, res) => {
    try {
        if (isDBConnected()) {
            const Property = getModel();
            const property = await Property.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!property) return res.status(404).json({ error: 'Property not found' });
            return res.json(property);
        }

        // Fallback
        const index = inMemoryProperties.findIndex(p => p.id == req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Property not found' });
        inMemoryProperties[index] = { ...inMemoryProperties[index], ...req.body };
        res.json(inMemoryProperties[index]);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/properties/:id — Delete
router.delete('/:id', async (req, res) => {
    try {
        if (isDBConnected()) {
            const Property = getModel();
            const property = await Property.findByIdAndDelete(req.params.id);
            if (!property) return res.status(404).json({ error: 'Property not found' });
            return res.json({ message: 'Deleted', id: req.params.id });
        }

        // Fallback
        const index = inMemoryProperties.findIndex(p => p.id == req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Property not found' });
        inMemoryProperties.splice(index, 1);
        res.json({ message: 'Deleted', id: req.params.id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/properties/bulk — Bulk import (from scraper)
router.post('/bulk', async (req, res) => {
    try {
        const { properties } = req.body;
        if (!Array.isArray(properties)) {
            return res.status(400).json({ error: 'Expected { properties: [...] }' });
        }

        if (isDBConnected()) {
            const Property = getModel();
            const result = await Property.insertMany(properties, { ordered: false });
            return res.status(201).json({ inserted: result.length });
        }

        // Fallback
        properties.forEach(p => {
            p.id = Date.now() + Math.random();
            inMemoryProperties.push(p);
        });
        res.status(201).json({ inserted: properties.length });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Export both router and setter for in-memory data
router.setInMemoryData = (data) => { inMemoryProperties = data; };
module.exports = router;
