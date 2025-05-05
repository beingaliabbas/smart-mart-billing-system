
import { toast } from "@/components/ui/use-toast";

// Types for our API data
export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  total: number;
}

// Mock API services to be replaced with real backend calls later
export const ProductService = {
  async getAll(): Promise<Product[]> {
    try {
      // This will be replaced with a fetch call to the backend
      const products = localStorage.getItem('products');
      return products ? JSON.parse(products) : [];
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  },
  
  async add(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      // Get existing products
      const existingProducts = await this.getAll();
      
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...product,
        createdAt: new Date().toISOString(),
      };
      
      // Save to localStorage (temporary)
      localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));
      
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async update(product: Product): Promise<Product> {
    try {
      const products = await this.getAll();
      const updatedProducts = products.map(p => p.id === product.id ? product : p);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return product;
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async delete(id: string): Promise<void> {
    try {
      const products = await this.getAll();
      const filteredProducts = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(filteredProducts));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async findByBarcode(barcode: string): Promise<Product | null> {
    try {
      const products = await this.getAll();
      return products.find(p => p.barcode === barcode) || null;
    } catch (error) {
      console.error("Error finding product:", error);
      return null;
    }
  }
};

export const SaleService = {
  async getAll(): Promise<Sale[]> {
    try {
      const sales = localStorage.getItem('sales');
      return sales ? JSON.parse(sales) : [];
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sales history. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  },
  
  async add(items: SaleItem[], total: number): Promise<Sale> {
    try {
      const sales = await this.getAll();
      
      const newSale: Sale = {
        id: `SALE-${Date.now()}`,
        date: new Date().toISOString(),
        items,
        total,
      };
      
      localStorage.setItem('sales', JSON.stringify([...sales, newSale]));
      
      return newSale;
    } catch (error) {
      console.error("Error adding sale:", error);
      toast({
        title: "Error",
        description: "Failed to save sale. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async generateReceipt(sale: Sale): Promise<Blob> {
    try {
      // This would be replaced with an actual PDF generation
      // For now, just return a simple text blob
      const receiptText = `
        Sales Receipt
        ID: ${sale.id}
        Date: ${new Date(sale.date).toLocaleString()}
        
        Items:
        ${sale.items.map(item => `${item.name} x ${item.quantity} = PKR ${item.total.toFixed(2)}`).join('\n')}
        
        Total: PKR ${sale.total.toFixed(2)}
      `;
      
      return new Blob([receiptText], { type: 'text/plain' });
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
};
