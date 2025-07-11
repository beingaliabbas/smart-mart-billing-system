import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { testConnection } from "@/utils/mongoDBInfo";

const Settings = () => {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Smart Mart",
    address: "123 Main Street, City",
    phone: "+92 123 4567890",
    email: "info@smartmart.com",
    taxRate: "0",
    currency: "PKR",
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showStoreInfo: true,
    showTaxDetails: true,
    includeFooterMessage: true,
    footerMessage: "Thank you for shopping with us!",
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    connectionString: "mongodb://aliabbaszounr1:******@cluster1-shard-00-00.rpo2r.mongodb.net:27017,...",
    isConnecting: false,
  });

  const handleStoreSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStoreSettings({
      ...storeSettings,
      [e.target.id]: e.target.value,
    });
  };

  const handleSaveSettings = (type: string) => {
    // In a real app, this would save settings to the database
    toast({
      title: "Settings Saved",
      description: `${type} settings have been saved successfully.`,
    });
  };
  
  const handleTestConnection = async () => {
    setDatabaseSettings({
      ...databaseSettings,
      isConnecting: true,
    });
    
    try {
      const success = await testConnection();
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to MongoDB database.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to MongoDB. Please check your connection string.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection.",
        variant: "destructive",
      });
    } finally {
      setDatabaseSettings({
        ...databaseSettings,
        isConnecting: false,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your store preferences.</p>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="receipt">Receipt</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        {/* Store Settings Tab */}
        <TabsContent value="store" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Configure your store details. This information will appear on your receipts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.storeName}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={storeSettings.address}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={storeSettings.phone}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={storeSettings.email}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    value={storeSettings.taxRate}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={storeSettings.currency}
                    onChange={handleStoreSettingsChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Currency is set to PKR and cannot be changed.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("Store")}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Receipt Settings Tab */}
        <TabsContent value="receipt" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>
                Customize how your receipts look and what information they include.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showLogo" className="cursor-pointer">
                  Show Logo on Receipt
                </Label>
                <Switch
                  id="showLogo"
                  checked={receiptSettings.showLogo}
                  onCheckedChange={(checked) =>
                    setReceiptSettings({ ...receiptSettings, showLogo: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showStoreInfo" className="cursor-pointer">
                  Show Store Information
                </Label>
                <Switch
                  id="showStoreInfo"
                  checked={receiptSettings.showStoreInfo}
                  onCheckedChange={(checked) =>
                    setReceiptSettings({
                      ...receiptSettings,
                      showStoreInfo: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="showTaxDetails" className="cursor-pointer">
                  Show Tax Details
                </Label>
                <Switch
                  id="showTaxDetails"
                  checked={receiptSettings.showTaxDetails}
                  onCheckedChange={(checked) =>
                    setReceiptSettings({
                      ...receiptSettings,
                      showTaxDetails: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="includeFooterMessage" className="cursor-pointer">
                  Include Footer Message
                </Label>
                <Switch
                  id="includeFooterMessage"
                  checked={receiptSettings.includeFooterMessage}
                  onCheckedChange={(checked) =>
                    setReceiptSettings({
                      ...receiptSettings,
                      includeFooterMessage: checked,
                    })
                  }
                />
              </div>
              {receiptSettings.includeFooterMessage && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="footerMessage">Footer Message</Label>
                  <Input
                    id="footerMessage"
                    value={receiptSettings.footerMessage}
                    onChange={(e) =>
                      setReceiptSettings({
                        ...receiptSettings,
                        footerMessage: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSaveSettings("Receipt")}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Database Settings Tab */}
        <TabsContent value="database" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>MongoDB Connection</CardTitle>
              <CardDescription>
                Your MongoDB connection is configured. For security, the password is hidden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="connectionString">MongoDB Connection String</Label>
                <Input
                  id="connectionString"
                  value={databaseSettings.connectionString}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  For security, the full connection string is not displayed. The connection is configured for your MongoDB Atlas cluster.
                </p>
              </div>
              <div className="pt-2">
                <p className="text-sm">
                  <strong>Note:</strong> Your application is using a MongoDB connection. In a production environment, 
                  the connection string should be stored securely as an environment variable on your server.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={databaseSettings.isConnecting}
              >
                {databaseSettings.isConnecting ? "Testing..." : "Test Connection"}
              </Button>
              <Button onClick={() => handleSaveSettings("Database")}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
