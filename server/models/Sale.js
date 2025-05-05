
const mongoose = require('mongoose');

const saleItemSchema = mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const saleSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  items: [saleItemSchema],
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
