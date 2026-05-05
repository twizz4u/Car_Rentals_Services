import { useState, useEffect } from "react";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import CustomersTable from "@/component/CustomersTable";
import { Users, UserPlus, CalendarDays } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Customers = () => {
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    newThisMonth: 0,
    newJoiners: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/customerStats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch customer stats");
        const result = await response.json();
        // The API may return customers under "data" or "customers" key
        const customers = result.data || result.customers || [];
        setData(customers);
        setStats({
          total: result.total_customers || 0,
          newThisMonth: result.new_customers_this_month || 0,
          newJoiners: result.new_customers_this_year || 0
        });
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);

  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Customers"
          subtitle="Manage your client base"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0">
            {isLoading ? (
              // Skeleton loading cards
              <>
                {[
                  { bg: "bg-indigo-50", shadow: "rgba(99,102,241,0.2)" },
                  { bg: "bg-emerald-50", shadow: "rgba(16,185,129,0.2)" },
                  { bg: "bg-pink-50", shadow: "rgba(236,72,153,0.2)" },
                ].map((card, i) => (
                  <div
                    key={i}
                    className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5`}
                  >
                    <div className={`w-14 h-14 ${card.bg} rounded-2xl animate-pulse`} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-28 bg-slate-200 rounded-full animate-pulse" />
                      <div className="h-7 w-16 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Loaded stats cards
              <>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all group">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Customers</p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</h3>
                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                      +12% <span className="text-slate-400 font-medium whitespace-nowrap">vs last month</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all group">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <CalendarDays className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">New This Month</p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{stats.newThisMonth}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">Active</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-all group lg:col-span-1 sm:col-span-2 lg:sm:col-span-1">
                  <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <UserPlus className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">New This Year</p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">{stats.newJoiners}</h3>
                    <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-1 bg-rose-50 w-fit px-2 py-0.5 rounded-full">
                      -2% <span className="text-slate-400 font-medium whitespace-nowrap">vs last month</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden px-2 md:px-0 mx-2 md:mx-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <CustomersTable data={data} isLoading={isLoading} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

