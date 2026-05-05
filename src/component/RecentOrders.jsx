// ✅ CORRECT: useReactTable is the v8 export
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

export default function RecentOrdersTable({ data = [] }) {
  const columns = [
    { header: "Order ID", accessorKey: "id" },
    {
      header: "Customer",
      accessorKey: "customer_name",
      cell: ({ getValue }) => getValue()?.split(" ")[0] || "",
    },
    { header: "Car", accessorKey: "car_name" },
    { header: "Model", accessorKey: "car_model" },
    { header: "Date", accessorKey: "start_date" },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => `₦${parseFloat(getValue()).toLocaleString()}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const lower = status?.toLowerCase();
        const mapping =
          lower === "completed"
            ? { bg: "bg-green-100", text: "text-green-800" }
            : lower === "pending"
              ? { bg: "bg-yellow-100", text: "text-yellow-800" }
              : { bg: "bg-red-100", text: "text-red-800" };

        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${mapping.bg} ${mapping.text}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // const table = useTable({
  //   data: recentOrders,
  //   columns,
  // });

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Rental Orders
          </h2>
          <p className="text-sm text-slate-400">Latest bookings and statuses</p>
        </div>
        <div>
          <Link to="/orders">
            <button className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md shadow-sm hover:bg-indigo-100">
              View all
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] table-auto divide-y">
          <thead className="bg-slate-50">
            <tr>
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {header.column.columnDef.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`hover:bg-slate-50 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-slate-700"
                  >
                    {cell.column.id === "start_date"
                      ? new Date(cell.getValue()).toLocaleDateString()
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
