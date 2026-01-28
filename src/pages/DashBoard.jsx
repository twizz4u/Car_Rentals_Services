import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import StatCard from "@/component/statCard";
import RecentOrdersTable from "@/component/RecentOrders";
import RecentActivityFeed from "@/component/RecentActivity";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  ClipboardList,
  Users,
  CreditCard,
  CarFront,
  Car,
} from "lucide-react";
import {
  dailyRentalData,
  topCarsData,
  COLORS,
  COLORSTATS,
} from "../assets/data";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const DashBoard = () => {
  const { user } = useAuth();
  const hasShownDemoToast = useRef(false);

  useEffect(() => {
    if (user?.isDemo && !hasShownDemoToast.current) {
      hasShownDemoToast.current = true;
      toast.warning("Demo Mode Active", {
        description: "You're logged in with demo credentials. Some features may be limited.",
        duration: 6000,
      });
    }
  }, [user]);
  return (
    <div>
      <div className="dashboard-container flex">
        <Sidebar />
        <div className="container flex-1 bg-gray-50 min-h-screen p-6">
          <TopNav
            title="Dashboard"
            subtitle="Overview of activity and analytics"
          />
          <section>
            {/* <div className="metric grid grid-cols-4 m-5 gap-4">
              <div className="flex justify-between p-4  bg-blue-50/40">
                <div className="flex flex-col gap-2">
                  <p>Total Cars</p>
                  <span className="text-2xl font-semibold">50</span>
                </div>
                icon
              </div>
              <div className="flex justify-between p-4  bg-blue-50/40">
                <div className="flex flex-col gap-2">
                  <p>Total Rental Orders</p>
                  <span className="text-2xl font-semibold">20</span>
                </div>
                icon
              </div>

              <div className="flex justify-between p-4 bg-blue-50/40">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500">Total Available Cars </p>
                  <span className="text-2xl font-semibold">30</span>
                </div>
                icon
              </div>

              <div className="flex justify-between p-4 bg-blue-50/40">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500">Total visited</p>
                  <span className="text-2xl font-semibold">1000+</span>
                </div>
                icon
              </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-5">
              <StatCard
                label="Total Cars"
                value={50}
                icon={Car}
                trend={12}
                sparkData={[
                  { value: 10 },
                  { value: 14 },
                  { value: 18 },
                  { value: 16 },
                ]}
                colorConfig={COLORSTATS.blue}
              />

              <StatCard
                label="Rental Orders"
                value={20}
                icon={ClipboardList}
                trend={-5}
                sparkData={[
                  { value: 8 },
                  { value: 6 },
                  { value: 5 },
                  { value: 4 },
                ]}
                colorConfig={COLORSTATS.purple}
              />

              <StatCard
                label="Available Cars"
                value={30}
                icon={CarFront}
                trend={8}
                sparkData={[
                  { value: 12 },
                  { value: 15 },
                  { value: 18 },
                  { value: 20 },
                ]}
                colorConfig={COLORSTATS.green}
              />

              <StatCard
                label="Visits"
                value={1000}
                icon={Users}
                trend={25}
                sparkData={[
                  { value: 200 },
                  { value: 300 },
                  { value: 500 },
                  { value: 800 },
                ]}
                colorConfig={COLORSTATS.orange}
              />
              {/* <div className="flex justify-between p-4 bg-blue-50/40 rounded-lg">
                <div className="flex flex-col gap-2">
                  <p>Total Cars</p>
                  <span className="text-2xl font-semibold">50</span>
                </div>
                <Car className="w-6 h-6 text-blue-600/60" />
              </div>

              <div className="flex justify-between p-4 bg-blue-50/40 rounded-lg">
                <div className="flex flex-col gap-2">
                  <p>Total Rental Orders</p>
                  <span className="text-2xl font-semibold">20</span>
                </div>
                <ClipboardList className="w-6 h-6 text-blue-600/60" />
              </div>

              <div className="flex justify-between p-4 bg-blue-50/40 rounded-lg">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500">Total Available Cars</p>
                  <span className="text-2xl font-semibold">30</span>
                </div>
                <CarFront className="w-6 h-6 text-blue-600/60" />
              </div>

              <div className="flex justify-between p-4 bg-blue-50/40 rounded-lg">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500">Total Visited</p>
                  <span className="text-2xl font-semibold">1000+</span>
                </div>
                <Users className="w-6 h-6 text-blue-600/60" />
              </div> */}
            </div>

            <div className="visual-charts grid grid-cols-2 m-5 gap-6">
              <div className="p-4 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">
                  Daily Car Rental Rate (Monthly)
                </h2>
                {/* <h3 className="text-xl font-semibold text-gray-600">
                  Rental this month
                </h3> */}

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyRentalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rentals" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-4 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">
                  Top Car Models Rented
                </h2>
                {/* <h3 className="text-xl font-semibold text-gray-600">
                  Top car models Rented
                </h3> */}
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topCarsData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {topCarsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      {/* {topCarsData.map((_, index) => (
                        <Cell key={index} />
                      ))} */}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="Activity m-5 grid grid-cols-[4fr_2fr] gap-6 items-start ">
              <RecentOrdersTable />
              <RecentActivityFeed />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
