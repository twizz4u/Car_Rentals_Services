import { TrendingUp, TrendingDown } from "lucide-react";

export default function Trend({ value }) {
  const positive = value >= 0;

  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium
      ${positive ? "text-green-600" : "text-red-600"}`}
    >
      {positive ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      )}
      {Math.abs(value)}%
    </div>
  );
}
