
import { useState } from "react";
import { Plus, Barcode, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import BarcodeScanner from "@/components/BarcodeScanner";

interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  createdAt: string;
}

const Products = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([
    // Sample product data
    {
      id: "1",
      barcode: "8901234567890",
      name: "Dairy Milk Chocolate",
      price: 150,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      barcode: "8902345678901",
      name: "Pepsi Cola 500ml",
      price: 100,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    name: "",
    price: "",
  });

  const handleBarcodeDetected = (barcode: string) => {
    // Find if product already exists with this barcode
    const existingProduct = products.find(p => p.barcode === barcode);
    
    if (existingProduct) {
      toast({
        title: "Product Found",
        description: `${existingProduct.name} already exists in your inventory.`,
      });
      setCurrentProduct(existingProduct);
      setIsEditDialogOpen(true);
    } else {
      // Set the barcode in the new product form
      setNewProduct(prev => ({ ...prev, barcode }));
      setIsAddDialogOpen(true);
      
      // TODO: In a real app, you would fetch product details from an API
      toast({
        title: "Barcode Detected",
        description: `Barcode ${barcode} scanned successfully.`,
      });
    }
  };

  const handleAddProduct = () => {
    const price = parseFloat(newProduct.price);
    if (!newProduct.barcode || !newProduct.name || isNaN(price)) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      barcode: newProduct.barcode,
      name: newProduct.name,
      price: price,
      createdAt: new Date().toISOString(),
    };

    setProducts([...products, product]);
    setNewProduct({ barcode: "", name: "", price: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Product Added",
      description: `${product.name} has been added successfully.`,
    });
  };

  const handleEditProduct = () => {
    if (!currentProduct) return;
    
    const price = parseFloat(currentProduct.price.toString());
    if (!currentProduct.barcode || !currentProduct.name || isNaN(price)) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === currentProduct.id
        ? { ...currentProduct, price }
        : product
    );

    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    toast({
      title: "Product Updated",
      description: `${currentProduct.name} has been updated successfully.`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const productToDelete = products.find((product) => product.id === id);
    if (!productToDelete) return;
    
    setProducts(products.filter((product) => product.id !== id));
    toast({
      title: "Product Deleted",
      description: `${productToDelete.name} has been deleted successfully.`,
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <Input
            placeholder="Search products by name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Button variant="outline" onClick={() => setIsScannerOpen(true)}>
          <Barcode className="mr-2 h-4 w-4" /> Scan Barcode
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barcode</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price (PKR)</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.barcode}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>PKR {product.price.toFixed(2)}</TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {searchTerm ? "No products found matching your search." : "No products have been added yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details of the new product below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="barcode">Barcode</Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                  placeholder="Enter barcode number"
                />
                <Button variant="outline" size="icon" onClick={() => {
                  setIsAddDialogOpen(false);
                  setTimeout(() => setIsScannerOpen(true), 100);
                }}>
                  <Barcode className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price (PKR)</Label>
              <Input
                id="price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="Enter price"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of this product.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-barcode">Barcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-barcode"
                    value={currentProduct.barcode}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, barcode: e.target.value })
                    }
                  />
                  <Button variant="outline" size="icon" onClick={() => {
                    setIsEditDialogOpen(false);
                    setTimeout(() => setIsScannerOpen(true), 100);
                  }}>
                    <Barcode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (PKR)</Label>
                <Input
                  id="edit-price"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) || 0 })
                  }
                  type="number"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner */}
      {isScannerOpen && (
        <BarcodeScanner 
          onDetected={handleBarcodeDetected}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
    </div>
  );
};

export default Products;
