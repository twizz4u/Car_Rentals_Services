import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
import CustomersTable from "@/components/customers/CustomersTable";
import CountUp from "react-countup";
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
        const response = await fetch("http://127.0.0.1:8000/api/customers/stats", {
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
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-stone-50">
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
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-[2px] border border-stone-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-3 w-28 bg-stone-200 rounded-full animate-pulse" />
                        <div className="h-8 w-20 bg-stone-200 rounded-[2px] animate-pulse" />
                      </div>
                      <div className="w-12 h-12 bg-stone-200 rounded-[2px] animate-pulse" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Loaded stats cards
              <>
                <div className="p-4 rounded-[2px] bg-white border border-stone-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">Total Customers</p>
                      <div className="mt-1">
                        <span className="font-['Playfair_Display',serif] text-[1.75rem] font-normal text-stone-900 tabular-nums"><CountUp end={stats.total} duration={1.2} /></span>
                      </div>
                    </div>
                    <div className="p-3 rounded-[2px] bg-amber-50">
                      <Users className="w-6 h-6 text-amber-700" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-[2px] bg-white border border-stone-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">New This Month</p>
                      <div className="mt-1">
                        <span className="font-['Playfair_Display',serif] text-[1.75rem] font-normal text-stone-900 tabular-nums"><CountUp end={stats.newThisMonth} duration={1.2} /></span>
                      </div>
                    </div>
                    <div className="p-3 rounded-[2px] bg-amber-50">
                      <CalendarDays className="w-6 h-6 text-amber-700" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-[2px] bg-white border border-stone-200 lg:col-span-1 sm:col-span-2 lg:sm:col-span-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">New This Year</p>
                      <div className="mt-1">
                        <span className="font-['Playfair_Display',serif] text-[1.75rem] font-normal text-stone-900 tabular-nums"><CountUp end={stats.newJoiners} duration={1.2} /></span>
                      </div>
                    </div>
                    <div className="p-3 rounded-[2px] bg-amber-50">
                      <UserPlus className="w-6 h-6 text-amber-700" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-[2px] border border-stone-200 overflow-hidden px-2 md:px-0 mx-2 md:mx-0">
            {isLoading ? (
              <div className="p-5 space-y-3 animate-pulse" aria-label="Loading customers">
                <div className="h-10 rounded-[2px] bg-stone-100" />
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="h-14 rounded-[2px] bg-stone-100" />
                ))}
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

