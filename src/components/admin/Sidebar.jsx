import { Button } from "@/components/ui/button";
import { Home, ClipboardList, Users, CreditCard, CarFront, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-indigo-50 text-indigo-600"
      : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <nav className={`
        sideNav fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-xl 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block lg:h-screen lg:m-4 lg:rounded-xl lg:border lg:border-slate-100
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 lg:border-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
              TR
            </div>
            <div>
              <div className="text-slate-800 font-semibold">Tasin Rentals</div>
              <div className="text-xs text-slate-400">Manage bookings & cars</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-6 px-2 lg:mb-4">
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
              <Link to="/dashboard" onClick={onClose}>
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
              <Link to="/manage-cars" onClick={onClose}>
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
              <Link to="/orders" onClick={onClose}>
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
              <Link to="/customers" onClick={onClose}>
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
              <Link to="/payments" onClick={onClose}>
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
    </>
  );
}
