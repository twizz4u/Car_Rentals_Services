import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
import OrdersTable from "@/components/orders/OrdersTable";
import CountUp from "react-countup";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useGetOrdersQuery, useGetOrderStatsQuery } from "../store/adminApi";

export const Orders = () => {
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Both lists come from the shared cache; `skip` reproduces the old
  // "do nothing until there is a token" guard.
  const ordersQuery = useGetOrdersQuery(undefined, { skip: !token });
  const statsQuery = useGetOrderStatsQuery(undefined, { skip: !token });

  const orders = ordersQuery.data || [];
  const loading = ordersQuery.isLoading;
  const stats = statsQuery.data || { total: 0, completed: 0, pending: 0 };
  const statsLoading = statsQuery.isLoading;

  // The old fetcher showed a toast when the orders request failed; keep it.
  useEffect(() => {
    if (ordersQuery.isError) {
      console.error("Failed to fetch orders:", ordersQuery.error);
      toast.error("Failed to load orders from server");
    }
  }, [ordersQuery.isError, ordersQuery.error]);

  useEffect(() => {
    if (statsQuery.isError) {
      console.error("Failed to fetch order stats:", statsQuery.error);
    }
  }, [statsQuery.isError, statsQuery.error]);

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

