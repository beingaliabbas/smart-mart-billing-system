
const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const PDFDocument = require('pdfkit');

// @desc    Fetch all sales
// @route   GET /api/sales
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a sale
// @route   POST /api/sales
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { items, total } = req.body;
    
    const sale = new Sale({
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total,
    });
    
    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Generate receipt as PDF
// @route   GET /api/sales/:id/receipt
// @access  Public
router.get('/:id/receipt', async (req, res) => {
  try {
    const sale = await Sale.findOne({ id: req.params.id });
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${sale.id}.pdf`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add content to the PDF
    doc.fontSize(20).text('Smart Mart - Sales Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Receipt ID: ${sale.id}`);
    doc.fontSize(12).text(`Date: ${new Date(sale.date).toLocaleString()}`);
    doc.moveDown();
    
    // Add table header
    doc.fontSize(14).text('Items:', { underline: true });
    doc.moveDown(0.5);
    
    // Add items
    sale.items.forEach(item => {
      doc.fontSize(12).text(`${item.name}`);
      doc.fontSize(10).text(`   ${item.quantity} x PKR ${item.price.toFixed(2)} = PKR ${item.total.toFixed(2)}`);
      doc.moveDown(0.5);
    });
    
    doc.moveDown();
    // Add total
    doc.fontSize(14).text(`Total: PKR ${sale.total.toFixed(2)}`, { bold: true });
    
    // Add footer
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for shopping with us!', { align: 'center' });
    doc.fontSize(8).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    
    // Finalize the PDF
    doc.end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
