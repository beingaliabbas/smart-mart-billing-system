
import { Sale } from "@/services/api";

export const generateReceiptData = (sale: Sale) => {
  // Format the receipt data
  const items = sale.items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: `PKR ${item.price.toFixed(2)}`,
    total: `PKR ${item.total.toFixed(2)}`
  }));
  
  const receiptData = {
    id: sale.id,
    date: new Date(sale.date).toLocaleDateString(),
    time: new Date(sale.date).toLocaleTimeString(),
    items,
    total: `PKR ${sale.total.toFixed(2)}`,
    storeName: "Smart Mart",
    storeAddress: "123 Main Street, City",
    storePhone: "+92 123 4567890",
    thankYouMessage: "Thank you for shopping with us!"
  };
  
  return receiptData;
};

export const downloadReceipt = (sale: Sale) => {
  const receiptData = generateReceiptData(sale);
  
  // Create a simple text-based receipt (in real app, you'd use a PDF library)
  const receiptText = `
    ${receiptData.storeName}
    ${receiptData.storeAddress}
    Tel: ${receiptData.storePhone}
    
    SALES RECEIPT
    ID: ${receiptData.id}
    Date: ${receiptData.date}
    Time: ${receiptData.time}
    
    ${'-'.repeat(40)}
    ITEMS
    ${'-'.repeat(40)}
    ${receiptData.items.map(item => 
      `${item.name} x ${item.quantity}
       ${item.price} each
       Total: ${item.total}`
    ).join('\n\n')}
    
    ${'-'.repeat(40)}
    TOTAL: ${receiptData.total}
    ${'-'.repeat(40)}
    
    ${receiptData.thankYouMessage}
  `;
  
  // Create a blob and download it
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${sale.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return true;
};
