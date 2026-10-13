import CountUp from "react-countup";
import Sparkline from "./Sparkline";
import Trend from "./Trend";

// export default function StatCard({ label, value, icon: Icon, color = "blue" }) {
//   const colors = {
//     blue: {
//       bg: "bg-blue-50 dark:bg-blue-900/30",
//       iconBg: "bg-blue-100 dark:bg-blue-800",
//       iconText: "text-blue-600 dark:text-blue-300",
//     },
//     green: {
//       bg: "bg-green-50 dark:bg-green-900/30",
//       iconBg: "bg-green-100 dark:bg-green-800",
//       iconText: "text-green-600 dark:text-green-300",
//     },
//     purple: {
//       bg: "bg-purple-50 dark:bg-purple-900/30",
//       iconBg: "bg-purple-100 dark:bg-purple-800",
//       iconText: "text-purple-600 dark:text-purple-300",
//     },
//     orange: {
//       bg: "bg-orange-50 dark:bg-orange-900/30",
//       iconBg: "bg-orange-100 dark:bg-orange-800",
//       iconText: "text-orange-600 dark:text-orange-300",
//     },
//   };

//   return (
//     <div
//       className={`flex justify-between items-center p-4 rounded-xl transition hover:shadow-md ${colors[color].bg}`}
//     >
//       <div className="flex flex-col gap-1">
//         <p className="text-sm text-muted-foreground">{label}</p>
//         <span className="text-2xl font-semibold">
//           <CountUp end={value} duration={1.2} />
//         </span>
//       </div>

//       {/* Icon with background circle */}
//       <div className={`p-3 rounded-full ${colors[color].iconBg}`}>
//         <Icon className={`w-6 h-6 ${colors[color].iconText}`} />
//       </div>
//     </div>
//   );
// }

export default function StatCard({
  label,
  value,
  icon: Icon,
  colorConfig,
  trend,
  sparkData,
}) {
  return (
    <div
      className={`p-4 rounded-xl transition hover:shadow-md ${colorConfig.bg}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-semibold">
              <CountUp end={value} duration={1.2} />
            </span>
            <Trend value={trend} />
          </div>
        </div>

        {/* Icon circle */}
        <div className={`p-3 rounded-full ${colorConfig.iconBg}`}>
          <Icon className={`w-6 h-6 ${colorConfig.iconText}`} />
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-4">
        <Sparkline data={sparkData} color={colorConfig.spark} />
      </div>
    </div>
  );
}
