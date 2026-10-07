const mongoose = require('mongoose');

const businessInfoSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'default_business',
      unique: true,
      index: true
    },
    name: {
      type: String,
      default: 'SILVER CATERING'
    },
    subtitle: {
      type: String,
      default: 'CATERING & EVENTS'
    },
    phones: {
      type: [String],
      default: ['+91 98464 15767', '+91 75939 82800']
    },
    address: {
      type: String,
      default: 'Thalakuttiparambil house, Mecheriparambu, Irimbiliyam PO - 679572, Valanchery'
    },
    website: {
      type: String,
      default: 'www.silvercatering.in'
    },
    email: {
      type: String,
      default: 'Silvereventsandcaters@gmail.com'
    },
    upiId: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: '/logo.webp'
    },
    terms: {
      type: [String],
      default: [
        '50% advance payment required for date reservation and scheduling.',
        'Final guest count (PAX) must be confirmed at least 48 hours prior to the event.',
        'Remaining payment balance must be settled on or before the event date.',
        'Menu modifications can be accommodated up to 4 days prior to the occasion.'
      ]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BusinessInfo', businessInfoSchema);
