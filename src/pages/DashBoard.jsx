import { useEffect, useRef, useState } from "react";
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
  COLORS,
  COLORSTATS,
} from "../assets/data";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Module-level cache: persists across SPA navigation, resets on browser refresh
let dashCache = {
  stats: null,
  rentals: null,
  popular: null,
  orders: null,
  visits: null,
};

export const DashBoard = () => {
  const { user, token } = useAuth();
  const hasShownDemoToast = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [stats, setStats] = useState(
    dashCache.stats || { total_cars: 0, available_cars_count: 0, rental_orders_count: 0 }
  );
  const [dailyRentalData, setDailyRentalData] = useState(dashCache.rentals || []);
  const [topCarsData, setTopCarsData] = useState(dashCache.popular || []);
  const [recentOrders, setRecentOrders] = useState(dashCache.orders || []);
  const [visits, setVisits] = useState(dashCache.visits || 0);

  const [loadingStats, setLoadingStats] = useState(!dashCache.stats);
  const [loadingRentals, setLoadingRentals] = useState(!dashCache.rentals);
  const [loadingPopular, setLoadingPopular] = useState(!dashCache.popular);
  const [loadingOrders, setLoadingOrders] = useState(!dashCache.orders);

  useEffect(() => {
    if (user?.isDemo && !hasShownDemoToast.current) {
      hasShownDemoToast.current = true;
      toast.warning("Demo Mode Active", {
        description: "You're logged in with demo credentials. Some features may be limited.",
        duration: 6000,
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // Create an array of fetch promises for the ones that need it
      const promises = [
        // 1. Stats
        !dashCache.stats
          ? fetch("http://127.0.0.1:8000/api/carStats", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, ...dashCache.stats }),

        // 2. Rentals
        !dashCache.rentals
          ? fetch("http://127.0.0.1:8000/api/rentPerDay", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, data: dashCache.rentals }),

        // 3. Popular Cars
        !dashCache.popular
          ? fetch("http://127.0.0.1:8000/api/popularCarsByModel", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, data: dashCache.popular }),

        // 4. Orders
        !dashCache.orders
          ? fetch("http://127.0.0.1:8000/api/recentRentalOrders", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, _orders: dashCache.orders }), // Use _orders wrapper to distinguish cache

        // 5. Visits
        !dashCache.visits
          ? fetch("http://127.0.0.1:8000/api/pageVisit", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, visits: dashCache.visits })
      ];

      try {
        // Run all API calls concurrently
        const results = await Promise.allSettled(promises);

        // 1. Process Stats Update
        if (results[0].status === "fulfilled") {
          const data = results[0].value;
          if (data.cached || data.status === "success" || data.total_cars !== undefined) {
            setStats(data);
            if (!data.cached) dashCache.stats = data;
          }
        } else console.error("Stats fetch error:", results[0].reason);
        setLoadingStats(false);

        // 2. Process Rentals Update
        if (results[1].status === "fulfilled") {
          const data = results[1].value;
          if (data.data) {
            setDailyRentalData(data.data);
            if (!data.cached) dashCache.rentals = data.data;
          }
        } else console.error("Rentals fetch error:", results[1].reason);
        setLoadingRentals(false);

        // 3. Process Popular Cars Update
        if (results[2].status === "fulfilled") {
          const data = results[2].value;
          if (data.data) {
            setTopCarsData(data.data);
            if (!data.cached) dashCache.popular = data.data;
          }
        } else console.error("Popular cars fetch error:", results[2].reason);
        setLoadingPopular(false);

        // 4. Process Orders Update
        if (results[3].status === "fulfilled") {
          const data = results[3].value;
          if (data.cached) {
            setRecentOrders(data._orders);
          } else {
            if (Array.isArray(data)) {
              setRecentOrders(data);
              dashCache.orders = data;
            } else if (data.data && Array.isArray(data.data)) {
              setRecentOrders(data.data);
              dashCache.orders = data.data;
            } else if (data.recent_orders && Array.isArray(data.recent_orders)) {
              setRecentOrders(data.recent_orders);
              dashCache.orders = data.recent_orders;
            }
          }
        } else console.error("Orders fetch error:", results[3].reason);
        setLoadingOrders(false);

        // 5. Process Visits Update
        if (results[4].status === "fulfilled") {
          const data = results[4].value;
          const count = data.visits ?? data.count ?? data.total ?? data.data ?? data;
          if (typeof count === "number") {
            setVisits(count);
            if (!data.cached) dashCache.visits = count;
          }
        } else console.error("Visits fetch error:", results[4].reason);

      } catch (error) {
        // Fallback catch block for entire network pipeline failure
        console.error("Critical failure during Dashboard initialization:", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Loading Skeleton Component
  const SkeletonCard = () => (
    <div className="p-4 rounded-xl border bg-white shadow-sm animate-pulse h-[140px]">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="mt-4 h-10 bg-gray-100 rounded"></div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="p-4 rounded-lg border bg-white h-[350px] animate-pulse flex flex-col">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="flex-1 bg-gray-100 rounded"></div>
    </div>
  );



  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Dashboard"
          subtitle="Overview of activity and analytics"
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-0">
            {loadingStats ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <StatCard
                  label="Total Cars"
                  value={stats.total_cars}
                  icon={Car}
                  trend={12}
                  sparkData={[{ value: 10 }, { value: 14 }, { value: 18 }, { value: 16 }]}
                  colorConfig={COLORSTATS.blue}
                />
                <StatCard
                  label="Rental Orders"
                  value={stats.rental_orders_count}
                  icon={ClipboardList}
                  trend={-5}
                  sparkData={[{ value: 8 }, { value: 6 }, { value: 5 }, { value: 4 }]}
                  colorConfig={COLORSTATS.purple}
                />
                <StatCard
                  label="Available Cars"
                  value={stats.available_cars_count}
                  icon={CarFront}
                  trend={8}
                  sparkData={[{ value: 12 }, { value: 15 }, { value: 18 }, { value: 20 }]}
                  colorConfig={COLORSTATS.green}
                />
                <StatCard
                  label="Visits"
                  value={visits}
                  icon={Users}
                  trend={25}
                  sparkData={[{ value: 200 }, { value: 300 }, { value: 500 }, { value: 800 }]}
                  colorConfig={COLORSTATS.orange}
                />
              </>
            )}
          </div>

          <div className="visual-charts grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-0">
            {/* Main Area Chart spanning 2 columns */}
            {loadingRentals ? (
              <div className="lg:col-span-2">
                <SkeletonChart />
              </div>
            ) : (
              <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800">Rental Revenue Trends</h2>
                  <p className="text-sm text-slate-500">Daily collections over the current period</p>
                </div>
                <div className="h-[250px] md:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyRentalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        tickFormatter={(value) => `₦${value >= 1000 ? value / 1000 + 'k' : value}`}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="total_amount"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Donut Chart taking 1 column */}
            {loadingPopular ? (
              <SkeletonChart />
            ) : (
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-slate-800">Fleet Popularity</h2>
                  <p className="text-sm text-slate-500">Most rented models</p>
                </div>
                <div className="flex-1 min-h-[220px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topCarsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="rent_count"
                        nameKey="model"
                        stroke="none"
                        animationDuration={1000}
                      >
                        {topCarsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Rentals`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Top</span>
                    <span className="text-sm font-bold text-slate-700">Models</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                  {topCarsData.map((data, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs px-2 py-1 transition-colors">
                      <div className="flex items-center text-slate-600 truncate pr-3">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        <span className="truncate">{data.model}</span>
                      </div>
                      <span className="font-bold text-slate-800">{data.rent_count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-0">
            <div className="lg:col-span-2">
              {loadingOrders ? (
                <div className="p-4 rounded-2xl border bg-white shadow-sm animate-pulse h-[400px]">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                </div>
              ) : (
                <RecentOrdersTable data={recentOrders} />
              )}
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <RecentActivityFeed />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

