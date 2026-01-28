import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { customersList } from "../assets/data";
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
  Mail,
  Phone,
  ShoppingBag,
} from "lucide-react";

export default function CustomersTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Parse currency string to number
  const parseAmount = (amountStr) => {
    if (!amountStr) return 0;
    return parseInt(amountStr.replace(/[^0-9]/g, ""));
  };

  const maxSpent = Math.max(
    ...customersList.map((c) => parseAmount(c.totalSpent)),
  );

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 text-slate-500 hover:text-indigo-600"
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        // Generate a deterministic color based on the name length/char code roughly
        const colors = [
          "from-pink-500 to-rose-500 shadow-pink-200",
          "from-indigo-500 to-blue-500 shadow-indigo-200",
          "from-purple-500 to-violet-500 shadow-purple-200",
          "from-emerald-500 to-teal-500 shadow-emerald-200",
          "from-orange-500 to-amber-500 shadow-orange-200",
        ];
        const colorClass = colors[row.original.name.length % colors.length];

        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm shadow-md`}
            >
              {row.original.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900">
                {row.original.name}
              </span>
              <span className="text-xs text-slate-500">{row.original.id}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />{" "}
            {row.original.email}
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />{" "}
            {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 text-slate-500 hover:text-indigo-600"
          >
            Total Spent
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className="space-y-2 w-[140px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">{getValue()}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "rentalsCount",
      header: "Rentals",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 font-medium text-slate-700 bg-indigo-50 px-2.5 py-1 rounded-md w-fit border border-indigo-100">
          <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
          {getValue()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const styles =
          status === "Active"
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : status === "Inactive"
              ? "bg-slate-100 text-slate-600 border-slate-200"
              : "bg-blue-100 text-blue-700 border-blue-200";

        const dotColor =
          status === "Active"
            ? "bg-emerald-500"
            : status === "Inactive"
              ? "bg-slate-400"
              : "bg-blue-500";

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
            {status}
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
                className="h-8 w-8 p-0 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.email)
                }
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Edit Properties</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customersList,
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
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <Input
            placeholder="Search customers..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 transition-all rounded-xl"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 overflow-hidden">
        <table className="min-w-full table-auto divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
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
                  className="hover:bg-indigo-50/30 transition-colors group"
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
                  No customers found.
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
            className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
