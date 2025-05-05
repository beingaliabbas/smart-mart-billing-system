
import { toast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:5000/api";

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

// API services using backend server
export const ProductService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
      // Fallback to localStorage
      const products = localStorage.getItem('products');
      return products ? JSON.parse(products) : [];
    }
  },
  
  async add(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
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
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
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
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
      const response = await fetch(`${API_URL}/products/barcode/${barcode}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error finding product:", error);
      return null;
    }
  }
};

export const SaleService = {
  async getAll(): Promise<Sale[]> {
    try {
      const response = await fetch(`${API_URL}/sales`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sales history. Please try again.",
        variant: "destructive",
      });
      // Fallback to localStorage
      const sales = localStorage.getItem('sales');
      return sales ? JSON.parse(sales) : [];
    }
  },
  
  async add(items: SaleItem[], total: number): Promise<Sale> {
    try {
      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, total }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
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
      const response = await fetch(`${API_URL}/sales/${sale.id}/receipt`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to simple text blob
      const receiptText = `
        Sales Receipt
        ID: ${sale.id}
        Date: ${new Date(sale.date).toLocaleString()}
        
        Items:
        ${sale.items.map(item => `${item.name} x ${item.quantity} = PKR ${item.total.toFixed(2)}`).join('\n')}
        
        Total: PKR ${sale.total.toFixed(2)}
      `;
      
      return new Blob([receiptText], { type: 'text/plain' });
    }
  }
};
