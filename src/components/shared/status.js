// Single shared mapping from record status to indicator dot class.
// Every admin table and feed uses this so "pending" (or "completed", or
// "cancelled") never wears two different colors on two different pages.
export const statusDot = (status = "") => {
  const s = String(status).toLowerCase();
  if (
    ["completed", "approved", "success", "available", "published"].includes(s)
  ) {
    return "bg-emerald-600";
  }
  if (["pending", "maintenance"].includes(s)) {
    return "bg-amber-500";
  }
  if (["cancelled", "rejected", "failed"].includes(s)) {
    return "bg-red-600";
  }
  if (["ongoing", "rented", "all rented"].includes(s)) {
    return "bg-stone-900";
  }
  return "bg-stone-300";
};
