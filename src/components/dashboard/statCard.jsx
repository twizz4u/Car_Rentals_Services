import CountUp from "react-countup";

export default function StatCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div
      className="p-4 rounded-[2px] bg-white border border-stone-200"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">{label}</p>

          <div className="mt-1">
            <span className="font-['Playfair_Display',serif] text-[1.75rem] font-normal text-stone-900 tabular-nums">
              <CountUp end={value} duration={1.2} />
            </span>
          </div>
        </div>

        {/* Icon tile */}
        <div className="p-3 rounded-[2px] bg-amber-50">
          <Icon className="w-6 h-6 text-amber-700" />
        </div>
      </div>
    </div>
  );
}
