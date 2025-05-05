
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

// Pre-save middleware to ensure ID is set
saleSchema.pre('save', function(next) {
  // If ID isn't set, create one
  if (!this.id) {
    this.id = `SALE-${Date.now()}`;
  }
  
  // If date isn't set, create one
  if (!this.date) {
    this.date = new Date().toISOString();
  }
  
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
