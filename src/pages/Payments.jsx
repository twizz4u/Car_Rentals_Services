import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
import PaymentsTable from "@/components/payments/PaymentsTable";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
        const response = await fetch(
          "http://127.0.0.1:8000/api/payments/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            signal,
          },
        );
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
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-stone-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Payments"
          subtitle="Manage transactions and payments"
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <section className="space-y-6">
          {/* Premium Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingStats ? (
              // Skeleton loading cards
              <>
                {/* Skeleton for primary card */}
                <div className="bg-amber-100 p-6 rounded-[2px] border border-stone-200 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-11 h-11 bg-amber-200/60 rounded-[2px] animate-pulse" />
                    <div className="w-32 h-7 bg-amber-200/60 rounded-[2px] animate-pulse" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <div className="h-4 w-40 bg-amber-200/60 rounded-full animate-pulse" />
                    <div className="h-8 w-28 bg-amber-200/60 rounded-lg animate-pulse" />
                  </div>
                </div>

                {/* Skeleton for secondary cards */}
                {[
                  {
                    accent: "bg-amber-100",
                    bar: "from-amber-400 to-amber-200",
                  },
                  {
                    accent: "bg-emerald-100",
                    bar: "from-emerald-400 to-emerald-200",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-[2px] border border-stone-200 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`w-11 h-11 ${card.accent} rounded-[2px] animate-pulse`}
                      />
                      <div className="w-20 h-7 bg-stone-100 rounded-[2px] animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-stone-200 rounded-full animate-pulse" />
                      <div className="h-8 w-24 bg-stone-200 rounded-lg animate-pulse" />
                    </div>
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bar} opacity-50`}
                    ></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Primary Card */}
                <div className="bg-amber-500 p-6 rounded-[2px] border border-amber-600 text-black relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-black/10 p-2.5 rounded-[2px]">
                      <Wallet className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-xs font-semibold bg-black/10 text-black px-2.5 py-1.5 rounded-[2px]">
                      Current Month
                    </span>
                  </div>
                  <p className="text-black/70 text-sm font-medium mb-1 relative z-10">
                    Current Month Revenue
                  </p>
                  <p className="font-['Playfair_Display',serif] text-3xl font-normal tracking-tight tabular-nums relative z-10">
                    {formatCurrency(stats.current_month_revenue)}
                  </p>
                </div>

                {/* Pending Clearances */}
                <div className="bg-white p-6 rounded-[2px] border border-stone-200 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-amber-50 p-2.5 rounded-[2px] text-amber-700">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1.5 rounded-[2px] border border-stone-200">
                      Pending
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium uppercase tracking-[0.18em] mb-1">
                    Pending Clearances
                  </p>
                  <p className="font-['Playfair_Display',serif] text-3xl font-normal text-stone-900 tracking-tight tabular-nums">
                    {formatCurrency(stats.pending)}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 opacity-60"></div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-[2px] border border-stone-200 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-amber-50 p-2.5 rounded-[2px] text-amber-700">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1.5 rounded-[2px] border border-stone-200">
                      All-time
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium uppercase tracking-[0.18em] mb-1">
                    Total Revenue
                  </p>
                  <p className="font-['Playfair_Display',serif] text-3xl font-normal text-stone-900 tracking-tight tabular-nums">
                    {formatCurrency(stats.total_revenue)}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-900 opacity-80"></div>
                </div>
              </>
            )}
          </div>

          <PaymentsTable data={payments} isLoading={isLoadingTable} />
        </section>
      </div>
    </div>
  );
};
