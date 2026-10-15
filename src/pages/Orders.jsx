import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
import OrdersTable from "@/components/orders/OrdersTable";
import CountUp from "react-countup";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const Orders = () => {
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchOrders = useCallback(() => {
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
  }, [token]);

  const fetchStats = useCallback(() => {
    setStatsLoading(true);
    fetch("http://127.0.0.1:8000/api/rentalOrders/stats", {
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
      .finally(() => setStatsLoading(false));
  }, [token]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-stone-50">
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
            <div className="p-4 rounded-[2px] bg-white border border-stone-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                    Total Orders
                  </p>
                  <div className="mt-1">
                    {statsLoading ? (
                      <span className="block h-8 w-20 rounded-[2px] bg-stone-200 animate-pulse" />
                    ) : (
                      <span className="font-['Playfair_Display',serif] text-[1.75rem] font-normal text-stone-900 tabular-nums">
                        <CountUp end={stats.total} duration={1.2} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-[2px] bg-amber-50">
                  <ClipboardList className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-white border border-stone-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                    Completed
                  </p>
                  <div className="mt-1">
                    {statsLoading ? (
                      <span className="block h-8 w-20 rounded-[2px] bg-stone-200 animate-pulse" />
                    ) : (
                      <span className="font-['Playfair_Display',serif] text-[1.75rem] font-normal text-stone-900 tabular-nums">
                        <CountUp end={stats.completed} duration={1.2} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-[2px] bg-amber-50">
                  <CheckCircle className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-white border border-stone-200 sm:col-span-2 lg:col-span-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                    Active/Pending
                  </p>
                  <div className="mt-1">
                    {statsLoading ? (
                      <span className="block h-8 w-20 rounded-[2px] bg-stone-200 animate-pulse" />
                    ) : (
                      <span className="font-['Playfair_Display',serif] text-[1.75rem] font-normal text-stone-900 tabular-nums">
                        <CountUp end={stats.pending} duration={1.2} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-[2px] bg-amber-50">
                  <Clock className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-[2px] border border-stone-200 overflow-hidden mx-2 md:mx-0">
            <div className="overflow-x-auto">
              <OrdersTable orders={orders} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

