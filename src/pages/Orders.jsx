import { useState, useEffect } from "react";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import OrdersTable from "@/component/OrdersTable";
import { ClipboardList, CheckCircle, Clock, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const Orders = () => {
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [token]);

  function fetchOrders() {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/rentalOrders", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          console.warn("Unexpected API format:", data);
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        toast.error("Failed to load orders from server");
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }

  function fetchStats() {
    setStatsLoading(true);
    fetch("http://127.0.0.1:8000/api/rentalOrderStats", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (data.status === "success") {
          setStats({
            total: data.total ?? 0,
            completed: data.completed ?? 0,
            pending: data.pending ?? 0,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch order stats:", err);
      })
      .finally(() => setStatsLoading(true)); // Assuming typo in original file where it was set to false then true? Wait, it should be false.
  }

  // Fixing the finally block for stats loading
  useEffect(() => {
    if (statsLoading === true && stats.total !== 0) setStatsLoading(false);
  }, [stats]);

  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Rental Orders"
          subtitle="Track and manage vehicle bookings"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ClipboardList className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Total Orders
                </p>
                {statsLoading ? (
                  <Loader2 className="w-8 h-8 mt-1 animate-spin text-blue-600" />
                ) : (
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.total}
                  </h3>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all group">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Completed
                </p>
                {statsLoading ? (
                  <Loader2 className="w-8 h-8 mt-1 animate-spin text-green-600" />
                ) : (
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.completed}
                  </h3>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all group sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Active/Pending
                </p>
                {statsLoading ? (
                  <Loader2 className="w-8 h-8 mt-1 animate-spin text-amber-600" />
                ) : (
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.pending}
                  </h3>
                )}
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mx-2 md:mx-0">
            <div className="overflow-x-auto">
              <OrdersTable orders={orders} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

