import { Button } from "@/components/ui/button";
import { Home, ClipboardList, Users, CreditCard, CarFront } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-indigo-50 text-indigo-600"
      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100";
  };

  return (
    <nav className="sideNav h-screen w-64 bg-white/90 backdrop-blur-sm shadow-md sticky top-4 m-4 rounded-xl border border-slate-100">
      <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
          TR
        </div>
        <div>
          <div className="text-slate-800 font-semibold">Tasin Rentals</div>
          <div className="text-xs text-slate-400">Manage bookings & cars</div>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
          <div>
            <div className="text-sm font-medium text-slate-800">
              Hello, Peter
            </div>
            <div className="text-xs text-slate-400">Admin</div>
          </div>
        </div>

        <ul className="flex flex-col space-y-2">
          <li>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-colors duration-150 rounded-md px-3 py-2 font-medium ${isActive(
                  "/dashboard",
                )}`}
              >
                <Home className="w-5 h-5" /> Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/manage-cars">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-colors duration-150 rounded-md px-3 py-2 font-medium ${isActive(
                  "/manage-cars",
                )}`}
              >
                <CarFront className="w-5 h-5" />
                Manage Cars
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/orders">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-colors duration-150 rounded-md px-3 py-2 font-medium ${isActive(
                  "/orders",
                )}`}
              >
                <ClipboardList className="w-5 h-5" /> Rental Orders
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/customers">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-colors duration-150 rounded-md px-3 py-2 font-medium ${isActive(
                  "/customers",
                )}`}
              >
                <Users className="w-5 h-5" /> Customers
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/payments">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-colors duration-150 rounded-md px-3 py-2 font-medium ${isActive(
                  "/payments",
                )}`}
              >
                <CreditCard className="w-5 h-5" /> Payments
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
