import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import PaymentsTable from "@/component/PaymentsTable";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

const revenueData = [
  { day: "Mon", current: 45000, previous: 38000 },
  { day: "Tue", current: 52000, previous: 42000 },
  { day: "Wed", current: 38000, previous: 45000 },
  { day: "Thu", current: 65000, previous: 48000 },
  { day: "Fri", current: 55000, previous: 52000 },
  { day: "Sat", current: 72000, previous: 60000 },
  { day: "Sun", current: 60000, previous: 58000 },
];

const paymentMethodsData = [
  { name: "Bank Transfer", value: 3500000, color: "#6366f1" },
  { name: "Credit Card", value: 2100000, color: "#38bdf8" },
  { name: "POS / Web", value: 850000, color: "#fbbf24" },
  { name: "Cash", value: 450000, color: "#34d399" },
];

const formatCurrency = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "₦0";
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const ClaimsPayments = () => {
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    current_month_revenue: 0,
    pending: 0,
    total_revenue: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await fetch("http://127.0.0.1:8000/api/payments/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal,
        });
        if (!response.ok) throw new Error("Failed to fetch payment stats");
        const result = await response.json();
        setStats({
          current_month_revenue: result.data?.current_month_revenue || 0,
          pending: result.data?.pending || 0,
          total_revenue: result.data?.total_revenue || 0,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching payment stats:", error);
        }
      } finally {
        setIsLoadingStats(false);
      }
    };

    const fetchPayments = async () => {
      try {
        setIsLoadingTable(true);
        const response = await fetch("http://127.0.0.1:8000/api/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal,
        });
        if (!response.ok) throw new Error("Failed to fetch payments");
        const result = await response.json();
        setPayments(result.data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching payments:", error);
        }
      } finally {
        setIsLoadingTable(false);
      }
    };

    fetchStats();
    fetchPayments();

    return () => {
      controller.abort();
    };
  }, [token]);

  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Payments"
          subtitle="Manage transactions and payments"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/50 p-4 rounded-xl border border-slate-100 backdrop-blur-sm px-4 md:px-0">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800">Financial Overview</h2>
              <p className="text-xs md:text-sm text-slate-500">
                Track your monthly revenue targets and channel breakdowns.
              </p>
            </div>
          </div>

          {/* Premium Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingStats ? (
              // Skeleton loading cards
              <>
                {/* Skeleton for primary gradient card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl border-none shadow-lg shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-11 h-11 bg-white/20 rounded-xl animate-pulse" />
                    <div className="w-32 h-7 bg-white/20 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <div className="h-4 w-40 bg-white/20 rounded-full animate-pulse" />
                    <div className="h-8 w-28 bg-white/20 rounded-lg animate-pulse" />
                  </div>
                </div>

                {/* Skeleton for secondary cards */}
                {[
                  { accent: "bg-amber-100", bar: "from-amber-400 to-amber-200" },
                  { accent: "bg-emerald-100", bar: "from-emerald-400 to-emerald-200" },
                ].map((card, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-11 h-11 ${card.accent} rounded-xl animate-pulse`} />
                      <div className="w-20 h-7 bg-slate-100 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-slate-200 rounded-full animate-pulse" />
                      <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bar} opacity-50`}></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Primary Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-2xl border-none shadow-lg shadow-indigo-200 text-white relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-sm">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold bg-white/20 text-indigo-50 px-2.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                      Current Month
                    </span>
                  </div>
                  <p className="text-indigo-100 text-sm font-medium mb-1 relative z-10">
                    Current Month Revenue
                  </p>
                  <p className="text-3xl font-extrabold tracking-tight relative z-10">
                    {formatCurrency(stats.current_month_revenue)}
                  </p>
                </div>

                {/* Pending Clearances */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-full border border-amber-100">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">
                    Pending Clearances
                  </p>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    {formatCurrency(stats.pending)}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-200 opacity-50"></div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-200">
                      All-time
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
                    {formatCurrency(stats.total_revenue)}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-200 opacity-50"></div>
                </div>
              </>
            )}
          </div>

          {/* Diverse Data Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart: spanning 2 columns for trends */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Revenue Trend
                  </h3>
                  <p className="text-sm text-slate-500">Daily collections compared to previous week</p>
                </div>
                <div className="flex items-center space-x-4 text-sm font-medium">
                  <div className="flex items-center text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2 shadow-sm"></span>
                    This Week
                  </div>
                  <div className="flex items-center text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-slate-300 mr-2"></span>
                    Last Week
                  </div>
                </div>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `₦${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      formatter={(value, name) => [`₦${value.toLocaleString()}`, name === 'current' ? 'This Week' : 'Last Week']}
                    />
                    <Area type="monotone" dataKey="previous" stroke="#cbd5e1" strokeWidth={2} fillOpacity={1} fill="url(#colorPrevious)" />
                    <Area type="monotone" dataKey="current" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie/Donut Chart: distinct data type for 1 column */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Channel Performance
                </h3>
                <p className="text-sm text-slate-500 mb-2">Breakdown of payment channels</p>
              </div>

              <div className="flex-1 min-h-[220px] relative -mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₦${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Inner text for donut hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-xs text-slate-400 font-medium">Total Vol</span>
                  <span className="text-sm font-bold text-slate-700">6.95m</span>
                </div>
              </div>

              {/* Custom Colored Legend */}
              <div className="mt-4 grid grid-cols-1 gap-y-3">
                {paymentMethodsData.map((method, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center text-slate-600 font-medium">
                      <span className="w-3 h-3 rounded-full mr-3 shadow-sm" style={{ backgroundColor: method.color }}></span>
                      {method.name}
                    </div>
                    <span className="font-bold text-slate-800">
                      {Math.round((method.value / 6900000) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <PaymentsTable data={payments} isLoading={isLoadingTable} />
          </div>
        </section>
      </div>
    </div>
  );
};

