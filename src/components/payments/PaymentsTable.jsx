import { useState, useMemo } from "react";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  ArrowUpDown,
  Filter,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentsTable({ data = [], isLoading = false }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Custom filter function for date range
  const isWithinDateRange = (row, columnId, value) => {
    const date = new Date(row.getValue(columnId));
    const start = value.start ? new Date(value.start) : null;
    const end = value.end ? new Date(value.end) : null;

    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  };

  // The API now returns clean keys, so we pass data directly to useReactTable.

  const columns = useMemo(() => [
    {
      header: "Transaction ID",
      accessorKey: "id",
      cell: ({ getValue }) => {
        const id = getValue();
        return (
          <span className="font-mono text-xs" title={id}>
            {id.length > 12 ? `${id.slice(0, 12)}...` : id}
          </span>
        );
      },
    },
    {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorKey: "customer",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ getValue }) => {
        const val = parseFloat(getValue() || 0);
        return `₦${val.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    },
    {
      header: "Date",
      accessorKey: "date",
      filterFn: isWithinDateRange,
    },
    {
      header: "Method",
      accessorKey: "method",
      cell: ({ getValue }) => {
        const method = getValue();
        return (
          <span className="capitalize">{method}</span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const rawStatus = getValue() || "";
        const lower = rawStatus.toLowerCase();
        const displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

        const mapping =
          lower === "success" || lower === "completed"
            ? { bg: "bg-green-100", text: "text-green-800" }
            : lower === "pending"
              ? { bg: "bg-yellow-100", text: "text-yellow-800" }
              : { bg: "bg-red-100", text: "text-red-800" };

        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${mapping.bg} ${mapping.text}`}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`/payments/${payment.id}`}>
                <DropdownMenuItem>View Details</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data,
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

  const handleDateChange = (type, value) => {
    const newRange = { ...dateRange, [type]: value };
    setDateRange(newRange);
    table.getColumn("date")?.setFilterValue(newRange);
  };

  const getStatusFilter = () => {
    const filter = table.getColumn("status")?.getFilterValue();
    return filter || "All";
  };

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Transaction History
          </h2>
          <p className="text-sm text-slate-400">Recent incoming payments</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
        <div className="flex-1">
          <Input
            placeholder="Search customers..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm bg-white"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                Status:{" "}
                <span className="font-semibold text-slate-700">
                  {getStatusFilter()}
                </span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={getStatusFilter()}
                onValueChange={(val) => {
                  table
                    .getColumn("status")
                    ?.setFilterValue(val === "All" ? "" : val);
                }}
              >
                <DropdownMenuRadioItem value="All">
                  All Statuses
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Success">
                  Success
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Pending">
                  Pending
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Failed">
                  Failed
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2 bg-white px-2 rounded-md border text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              className="outline-none py-2 bg-transparent w-[110px] text-slate-600 placeholder:text-slate-400"
              placeholder="Start Date"
              value={dateRange.start}
              onChange={(e) => handleDateChange("start", e.target.value)}
            />
            <span className="text-slate-300">—</span>
            <input
              type="date"
              className="outline-none py-2 bg-transparent w-[110px] text-slate-600"
              placeholder="End Date"
              value={dateRange.end}
              onChange={(e) => handleDateChange("end", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full table-auto divide-y">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
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
          <tbody className="bg-white divide-y">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="h-4 bg-slate-200 rounded-md animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, idx) => (
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
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-slate-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
