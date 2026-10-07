const express = require('express');
const router = express.Router();
const BusinessInfo = require('../models/BusinessInfo');
const { requireAuth } = require('../middleware/auth');

// @route   GET /api/business
// @desc    Get business details
// @access  Public or Private (can be public so invoice links or previews can see company name/logo)
router.get('/', async (req, res) => {
  try {
    let business = await BusinessInfo.findOne({ key: 'default_business' });
    if (!business) {
      business = await BusinessInfo.create({ key: 'default_business' });
    }
    return res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('Fetch business info error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch business info'
    });
  }
});

// @route   PUT /api/business
// @desc    Update business details
// @access  Private
router.put('/', requireAuth, async (req, res) => {
  try {
    const payload = req.body;
    const updated = await BusinessInfo.findOneAndUpdate(
      { key: 'default_business' },
      { ...payload, key: 'default_business' },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Business information updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update business info error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update business info'
    });
  }
});

module.exports = router;

