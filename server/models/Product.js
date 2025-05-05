
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  barcode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to ensure ID is set
productSchema.pre('save', function(next) {
  // If ID isn't set, create one
  if (!this.id) {
    this.id = Date.now().toString();
  }
  
  // If createdAt isn't set, create one
  if (!this.createdAt) {
    this.createdAt = new Date().toISOString();
  }
  
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
