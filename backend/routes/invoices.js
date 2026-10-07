const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { requireAuth } = require('../middleware/auth');

// All invoice endpoints require authentication
router.use(requireAuth);

// @route   GET /api/invoices
// @desc    Get all invoices
// @access  Private
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ updatedAt: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    console.error('Fetch invoices error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
});

// @route   POST /api/invoices
// @desc    Create a new invoice
// @access  Private
router.post('/', async (req, res) => {
  try {
    const payload = req.body;

    if (!payload.invoiceNumber) {
      return res.status(400).json({
        success: false,
        message: 'Invoice number is required'
      });
    }

    const id = payload.id || `inv-${Date.now()}`;
    const invoiceData = {
      ...payload,
      id,
      createdBy: req.user.name || 'admin'
    };

    // Upsert or create
    const existing = await Invoice.findOne({ id });
    if (existing) {
      const updated = await Invoice.findOneAndUpdate({ id }, invoiceData, { new: true });
      return res.status(200).json({
        success: true,
        message: 'Invoice updated successfully',
        data: updated
      });
    }

    const created = await Invoice.create(invoiceData);
    return res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: created
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create invoice'
    });
  }
});

// @route   PUT /api/invoices/:id
// @desc    Update an existing invoice by ID
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updated = await Invoice.findOneAndUpdate(
      { id },
      { ...payload, id },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update invoice'
    });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete an invoice by ID
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Invoice.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
      id
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete invoice'
    });
  }
});

module.exports = router;

