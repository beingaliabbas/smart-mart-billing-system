
import { Barcode, Receipt, FileChartColumn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const dashboardItems = [
    {
      title: "Products",
      description: "Add, edit and manage your products",
      icon: <Barcode className="dashboard-icon" />,
      path: "/products",
      color: "bg-blue-50",
    },
    {
      title: "Billing",
      description: "Start scanning products and generate receipts",
      icon: <Receipt className="dashboard-icon" />,
      path: "/billing",
      color: "bg-green-50",
    },
    {
      title: "Sales History",
      description: "View and export your sales reports",
      icon: <FileChartColumn className="dashboard-icon" />,
      path: "/sales",
      color: "bg-amber-50",
    },
    {
      title: "Settings",
      description: "Configure your store preferences",
      icon: <Settings className="dashboard-icon" />,
      path: "/settings",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Smart Mart Billing System.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
          <Card 
            key={item.title} 
            className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${item.color}`}
            onClick={() => navigate(item.path)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {item.icon}
                <h3 className="mt-4 font-bold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <Button className="mt-4" variant="outline">
                  Open {item.title}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Recent Sales</h3>
            <p className="text-muted-foreground text-sm mb-4">
              No sales data available yet. Start billing to see recent sales here.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/billing")}>
              Start Billing
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Popular Products</h3>
            <p className="text-muted-foreground text-sm mb-4">
              No product data available yet. Add products to see popular items here.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/products")}>
              Manage Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
