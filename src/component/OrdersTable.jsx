import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Loader2,
} from "lucide-react";

export default function OrdersTable({ orders = [], loading = false }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });

  const columns = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500">#{getValue()}</span>
      ),
    },
    {
      accessorKey: "car_name",
      header: "Car Details",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900 text-sm">
            {row.original.car_name}
          </p>
          <p className="text-[10px] text-slate-500">
            {row.original.car_model}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {row.original.customer_name?.charAt(0) || "?"}
          </div>
          <span className="text-sm text-slate-700">
            {row.original.customer_name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 text-slate-500 hover:text-indigo-600"
          >
            Start Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {new Date(getValue()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 text-slate-500 hover:text-indigo-600"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="font-bold text-slate-800 text-sm">
          ₦{Number(getValue()).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const normalized = status?.toLowerCase();
        let colorClass = "";
        let Icon = Clock;

        switch (normalized) {
          case "completed":
          case "approved":
            colorClass = "bg-green-50 text-green-700 border-green-200";
            Icon = CheckCircle;
            break;
          case "ongoing":
            colorClass = "bg-blue-50 text-blue-700 border-blue-200";
            Icon = PlayCircle;
            break;
          case "cancelled":
          case "rejected":
            colorClass = "bg-red-50 text-red-700 border-red-200";
            Icon = XCircle;
            break;
          case "pending":
            colorClass = "bg-amber-50 text-amber-700 border-amber-200";
            Icon = Clock;
            break;
          default:
            colorClass = "bg-slate-50 text-slate-700 border-slate-200";
        }

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
          >
            <Icon className="w-3 h-3 mr-1.5" />
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Download Invoice</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search orders..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50/50 transition-all rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-100 overflow-x-auto">
            <table className="min-w-[900px] w-full table-auto divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm text-slate-700"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="h-24 text-center text-slate-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-900">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {table.getPageCount()}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="hover:bg-indigo-50 hover:text-indigo-600"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="hover:bg-indigo-50 hover:text-indigo-600"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
