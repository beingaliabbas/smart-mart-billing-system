
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Barcode, Receipt, FileChartColumn, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navItems = [
    { 
      title: "Dashboard", 
      path: "/", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      title: "Products", 
      path: "/products", 
      icon: <Barcode className="h-5 w-5" /> 
    },
    { 
      title: "Billing", 
      path: "/billing", 
      icon: <Receipt className="h-5 w-5" /> 
    },
    { 
      title: "Sales History", 
      path: "/sales", 
      icon: <FileChartColumn className="h-5 w-5" /> 
    },
    { 
      title: "Settings", 
      path: "/settings", 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className={`md:hidden fixed z-50 top-4 ${isOpen ? 'left-64' : 'left-4'} p-2 rounded-md bg-primary text-primary-foreground shadow-md`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 h-full w-64 bg-primary text-primary-foreground transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-primary-foreground/10">
            <h1 className="text-xl font-bold">Smart Mart</h1>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-primary-foreground"
                          : "hover:bg-sidebar-accent hover:text-primary-foreground"
                      )
                    }
                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-primary-foreground/10">
            <div className="text-sm">
              <div className="font-medium">Smart Mart Billing</div>
              <div className="text-primary-foreground/70">v1.0.0</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
