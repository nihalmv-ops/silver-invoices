const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      index: true
    },
    quotationId: {
      type: String,
      default: ''
    },
    quotationNumber: {
      type: String,
      default: ''
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
    advancePaid: {
      type: Number,
      default: 0
    },
    balanceDue: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PARTIALLY PAID', 'PAID'],
      default: 'PENDING'
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

module.exports = mongoose.model('Invoice', invoiceSchema);

