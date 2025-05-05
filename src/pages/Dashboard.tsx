
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Calendar, Receipt, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { products, sales, loading } = useApp();

  const quickNavCards = [
    {
      title: "Products",
      description: "Manage your inventory",
      icon: <BarChart className="h-6 w-6" />,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-700 dark:text-blue-300",
      path: "/products",
      stat: loading ? "..." : products.length,
      statLabel: "Products"
    },
    {
      title: "Billing",
      description: "Create new bills",
      icon: <Receipt className="h-6 w-6" />,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-700 dark:text-green-300",
      path: "/billing",
      stat: null,
      statLabel: null
    },
    {
      title: "Sales History",
      description: "View past transactions",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-700 dark:text-purple-300",
      path: "/sales",
      stat: loading ? "..." : sales.length,
      statLabel: "Sales"
    },
    {
      title: "Settings",
      description: "Configure your store",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-amber-100 dark:bg-amber-900",
      textColor: "text-amber-700 dark:text-amber-300",
      path: "/settings",
      stat: null,
      statLabel: null
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Smart Mart Billing System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickNavCards.map((card, index) => (
          <Card key={index} className="border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
                {card.stat !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold">{card.stat}</p>
                    <p className="text-xs text-muted-foreground">{card.statLabel}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <CardTitle className={`${card.textColor}`}>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate(card.path)}>
                Go to {card.title}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>How to use Smart Mart Billing System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. Add Products to Inventory</h3>
              <p className="text-sm text-muted-foreground">
                First, add your products in the Products section. You can scan barcodes 
                with your device camera or enter them manually.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">2. Create a New Bill</h3>
              <p className="text-sm text-muted-foreground">
                Go to the Billing section and scan products to quickly add them to the 
                receipt. Adjust quantities as needed and complete the sale.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">3. View Sales History</h3>
              <p className="text-sm text-muted-foreground">
                Track your sales performance and export reports from the Sales History 
                section. Filter by date or product to find specific transactions.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/products")}>
              Start by Adding Products
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Storage Mode</h3>
                <p className="text-sm">Local Storage</p>
                <p className="text-xs text-muted-foreground">
                  Using browser storage for data. Connect Supabase for backend functionality.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Version</h3>
                <p className="text-sm">1.0.0</p>
                <p className="text-xs text-muted-foreground">
                  Smart Mart Billing System
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Total Products</h3>
                <p className="text-sm">{loading ? "Loading..." : products.length}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Total Sales</h3>
                <p className="text-sm">{loading ? "Loading..." : sales.length}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground mb-2 text-center">
              For full functionality, connect to a database backend
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
