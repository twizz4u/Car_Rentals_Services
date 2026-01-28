import {
  Car,
  CreditCard,
  XCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { recentActivity } from "../assets/data";
// import { motion } from "framer-motion";

const iconMap = {
  Car: Car,
  CreditCard: CreditCard,
  XCircle: XCircle,
  CheckCircle: CheckCircle,
};

export default function RecentActivityFeed() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {recentActivity.map((activity, index) => {
          const Icon = iconMap[activity.icon];
          return (
            <li
              key={index}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {activity.time}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
