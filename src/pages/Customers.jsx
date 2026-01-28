import { useMemo } from "react";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import CustomersTable from "@/component/CustomersTable";
import { Users, UserPlus, UserCheck } from "lucide-react";
import { customersList } from "../assets/data";

export const Customers = () => {
  // Calculate stats dynamically
  const stats = useMemo(() => {
    const total = customersList.length;
    const active = customersList.filter((c) => c.status === "Active").length;

    // Calculate new customers (joined this month/recently)
    const currentYear = new Date().getFullYear();
    const newJoiners = customersList.filter((c) => {
      const joinYear = new Date(c.joinDate).getFullYear();
      return joinYear === currentYear || c.status === "New";
    }).length;

    return { total, active, newJoiners };
  }, []);

  return (
    <div>
      <div className="dashboard-container flex">
        <Sidebar />
        <div className="container flex-1 bg-gray-50 min-h-screen p-6">
          <TopNav title="Customers" subtitle="Manage your client base" />

          <div className="mt-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(99,102,241,0.2)] flex items-center gap-5 hover:transform hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    Total Customers
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.total}
                  </h3>
                  <p className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                    +12%{" "}
                    <span className="text-slate-400 font-medium">
                      vs last month
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.2)] flex items-center gap-5 hover:transform hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    Active Now
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.active}
                  </h3>
                  <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                    +5%{" "}
                    <span className="text-slate-400 font-medium">
                      vs last week
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(236,72,153,0.2)] flex items-center gap-5 hover:transform hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                  <UserPlus className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    New This Year
                  </p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                    {stats.newJoiners}
                  </h3>
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1 mt-1 bg-rose-50 w-fit px-2 py-0.5 rounded-full">
                    -2%{" "}
                    <span className="text-slate-400 font-medium">
                      vs last month
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <CustomersTable />
          </div>
        </div>
      </div>
    </div>
  );
};
