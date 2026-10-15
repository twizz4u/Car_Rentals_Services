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
  Mail,
  Phone,
  ShoppingBag,
} from "lucide-react";

export default function CustomersTable({ data = [] }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = [
    {
      accessorKey: "customer_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 text-stone-500 hover:text-amber-700"
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const name = row.original.customer_name || "Unknown";

        return (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[2px] bg-amber-500 flex items-center justify-center text-black font-bold text-sm"
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-stone-900">
                {name}
              </span>
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
          <div className="flex items-center gap-2 text-stone-600 text-xs font-medium">
            <Mail className="w-3.5 h-3.5 text-stone-400" />{" "}
            {row.original.email}
          </div>
          <div className="flex items-center gap-2 text-stone-600 text-xs">
            <Phone className="w-3.5 h-3.5 text-stone-400" />{" "}
            {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "total_spent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4 text-stone-500 hover:text-amber-700"
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
              <span className="font-mono tabular-nums text-stone-900">
                ₦{Number(getValue() || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "rentals_count",
      header: "Rentals",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-[2px] w-fit border border-stone-200">
          <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
          {getValue()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 rounded-[2px] hover:bg-stone-100 text-stone-500 hover:text-stone-900"
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

  return (
    <div className="bg-white p-5 rounded-[2px] border border-stone-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="relative w-full max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-stone-400 group-focus-within:text-amber-700 transition-colors" />
          </div>
          <Input
            placeholder="Search customers..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10 bg-transparent border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all rounded-[2px]"
          />
        </div>
      </div>

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
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors group"
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
                  No customers found.
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
            className="hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 rounded-[2px] border-stone-200"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="hover:bg-stone-50 hover:text-stone-900 hover:border-stone-300 rounded-[2px] border-stone-200"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
