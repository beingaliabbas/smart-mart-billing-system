
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, Sale, ProductService, SaleService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";

interface AppContextType {
  products: Product[];
  sales: Sale[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
  refreshSales: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  findProductByBarcode: (barcode: string) => Promise<Product | null>;
  addSale: (items: any[], total: number) => Promise<Sale>;
  generateReceipt: (sale: Sale) => Promise<Blob>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const refreshSales = async () => {
    try {
      const data = await SaleService.getAll();
      setSales(data);
    } catch (error) {
      console.error("Error refreshing sales:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sales history. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await refreshProducts();
        await refreshSales();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct = await ProductService.add(product);
      await refreshProducts();
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const updatedProduct = await ProductService.update(product);
      await refreshProducts();
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await ProductService.delete(id);
      await refreshProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const findProductByBarcode = async (barcode: string) => {
    return await ProductService.findByBarcode(barcode);
  };

  const addSale = async (items: any[], total: number) => {
    try {
      const newSale = await SaleService.add(items, total);
      await refreshSales();
      return newSale;
    } catch (error) {
      console.error("Error adding sale:", error);
      throw error;
    }
  };

  const generateReceipt = async (sale: Sale) => {
    return await SaleService.generateReceipt(sale);
  };

  const value = {
    products,
    sales,
    loading,
    refreshProducts,
    refreshSales,
    addProduct,
    updateProduct,
    deleteProduct,
    findProductByBarcode,
    addSale,
    generateReceipt,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
