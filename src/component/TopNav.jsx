import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopNav({
  title = "Dashboard",
  subtitle = "Overview of activity and analytics",
  onMenuClick,
}) {
  return (
    <nav className="dashboard-Top-Nav w-full bg-white shadow-sm rounded-lg p-2 md:p-4 flex items-center justify-between gap-3 md:gap-4">
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <h2 className="font-bold text-lg md:text-2xl text-slate-800 truncate max-w-[120px] md:max-w-none">
            {title}
          </h2>
          <div className="hidden lg:block text-sm text-slate-500 whitespace-nowrap">
            {subtitle}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-lg">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
          <input
            type="search"
            aria-label="Search"
            placeholder="Search"
            className="w-full border border-slate-200 rounded-full pl-10 pr-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <div>
        <div className="flex gap-3 items-center">
          <button className="p-2 rounded-full bg-white border border-slate-100 shadow-sm hover:bg-slate-50 cursor-pointer">
            {/* placeholder for notifications icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
              P
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-slate-800">Peter</div>
              <div className="text-xs text-slate-400">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
