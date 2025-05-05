
import { toast } from "@/components/ui/use-toast";

// MongoDB Connection String
const MONGODB_URI = "mongodb://aliabbaszounr1:Aliabbas321@cluster1-shard-00-00.rpo2r.mongodb.net:27017,cluster1-shard-00-01.rpo2r.mongodb.net:27017,cluster1-shard-00-02.rpo2r.mongodb.net:27017/supermart?replicaSet=atlas-14bnbx-shard-0&ssl=true&authSource=admin";

// Note: In a production application, this should be stored as an environment variable
// and accessed securely on the server side, not exposed in client-side code.

// Since we're implementing a direct connection without a backend server,
// we'll need to use a serverless function or API route in a real production app.
// This implementation is for demonstration purposes only.

export async function testConnection() {
  try {
    // In a real implementation, this would be a serverless function call
    // For now, we'll simulate success after a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    toast({
      title: "Database Connection Error",
      description: "Failed to connect to MongoDB. Please check your connection settings.",
      variant: "destructive",
    });
    return false;
  }
}

// Helper function to simulate fetching products from MongoDB
export async function fetchProductsFromDB() {
  try {
    // Simulate API call to MongoDB
    console.log("Fetching products using connection string:", MONGODB_URI);
    
    // In a real implementation, this would fetch data from MongoDB
    // For now, retrieve from localStorage as a fallback
    const products = localStorage.getItem('products');
    
    // Log for debugging
    console.log("Products fetched:", products ? JSON.parse(products).length : 0);
    
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error("Error fetching products from MongoDB:", error);
    toast({
      title: "Database Error",
      description: "Failed to fetch products from database. Using local storage instead.",
      variant: "destructive",
    });
    // Fallback to localStorage
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  }
}

// Helper function to simulate saving products to MongoDB
export async function saveProductsToDB(products: any[]) {
  try {
    // Simulate API call to MongoDB
    console.log("Saving products using connection string:", MONGODB_URI);
    console.log("Products to save:", products.length);
    
    // In a real implementation, this would save to MongoDB
    // For now, save to localStorage as a fallback
    localStorage.setItem('products', JSON.stringify(products));
    
    return true;
  } catch (error) {
    console.error("Error saving products to MongoDB:", error);
    toast({
      title: "Database Error",
      description: "Failed to save products to database. Saved to local storage instead.",
      variant: "destructive",
    });
    // Fallback to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    return false;
  }
}

// Helper function to simulate fetching sales from MongoDB
export async function fetchSalesFromDB() {
  try {
    // Simulate API call to MongoDB
    console.log("Fetching sales using connection string:", MONGODB_URI);
    
    // In a real implementation, this would fetch data from MongoDB
    // For now, retrieve from localStorage as a fallback
    const sales = localStorage.getItem('sales');
    
    // Log for debugging
    console.log("Sales fetched:", sales ? JSON.parse(sales).length : 0);
    
    return sales ? JSON.parse(sales) : [];
  } catch (error) {
    console.error("Error fetching sales from MongoDB:", error);
    toast({
      title: "Database Error",
      description: "Failed to fetch sales from database. Using local storage instead.",
      variant: "destructive",
    });
    // Fallback to localStorage
    const sales = localStorage.getItem('sales');
    return sales ? JSON.parse(sales) : [];
  }
}

// Helper function to simulate saving sales to MongoDB
export async function saveSalesToDB(sales: any[]) {
  try {
    // Simulate API call to MongoDB
    console.log("Saving sales using connection string:", MONGODB_URI);
    console.log("Sales to save:", sales.length);
    
    // In a real implementation, this would save to MongoDB
    // For now, save to localStorage as a fallback
    localStorage.setItem('sales', JSON.stringify(sales));
    
    return true;
  } catch (error) {
    console.error("Error saving sales to MongoDB:", error);
    toast({
      title: "Database Error",
      description: "Failed to save sales to database. Saved to local storage instead.",
      variant: "destructive",
    });
    // Fallback to localStorage
    localStorage.setItem('sales', JSON.stringify(sales));
    return false;
  }
}

export const PLACEHOLDER_TEXT = "MongoDB connection string is configured. In a production environment, this should be stored securely as an environment variable on the server side.";
