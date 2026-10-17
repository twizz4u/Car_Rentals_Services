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
import {
  useGetCarStatsQuery,
  useGetRentPerDayQuery,
  useGetPopularCarsQuery,
  useGetRecentOrdersQuery,
  useGetPageVisitsQuery,
} from "../store/adminApi";

// Single-hue amber ramp for the fleet donut, so the segments read as one
// family instead of a rainbow. Data and shape handling below are unchanged.
const AMBER_RAMP = [
  "#b45309",
  "#d97706",
  "#f59e0b",
  "#fbbf24",
  "#fcd34d",
];

export const DashBoard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const hasShownDemoToast = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Dismissal flag for the session-expired banner. The banner itself is
  // derived from the query errors below, so it can never disagree with the
  // real API state the way a hand-set boolean could.
  const [authExpiredDismissed, setAuthExpiredDismissed] = useState(false);

  // Every dashboard figure comes from the shared RTK Query cache. `skip`
  // reproduces the old `if (!token) return`, so nothing fires before login.
  const statsQuery = useGetCarStatsQuery(undefined, { skip: !token });
  const rentalsQuery = useGetRentPerDayQuery(undefined, { skip: !token });
  const popularQuery = useGetPopularCarsQuery(undefined, { skip: !token });
  const ordersQuery = useGetRecentOrdersQuery(undefined, { skip: !token });
  const visitsQuery = useGetPageVisitsQuery(undefined, { skip: !token });

  const stats = statsQuery.data || {
    total_cars: 0,
    available_cars_count: 0,
    rental_orders_count: 0,
  };
  const dailyRentalData = rentalsQuery.data || [];
  const topCarsData = popularQuery.data || [];
  const recentOrders = ordersQuery.data || [];
  const visits = visitsQuery.data ?? 0;

  const loadingStats = statsQuery.isLoading;
  const loadingRentals = rentalsQuery.isLoading;
  const loadingPopular = popularQuery.isLoading;
  const loadingOrders = ordersQuery.isLoading;

  // A 401 from any admin endpoint means the stored token is no longer
  // accepted by the API. Report it instead of rendering silent zeros.
  const authExpired =
    !authExpiredDismissed &&
    [statsQuery, rentalsQuery, popularQuery, ordersQuery, visitsQuery].some(
      (query) => query.error?.status === 401,
    );

  useEffect(() => {
    if (user?.isDemo && !hasShownDemoToast.current) {
      hasShownDemoToast.current = true;
      toast.warning("Demo Mode Active", {
        description: "You're logged in with demo credentials. Some features may be limited.",
        duration: 6000,
      });
    }
  }, [user]);

  // Preserve the per-endpoint diagnostics the previous fetcher logged, so a
  // failing admin endpoint is still visible in the console.
  useEffect(() => {
    [
      ["Stats", statsQuery.error],
      ["Rentals", rentalsQuery.error],
      ["Popular cars", popularQuery.error],
      ["Orders", ordersQuery.error],
      ["Visits", visitsQuery.error],
    ].forEach(([label, error]) => {
      if (error) console.error(`${label} fetch error:`, error);
    });
  }, [
    statsQuery.error,
    rentalsQuery.error,
    popularQuery.error,
    ordersQuery.error,
    visitsQuery.error,
  ]);

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
                setAuthExpiredDismissed(true);
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

