import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { carsDashData } from "../assets/data";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import CarFormModal from "@/component/CarFormModel";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const ManageCar = () => {
  const [cars, setCars] = useState(carsDashData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [lastDeleted, setLastDeleted] = useState([]);

  console.log(globalFilter);

  function saveCar(car) {
    if (editingCar) {
      setCars((prev) =>
        prev.map((c) => (c.id === editingCar.id ? { ...c, ...car } : c)),
      );
      toast("Car updated successfully");
    } else {
      setCars((prev) => [
        ...prev,
        { ...car, id: Date.now(), published: false },
      ]);
      toast("Car added successfully");
    }
  }

  function deleteSelected() {
    console.log("Deleting selected cars:", rowSelection);
    const ids = Object.keys(rowSelection);

    const removed = cars.filter((car) => ids.includes(String(car.id)));

    setLastDeleted(removed);

    console.log(removed);

    setCars((prev) => prev.filter((c) => !rowSelection[c.id]));
    setRowSelection({});

    toast(`${removed.length} car(s) deleted`, {
      description: "You can undo this action",
      action: (
        <Button variant="outline" size="sm" onClick={() => undoDelete(removed)}>
          Undo
        </Button>
      ),
    });

    console.log("cars after delete:", cars);
  }

  function undoDelete(itemsrestored) {
    setCars((prev) => {
      const combined = [...prev, ...itemsrestored];
      return combined.sort((a, b) => a.id - b.id);
    });
    setLastDeleted([]);
    setRowSelection({});
    table.setPageIndex(0);
    console.log("cars after undo:", cars);

    toast("Cars restored successfully");
  }

  function bulkPublish(value) {
    setCars((prev) =>
      prev.map((c) => (rowSelection[c.id] ? { ...c, published: value } : c)),
    );
    toast(value ? "Published" : "Moved to draft");
    setRowSelection({});
  }

  function deleteCar(id) {
    console.log("Deleting car with id:", id);
    setCars((prev) => prev.filter((c) => c.id !== id));
  }

  function editCar(car) {
    setEditingCar(car);
    setModalOpen(true);
  }

  function publishCar(id) {
    setCars((prev) =>
      prev.map((c) => {
        console.log(c.id, c.published, id);
        return c.id === id ? { ...c, published: !c.published } : c;
      }),
    );
  }

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
      ),
    },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 flex items-center gap-2 hover:bg-gray-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Car
          {column.getIsSorted() === "asc" && (
            <ArrowUp className="w-4 h-4 text-indigo-600" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDown className="w-4 h-4 text-indigo-600" />
          )}
          {!column.getIsSorted() && (
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      ),
      accessorKey: "name",
    },

    { header: "Plate", accessorKey: "plate" },
    {
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 flex items-center gap-2 hover:bg-gray-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price / Day
          {column.getIsSorted() === "asc" && (
            <ArrowUp className="w-4 h-4 text-indigo-600" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDown className="w-4 h-4 text-indigo-600" />
          )}
          {!column.getIsSorted() && (
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      ),
      accessorKey: "pricePerDay",
      cell: ({ getValue }) => `₦${getValue()}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: "Publish",
      accessorKey: "published",
      cell: ({ row }) => (
        <Badge variant={row.original.published ? "default" : "secondary"}>
          {row.original.published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <CarActions
          car={row.original}
          deleteCar={deleteCar}
          editCar={editCar}
          publishCar={publishCar}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: cars,
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    getRowId: (row) => String(row.id),
    state: {
      rowSelection,
      globalFilter,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    autoResetPageIndex: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="dashboard-container flex">
      <Sidebar />
      <div className="container flex-1 bg-gray-50 min-h-screen p-6">
        <TopNav
          title="Dashboard"
          subtitle="Overview of activity and analytics"
        />
        <section>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Manage Cars</h1>
              <Button>Add Car</Button>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
              <Input
                placeholder="Search cars..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
              <BulkActions
                selected={rowSelection}
                onDelete={deleteSelected}
                onPublish={bulkPublish}
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-sm font-medium"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-t hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <CarFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={saveCar}
            car={editingCar}
          />
        </section>
      </div>
    </div>
  );
};

function StatusBadge({ status }) {
  const map = {
    available: "bg-green-100 text-green-700",
    rented: "bg-blue-100 text-blue-700",
    maintenance: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs ${map[status]}`}>
      {status}
    </span>
  );
}

function CarActions({ car, deleteCar, editCar, publishCar }) {
  // console.log(deleteCar(car.id));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="w-4 h-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2" onClick={() => editCar(car)}>
          <Edit className="w-4 h-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 " onClick={() => publishCar(car.id)}>
          <Eye className="w-4 h-4" />
          {car.published ? "Unpublish" : "Publish"}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="gap-2 text-red-600 hover:bg-red-50"
          onClick={() => deleteCar(car.id)}
        >
          <Trash className="w-4 h-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BulkActions({ selected, onDelete, onPublish }) {
  if (!Object.keys(selected).length) return null;

  return (
    <div className="flex  items-center gap-3 bg-muted p-3 rounded-md">
      <span className="text-sm font-medium">
        {Object.keys(selected).length} Selected
      </span>

      <Button size="sm" onClick={() => onPublish(true)}>
        Publish
      </Button>

      <Button
        size="sm"
        className={"bg-cyan-400 hover:bg-cyan-500"}
        onClick={() => onPublish(false)}
      >
        Draft
      </Button>

      <Button size="sm" variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}
