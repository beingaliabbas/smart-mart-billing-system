
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
