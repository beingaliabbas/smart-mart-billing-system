
import { useState } from "react";
import { FileChartColumn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample sales data
const sampleSales = [
  {
    id: "SALE-1683356400000",
    date: "2024-05-01T12:00:00Z",
    total: 450,
    items: [
      { name: "Dairy Milk Chocolate", price: 150, quantity: 2, total: 300 },
      { name: "Pepsi Cola 500ml", price: 100, quantity: 1, total: 100 },
      { name: "Lays Chips Classic", price: 50, quantity: 1, total: 50 },
    ],
  },
  {
    id: "SALE-1683442800000",
    date: "2024-05-02T15:30:00Z",
    total: 350,
    items: [
      { name: "Pepsi Cola 500ml", price: 100, quantity: 2, total: 200 },
      { name: "Lays Chips Classic", price: 50, quantity: 3, total: 150 },
    ],
  },
];

const SalesHistory = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [selectedSale, setSelectedSale] = useState<(typeof sampleSales)[0] | null>(null);

  const handleExport = (format: "pdf" | "csv") => {
    // In a real app, this would generate and download the export file
    console.log(`Exporting sales report as ${format}`);
    alert(`Sales report would be exported as ${format}`);
  };

  const filteredSales = sampleSales.filter((sale) => {
    const saleDate = new Date(sale.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const amount = sale.total;
    const min = minAmount ? parseFloat(minAmount) : null;
    const max = maxAmount ? parseFloat(maxAmount) : null;
    const hasProduct = productFilter
      ? sale.items.some((item) =>
          item.name.toLowerCase().includes(productFilter.toLowerCase())
        )
      : true;

    return (
      (!fromDate || saleDate >= fromDate) &&
      (!toDate || saleDate <= toDate) &&
      (!min || amount >= min) &&
      (!max || amount <= max) &&
      hasProduct
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales History</h1>
          <p className="text-muted-foreground">
            View and export your sales reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            Export CSV
          </Button>
          <Button onClick={() => handleExport("pdf")}>Export PDF</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Sales</CardTitle>
          <CardDescription>
            Filter your sales history by date, amount, or product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAmount">Min Amount (PKR)</Label>
              <Input
                id="minAmount"
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Max Amount (PKR)</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="10000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-4">
              <Label htmlFor="product">Product</Label>
              <Input
                id="product"
                placeholder="Filter by product name..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Sales List</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total (PKR)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.length > 0 ? (
                      filteredSales.map((sale) => (
                        <TableRow
                          key={sale.id}
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => setSelectedSale(sale)}
                        >
                          <TableCell>{sale.id}</TableCell>
                          <TableCell>
                            {new Date(sale.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{sale.items.length} items</TableCell>
                          <TableCell>PKR {sale.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          No sales found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Sale Details</h3>
              {selectedSale ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Sale ID</div>
                    <div className="font-medium">{selectedSale.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date & Time</div>
                    <div className="font-medium">
                      {new Date(selectedSale.date).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Items</div>
                    <div className="space-y-2 mt-1">
                      {selectedSale.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>PKR {item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>PKR {selectedSale.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        // In a real app, this would generate and download the receipt
                        alert("This would generate and download the receipt PDF");
                      }}
                    >
                      Download Receipt
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <FileChartColumn className="h-12 w-12 mb-4 opacity-50" />
                  <p>Select a sale to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
