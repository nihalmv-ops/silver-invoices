const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const { requireAuth } = require('../middleware/auth');

// All quotation endpoints require authentication
router.use(requireAuth);

// @route   GET /api/quotations
// @desc    Get all quotations
// @access  Private
router.get('/', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ updatedAt: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations
    });
  } catch (error) {
    console.error('Fetch quotations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch quotations'
    });
  }
});

// @route   POST /api/quotations
// @desc    Create a new quotation
// @access  Private
router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.quotationNumber) {
      return res.status(400).json({
        success: false,
        message: 'Quotation number is required'
      });
    }

    const id = payload.id || `qt-${Date.now()}`;
    const quotationData = {
      ...payload,
      id,
      createdBy: req.user.name || 'admin'
    };

    // Upsert or create
    const existing = await Quotation.findOne({ id });
    if (existing) {
      const updated = await Quotation.findOneAndUpdate({ id }, quotationData, { new: true });
      return res.status(200).json({
        success: true,
        message: 'Quotation updated successfully',
        data: updated
      });
    }

    const created = await Quotation.create(quotationData);
    return res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      data: created
    });
  } catch (error) {
    console.error('Create quotation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create quotation'
    });
  }
});

// @route   PUT /api/quotations/:id
// @desc    Update an existing quotation by ID
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updated = await Quotation.findOneAndUpdate(
      { id },
      { ...payload, id },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Quotation updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update quotation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update quotation'
    });
  }
});

// @route   DELETE /api/quotations/:id
// @desc    Delete a quotation by ID
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Quotation.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Quotation not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation deleted successfully',
      id
    });
  } catch (error) {
    console.error('Delete quotation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete quotation'
    });
  }
});

module.exports = router;
