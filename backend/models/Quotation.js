const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    quotationNumber: {
      type: String,
      required: true,
      index: true
    },
    date: {
      type: String,
      default: ''
    },
    customer: {
      name: { type: String, default: '' },
      mobile: { type: String, default: '' },
      email: { type: String, default: '' },
      place: { type: String, default: '' }
    },
    event: {
      eventName: { type: String, default: '' },
      eventDate: { type: String, default: '' },
      totalPax: { type: String, default: '' },
      time: { type: String, default: '' }
    },
    sections: {
      type: Array,
      default: []
    },
    customTotalAmount: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    },
    createdBy: {
      type: String,
      default: 'admin'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quotation', quotationSchema);

