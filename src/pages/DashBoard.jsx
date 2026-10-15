import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/statCard";
import RecentOrdersTable from "@/components/dashboard/RecentOrders";
import RecentActivityFeed from "@/components/dashboard/RecentActivity";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
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

// Single-hue amber ramp for the fleet donut, so the segments read as one
// family instead of a rainbow. Data and shape handling below are unchanged.
const AMBER_RAMP = [
  "#b45309",
  "#d97706",
  "#f59e0b",
  "#fbbf24",
  "#fcd34d",
];

// Module-level cache: persists across SPA navigation, resets on browser
// refresh. Bound to the session token so it can never outlive the admin it
// belongs to — signing out, or a different admin signing into the same
// browser, starts from an empty cache instead of inheriting old figures.
let dashCache = {
  token: null,
  stats: null,
  rentals: null,
  popular: null,
  orders: null,
  visits: null,
};

const cacheFor = (tok) => {
  const current = dashCache;
  if (current.token === tok) return current;
  dashCache = {
    token: tok,
    stats: null,
    rentals: null,
    popular: null,
    orders: null,
    visits: null,
  };
  return dashCache;
};

export const DashBoard = () => {
  const { user, token } = useAuth();
  // Rebind the module cache to this session. Runs synchronously, before the
  // useState initialisers below, so a new admin never seeds state from the
  // previous admin's figures.
  const cache = cacheFor(token);
  const navigate = useNavigate();
  const hasShownDemoToast = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Set when an admin endpoint rejects the session token, so the UI can say
  // so instead of silently rendering zeros.
  const [authExpired, setAuthExpired] = useState(false);

  const [stats, setStats] = useState(
    cache.stats || { total_cars: 0, available_cars_count: 0, rental_orders_count: 0 }
  );
  const [dailyRentalData, setDailyRentalData] = useState(cache.rentals || []);
  const [topCarsData, setTopCarsData] = useState(cache.popular || []);
  const [recentOrders, setRecentOrders] = useState(cache.orders || []);
  const [visits, setVisits] = useState(cache.visits || 0);

  const [loadingStats, setLoadingStats] = useState(!cache.stats);
  const [loadingRentals, setLoadingRentals] = useState(!cache.rentals);
  const [loadingPopular, setLoadingPopular] = useState(!cache.popular);
  const [loadingOrders, setLoadingOrders] = useState(!cache.orders);

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
        !cache.stats
          ? fetch("http://127.0.0.1:8000/api/cars/stats", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, ...cache.stats }),

        // 2. Rentals
        !cache.rentals
          ? fetch("http://127.0.0.1:8000/api/rentPerDay", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, data: cache.rentals }),

        // 3. Popular Cars
        !cache.popular
          ? fetch("http://127.0.0.1:8000/api/popularCarsByModel", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, data: cache.popular }),

        // 4. Orders
        !cache.orders
          ? fetch("http://127.0.0.1:8000/api/rentalOrders/recent", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, _orders: cache.orders }), // Use _orders wrapper to distinguish cache

        // 5. Visits
        !cache.visits
          ? fetch("http://127.0.0.1:8000/api/pageVisit", { headers }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
          : Promise.resolve({ cached: true, visits: cache.visits })
      ];

      try {
        // Run all API calls concurrently
        const results = await Promise.allSettled(promises);

        // A 401 means the stored token is no longer accepted by the API.
        // Report it instead of leaving the dashboard silently empty.
        setAuthExpired(
          results.some(
            (r) =>
              r.status === "rejected" &&
              typeof r.reason?.status === "number" &&
              r.reason.status === 401,
          ),
        );

        // 1. Process Stats Update
        if (results[0].status === "fulfilled") {
          const data = results[0].value;
          if (data.cached || data.status === "success" || data.total_cars !== undefined) {
            setStats(data);
            if (!data.cached) cache.stats = data;
          }
        } else console.error("Stats fetch error:", results[0].reason);
        setLoadingStats(false);

        // 2. Process Rentals Update
        if (results[1].status === "fulfilled") {
          const data = results[1].value;
          if (data.data) {
            setDailyRentalData(data.data);
            if (!data.cached) cache.rentals = data.data;
          }
        } else console.error("Rentals fetch error:", results[1].reason);
        setLoadingRentals(false);

        // 3. Process Popular Cars Update
        if (results[2].status === "fulfilled") {
          const data = results[2].value;
          if (data.data) {
            setTopCarsData(data.data);
            if (!data.cached) cache.popular = data.data;
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
              cache.orders = data;
            } else if (data.data && Array.isArray(data.data)) {
              setRecentOrders(data.data);
              cache.orders = data.data;
            } else if (data.recent_orders && Array.isArray(data.recent_orders)) {
              setRecentOrders(data.recent_orders);
              cache.orders = data.recent_orders;
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
            if (!data.cached) cache.visits = count;
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
    <div className="p-4 rounded-[2px] border border-stone-200 bg-white animate-pulse h-[108px]">
      <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-stone-200 rounded w-1/4"></div>
        <div className="h-10 w-10 bg-stone-200 rounded-[2px]"></div>
      </div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="p-4 rounded-[2px] border border-stone-200 bg-white h-[350px] animate-pulse flex flex-col">
      <div className="h-6 bg-stone-200 rounded w-1/3 mb-6"></div>
      <div className="flex-1 bg-stone-100 rounded"></div>
    </div>
  );



  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-stone-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Dashboard"
          subtitle="Overview of activity and analytics"
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        {authExpired && (
          <div
            role="alert"
            className="mx-2 md:mx-0 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[2px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <span className="font-semibold">Session expired.</span>
            <span className="text-amber-800">
              Your admin session is no longer accepted by the API, so live data
              can't be loaded.
            </span>
            <Button
              size="sm"
              onClick={() => {
                setAuthExpired(false);
                navigate("/admin-login");
              }}
              className="ml-auto rounded-[2px] bg-amber-500 text-black hover:bg-amber-400"
            >
              Sign in again
            </Button>
          </div>
        )}
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
                />
                <StatCard
                  label="Rental Orders"
                  value={stats.rental_orders_count}
                  icon={ClipboardList}
                />
                <StatCard
                  label="Available Cars"
                  value={stats.available_cars_count}
                  icon={CarFront}
                />
                <StatCard
                  label="Visits"
                  value={visits}
                  icon={Users}
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
              <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-[2px] border border-stone-200 overflow-hidden">
                <div className="mb-6">
                  <h2 className="font-['Playfair_Display',serif] text-xl font-normal text-stone-900">Rental Revenue Trends</h2>
                  <p className="text-sm text-stone-500">Daily collections over the current period</p>
                </div>
                <div className="h-[250px] md:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyRentalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 10 }} dy={10} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a8a29e', fontSize: 10 }}
                        tickFormatter={(value) => `₦${value >= 1000 ? value / 1000 + 'k' : value}`}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '2px', border: '1px solid #e7e5e4', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                        formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="total_amount"
                        stroke="#d97706"
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
              <div className="bg-white p-4 md:p-6 rounded-[2px] border border-stone-200 flex flex-col">
                <div className="mb-2">
                  <h2 className="font-['Playfair_Display',serif] text-xl font-normal text-stone-900">Fleet Popularity</h2>
                  <p className="text-sm text-stone-500">Most rented models</p>
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
                          <Cell key={`cell-${index}`} fill={AMBER_RAMP[index % AMBER_RAMP.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Rentals`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                    <span className="text-[10px] text-stone-400 font-medium">Top</span>
                    <span className="font-['Playfair_Display',serif] text-base font-normal text-stone-800">Models</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                  {topCarsData.map((data, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs px-2 py-1 transition-colors">
                      <div className="flex items-center text-stone-600 truncate pr-3">
                        <span className="w-2 h-2 rounded-[1px] mr-2" style={{ backgroundColor: AMBER_RAMP[idx % AMBER_RAMP.length] }}></span>
                        <span className="truncate">{data.model}</span>
                      </div>
                      <span className="font-mono tabular-nums text-stone-900">{data.rent_count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-0">
            <div className="lg:col-span-2">
              {loadingOrders ? (
                <div className="p-4 rounded-[2px] border border-stone-200 bg-white animate-pulse h-[400px]">
                  <div className="h-6 bg-stone-200 rounded w-1/4 mb-4"></div>
                </div>
              ) : (
                <RecentOrdersTable data={recentOrders} />
              )}
            </div>
            <div className="bg-white p-4 rounded-[2px] border border-stone-200">
            <RecentActivityFeed orders={recentOrders} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

