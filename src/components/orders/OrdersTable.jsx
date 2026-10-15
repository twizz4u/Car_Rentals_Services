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
import { statusDot } from "../shared/status";
import {
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
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
        <span className="font-mono text-xs text-stone-500">#{getValue()}</span>
      ),
    },
    {
      accessorKey: "car_name",
      header: "Car Details",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-stone-900 text-sm">
            {row.original.car_name}
          </p>
          <p className="text-[10px] text-stone-500">
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
          <div className="w-7 h-7 rounded-[2px] bg-amber-500 flex items-center justify-center text-black text-xs font-bold">
            {row.original.customer_name?.charAt(0) || "?"}
          </div>
          <span className="text-sm text-stone-700">
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
            className="-ml-4 text-stone-500 hover:text-amber-700"
          >
            Start Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1.5 text-xs text-stone-600">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
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
          className="-ml-4 text-stone-500 hover:text-amber-700"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="font-mono tabular-nums text-stone-900 text-sm">
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
        let Icon = Clock;

        switch (normalized) {
          case "completed":
          case "approved":
            Icon = CheckCircle;
            break;
          case "ongoing":
            Icon = PlayCircle;
            break;
          case "cancelled":
          case "rejected":
            Icon = XCircle;
            break;
          default:
            Icon = Clock;
        }

        return (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-stone-700">
            <span className={`h-1.5 w-1.5 rounded-[1px] ${statusDot(status)}`} />
            <Icon className="w-3 h-3 text-stone-400" />
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 rounded-[2px] hover:bg-stone-100"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-stone-400" />
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
    <div className="bg-white p-5 rounded-[2px] border border-stone-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search orders..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-9 bg-transparent border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all rounded-[2px]"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex rounded-[2px] border-stone-200">
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 py-2 animate-pulse" aria-label="Loading orders">
          <div className="h-10 rounded-[2px] bg-stone-100" />
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-14 rounded-[2px] bg-stone-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-[2px] border border-stone-200 overflow-x-auto">
            <table className="min-w-[900px] w-full table-auto">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-stone-200">
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-[11px] font-medium text-stone-500 uppercase tracking-[0.16em]"
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
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm text-stone-700"
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
                      className="h-24 text-center text-stone-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-stone-500">
              Page{" "}
              <span className="font-mono tabular-nums text-stone-900">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of{" "}
              <span className="font-mono tabular-nums text-stone-900">
                {table.getPageCount()}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-[2px] border-stone-200 hover:bg-stone-50 hover:text-stone-900"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-[2px] border-stone-200 hover:bg-stone-50 hover:text-stone-900"
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
