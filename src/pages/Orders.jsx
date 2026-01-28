import { useMemo } from "react";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import OrdersTable from "@/component/OrdersTable";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";
import { allOrders } from "../assets/data";

export const Orders = () => {
  // Calculate Order Stats
  const stats = useMemo(() => {
    const total = allOrders.length;
    const completed = allOrders.filter(
      (o) => o.status === "Completed" || o.status === "Approved",
    ).length;
    const pending = allOrders.filter(
      (o) => o.status === "Pending" || o.status === "Ongoing",
    ).length;

    return { total, completed, pending };
  }, []);

  return (
    <div>
      <div className="dashboard-container flex">
        <Sidebar />
        <div className="container flex-1 bg-gray-50 min-h-screen p-6">
          <TopNav
            title="Rental Orders"
            subtitle="Track and manage vehicle bookings"
          />

          <div className="mt-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(37,99,235,0.2)] flex items-center gap-5 hover:transform hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    Total Orders
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.total}
                  </h3>
                  <p className="text-xs text-blue-500 font-bold flex items-center gap-1 mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                    +8%{" "}
                    <span className="text-slate-400 font-medium">
                      this week
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(22,163,74,0.2)] flex items-center gap-5 hover:transform hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    Completed
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.completed}
                  </h3>
                  <p className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                    +12%{" "}
                    <span className="text-slate-400 font-medium">
                      completion rate
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(217,119,6,0.2)] flex items-center gap-5 hover:transform hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    Active/Pending
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.pending}
                  </h3>
                  <p className="text-xs text-amber-500 font-bold flex items-center gap-1 mt-1 bg-amber-50 w-fit px-2 py-0.5 rounded-full">
                    4 urgent actions
                  </p>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <OrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
};
