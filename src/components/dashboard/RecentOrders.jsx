// ✅ CORRECT: useReactTable is the v8 export
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { statusDot } from "../shared/status";
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
      cell: ({ getValue }) => (
        <span className="font-mono tabular-nums">{`₦${parseFloat(getValue()).toLocaleString()}`}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();

        return (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-stone-700">
            <span className={`h-1.5 w-1.5 rounded-[1px] ${statusDot(status)}`} />
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
    <div className="bg-white p-4 rounded-[2px] border border-stone-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-['Playfair_Display',serif] text-xl font-normal text-stone-900">
            Recent Rental Orders
          </h2>
          <p className="text-sm text-stone-500">Latest bookings and statuses</p>
        </div>
        <div>
          <Link to="/orders">
            <button className="text-sm bg-amber-500 text-black px-3 py-1 rounded-[2px] hover:bg-amber-400">
              View all
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] table-auto">
          <thead>
            <tr className="border-b border-stone-200">
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-[11px] font-medium text-stone-500 uppercase tracking-[0.16em]"
                >
                  {header.column.columnDef.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-stone-700"
                    >
                      {cell.column.id === "start_date"
                        ? new Date(cell.getValue()).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-stone-400"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
