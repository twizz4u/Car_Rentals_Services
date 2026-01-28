import { Button } from "@/components/ui/button";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import PaymentsTable from "@/component/PaymentsTable";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const dailyRevenueData = [
  { day: "Mon", revenue: 45000 },
  { day: "Tue", revenue: 52000 },
  { day: "Wed", revenue: 38000 },
  { day: "Thu", revenue: 65000 },
  { day: "Fri", revenue: 55000 },
  { day: "Sat", revenue: 72000 },
  { day: "Sun", revenue: 60000 },
];

export const ClaimsPayments = () => {
  return (
    <div>
      <div className="dashboard-container flex">
        <Sidebar />
        <div className="container flex-1 bg-gray-50 min-h-screen p-6">
          <TopNav
            title="Payments"
            subtitle="Manage transactions and payments"
          />

          <section className="m-5 space-y-6">
            <div className="flex items-center justify-between bg-white/50 p-4 rounded-xl border border-slate-100 backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Overview</h2>
                <p className="text-sm text-slate-500">
                  Track all your incoming and outgoing payments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">
                  Current Month Revenue
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  ₦4,250,000
                </p>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full mt-2 inline-block">
                  +12.5% from last month
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">
                  Pending Payments
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  ₦185,000
                </p>
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full mt-2 inline-block">
                  5 transactions pending
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  ₦45,000,000
                </p>
                <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full mt-2 inline-block">
                  All time
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Daily Revenue
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₦${value / 1000}k`}
                      />
                      <Tooltip
                        formatter={(value) => [`₦${value}`, "Revenue"]}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Revenue Trend
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `₦${value / 1000}k`}
                      />
                      <Tooltip
                        formatter={(value) => [`₦${value}`, "Revenue"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <PaymentsTable />
          </section>
        </div>
      </div>
    </div>
  );
};
