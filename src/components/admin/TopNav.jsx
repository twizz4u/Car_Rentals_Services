import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function TopNav({
  title = "Dashboard",
  subtitle = "Overview of activity and analytics",
  onMenuClick,
}) {
  const { user } = useAuth();
  const displayName =
    user?.name || user?.email?.split("@")[0] || "Administrator";
  const displayRole = user?.role
    ? String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)
    : "Admin";
  const initial = (displayName.trim().charAt(0) || "A").toUpperCase();

  return (
    <nav className="dashboard-Top-Nav w-full bg-white border border-stone-200 rounded-[2px] p-2 md:p-4 flex items-center justify-between gap-3 md:gap-4">
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
          <h2 className="font-['Playfair_Display',serif] font-normal text-lg md:text-2xl text-stone-900 truncate max-w-[120px] md:max-w-none">
            {title}
          </h2>
          <div className="hidden lg:block text-sm text-stone-500 whitespace-nowrap">
            {subtitle}
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 text-black rounded-[2px] flex items-center justify-center font-semibold">
              {initial}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-stone-900">
                {displayName}
              </div>
              <div className="text-xs text-stone-400">{displayRole}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
