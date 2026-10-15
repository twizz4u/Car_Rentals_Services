import {
  Car,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";
import { statusDot } from "../shared/status";

const iconFor = (status = "") => {
  const s = String(status).toLowerCase();
  if (["completed", "approved", "success"].includes(s)) return CheckCircle;
  if (["cancelled", "rejected", "failed"].includes(s)) return XCircle;
  if (s === "pending") return Clock;
  if (s === "ongoing") return PlayCircle;
  return Car;
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Live feed derived from the same recent-orders data the table shows —
// every entry traces back to a real record, nothing is invented here.
export default function RecentActivityFeed({ orders = [] }) {
  const items = orders.slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-[2px] border border-stone-200">
      <h2 className="font-['Playfair_Display',serif] text-xl font-normal text-stone-900 mb-4">Recent Activity</h2>
      {items.length === 0 ? (
        <p className="text-sm text-stone-400 py-6 text-center">
          No recent activity.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((order) => {
            const Icon = iconFor(order.status);
            return (
              <li
                key={order.id}
                className="flex items-center gap-3 p-2 rounded-[2px] hover:bg-stone-50 transition"
              >
                <div className="p-2 bg-amber-50 rounded-[2px]">
                  <Icon className="w-5 h-5 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-stone-700 truncate">
                    <span className="font-medium">{order.customer_name}</span>{" "}
                    — {order.car_name}
                  </p>
                  <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-stone-400">
                    <span className={`h-1.5 w-1.5 rounded-[1px] ${statusDot(order.status)}`} />
                    <span className="capitalize">{order.status}</span>
                    {order.start_date ? (
                      <span>· {formatDate(order.start_date)}</span>
                    ) : null}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
