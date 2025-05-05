
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Fetch single product by barcode
// @route   GET /api/products/barcode/:barcode
// @access  Public
router.get('/barcode/:barcode', async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { barcode, name, price } = req.body;
    
    const productExists = await Product.findOne({ barcode });
    
    if (productExists) {
      return res.status(400).json({ message: 'Product already exists' });
    }
    
    const product = new Product({
      id: Date.now().toString(),
      barcode,
      name,
      price,
      createdAt: new Date().toISOString()
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, price, barcode } = req.body;
    
    const product = await Product.findOne({ id: req.params.id });
    
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.barcode = barcode || product.barcode;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
