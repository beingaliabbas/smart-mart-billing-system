
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState<number>(3);

  const clearNotifications = () => {
    setNotifications(0);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read."
    });
  };

  // Don't show header on certain routes
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold md:hidden">Smart Mart</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={clearNotifications}
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {notifications}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </div>
              
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
