
import { useState, useRef, useEffect } from "react";
import { Barcode, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import BarcodeScanner from "@/components/BarcodeScanner";

interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
  total: number;
}

// Sample products database
const sampleProducts: Product[] = [
  {
    id: "1",
    barcode: "8901234567890",
    name: "Dairy Milk Chocolate",
    price: 150,
  },
  {
    id: "2",
    barcode: "8902345678901",
    name: "Pepsi Cola 500ml",
    price: 100,
  },
  {
    id: "3",
    barcode: "8903456789012",
    name: "Lays Chips Classic",
    price: 50,
  },
];

const Billing = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Focus the barcode input when the component mounts
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  // Calculate the subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);

  const handleBarcodeSearch = () => {
    if (!barcodeInput.trim()) return;

    // Search for the product in our sample database
    const product = sampleProducts.find((p) => p.barcode === barcodeInput);

    if (product) {
      addToCart(product);
      // Play beep sound
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
      audio.play().catch((error) => console.log("Error playing beep sound:", error));
      // Clear the input
      setBarcodeInput("");
      // Reset search results
      setSearchResults([]);
      // Focus back on the input for quick scanning
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    } else {
      toast({
        title: "Product Not Found",
        description: "No product found with this barcode.",
        variant: "destructive",
      });
      setSearchResults([]);
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    setBarcodeInput(barcode);
    handleBarcodeSearch();
  };

  const handleProductSearch = (query: string) => {
    setBarcodeInput(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Search for products by name (case insensitive)
    const results = sampleProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) || p.barcode.includes(query)
    );
    setSearchResults(results);
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      // Check if the product is already in the cart
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity of the existing item
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        newCart[existingItemIndex].total =
          newCart[existingItemIndex].quantity * newCart[existingItemIndex].price;
        return newCart;
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            ...product,
            quantity: 1,
            total: product.price,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      )
    );
  };

  const generatePDF = () => {
    // Show toast to indicate PDF generation has started
    toast({
      title: "Generating Receipt",
      description: "Your receipt is being generated...",
    });

    setIsGeneratingReceipt(true);

    // Simulate PDF generation with a timeout
    setTimeout(() => {
      setIsGeneratingReceipt(false);
      
      // In a real app, you would generate an actual PDF here
      // For this example, we'll just show a success message
      toast({
        title: "Receipt Ready",
        description: "Your receipt has been generated and is ready for download.",
      });
      
      // Simulate download by creating a fake PDF URL
      const blob = new Blob(["Simulated PDF content"], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add products to the cart first.",
        variant: "destructive",
      });
      return;
    }

    const saleData = {
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      total: subtotal,
    };

    // In a real app, you would save this to MongoDB
    console.log("Sale completed:", saleData);

    // Generate PDF receipt
    generatePDF();

    toast({
      title: "Sale Completed",
      description: `Sale ${saleData.id} has been processed successfully.`,
    });

    // Clear the cart
    setCart([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">Scan products and process sales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Scan or Search Products</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Scan barcode or search product..."
                      value={barcodeInput}
                      onChange={(e) => handleProductSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()}
                      ref={barcodeInputRef}
                      className="flex-1"
                    />
                    <Button onClick={handleBarcodeSearch}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                    <Button variant="outline" onClick={() => setIsScannerOpen(true)}>
                      <Barcode className="h-4 w-4" />
                      <span className="sr-only">Scan</span>
                    </Button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((product) => (
                          <TableRow key={product.id} className="cursor-pointer hover:bg-muted">
                            <TableCell onClick={() => addToCart(product)}>
                              {product.name}
                            </TableCell>
                            <TableCell onClick={() => addToCart(product)}>
                              PKR {product.price.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  addToCart(product);
                                  // Clear input and focus back for quick scanning
                                  setBarcodeInput("");
                                  setSearchResults([]);
                                  if (barcodeInputRef.current) {
                                    barcodeInputRef.current.focus();
                                  }
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-2">Current Receipt</h3>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.length > 0 ? (
                          cart.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>PKR {item.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="mx-2 w-6 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>PKR {item.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              No items added yet. Scan or search for products to add.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Receipt Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Subtotal</span>
                  <span>PKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Tax (0%)</span>
                  <span>PKR 0.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b text-lg font-bold">
                  <span>Total</span>
                  <span>PKR {subtotal.toFixed(2)}</span>
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleCheckout}
                    disabled={isGeneratingReceipt || cart.length === 0}
                  >
                    {isGeneratingReceipt ? "Processing..." : "Complete Sale & Print Receipt"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setCart([])}
                    disabled={isGeneratingReceipt || cart.length === 0}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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

export default Billing;
