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
  Loader2,
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
import { useState, useEffect } from "react";
import { carsDashData } from "../assets/data";
import Sidebar from "@/component/Sidebar";
import TopNav from "@/component/TopNav";
import CarFormModal from "@/component/CarFormModel";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export const ManageCar = () => {
  const { token } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [lastDeleted, setLastDeleted] = useState([]);
  const [sorting, setSorting] = useState([]);

  function fetchCars() {
    if (!token) {
      setCars(carsDashData);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("http://127.0.0.1:8000/api/carsAdmin", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          const mapped = data.data.map((car, index) => ({
            id: car.id ?? index + 1,
            name: car.name,
            model: car.model,
            pricePerDay: Number(car.loan_price),
            status: car.status,
            published: car.publish_key === "published",
            image: car.car_image_url || car.car_image || car.image || null,
            created_at_ts: car.created_at_ts || 0,
            color: car.color || "",
            duration: car.duration || "",
            description: car.description || "",
          }));
          setCars(mapped);
        } else {
          console.warn("API Error or unexpected format, using fallback data");
          setCars(carsDashData);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch cars, using fallback data:", err);
        toast.error("Failed to load cars from server, using static data");
        setCars(carsDashData);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCars();
  }, [token]);

  function saveCar() {
    // Refetch fresh data from backend to ensure images and all fields are in sync
    fetchCars();
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

  async function publishCar(id) {
    const carToToggle = cars.find((c) => c.id === id);
    if (!carToToggle) return;

    const previousPublishedState = carToToggle.published;

    // Optimistically update the UI to feel responsive
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: !c.published } : c))
    );

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/toggleCarPublish/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle publish status");
      }

      const data = await response.json();
      toast.success(data.message || (previousPublishedState ? "Car moved to draft" : "Car published successfully"));

    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update status. Reverting change.");

      // Revert the optimistic update on failure
      setCars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, published: previousPublishedState } : c))
      );
    }
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
      header: ({ table }) => {
        const sorting = table.getState().sorting[0];
        const isSorted = sorting?.id === "name" || sorting?.id === "created_at_ts";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 flex items-center gap-2 hover:bg-gray-100"
              >
                Car
                {isSorted ? (
                  sorting?.desc ? <ArrowDown className="w-4 h-4 text-indigo-600" /> : <ArrowUp className="w-4 h-4 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => table.setSorting([{ id: "name", desc: false }])}>
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.setSorting([{ id: "name", desc: true }])}>
                Alphabetical (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.setSorting([{ id: "created_at_ts", desc: true }])}>
                Time Added (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => table.setSorting([{ id: "created_at_ts", desc: false }])}>
                Time Added (Oldest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      accessorKey: "name",
      id: "name",
    },
    {
      // Hidden column — required for sorting by timestamp
      id: "created_at_ts",
      accessorKey: "created_at_ts",
    },
    {
      header: "Image",
      accessorKey: "image",
      cell: ({ row }) => {
        let src = row.original.image;
        if (src && typeof src === "string") {
          if (!src.startsWith("http") && !src.startsWith("blob:") && !src.startsWith("data:") && !src.startsWith("cars/")) {
            src = `http://127.0.0.1:8000/storage/${src}`;
          }
        } else {
          src = null;
        }
        return src ? (
          <img src={src} alt={row.original.name} className="w-16 h-10 object-cover rounded-md border" />
        ) : (
          <div className="w-16 h-10 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 border">N/A</div>
        );
      },
    },

    { header: "Model", accessorKey: "model" },
    {
      header: ({ column }) => (
        <div className="flex items-center -ml-4">
          <Button
            variant="ghost"
            className="px-0 flex items-center justify-start gap-2 hover:bg-gray-100 font-medium whitespace-nowrap"
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
        </div>
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
      columnVisibility: {
        created_at_ts: false,
      },
    },
    getRowId: (row) => String(row.id),
    state: {
      rowSelection,
      globalFilter,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    autoResetPageIndex: true,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Manage Cars"
          subtitle="Inventory and vehicle control"
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 md:px-0">
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Manage Cars
            </h1>
            <Button
              onClick={() => { setEditingCar(null); setModalOpen(true); }}
              className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
            >
              Add New vehicle
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-2 md:px-0">
                <div className="relative flex-1 max-w-sm">
                  <Input
                    placeholder="Search vehicles..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full bg-white shadow-sm"
                  />
                </div>
                <BulkActions
                  selected={rowSelection}
                  onDelete={deleteSelected}
                  onPublish={bulkPublish}
                />
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mx-2 md:mx-0">
                <div className="overflow-x-auto">
                  <table className="min-w-[1000px] w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"
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
                    <tbody className="divide-y divide-slate-100">
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-4 text-sm text-slate-600">
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

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-medium text-slate-500">
                    Showing Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="flex-1 sm:flex-none"
                    >
                      Previous
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="flex-1 sm:flex-none"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          <CarFormModal
            open={modalOpen}
            onClose={() => { setEditingCar(null); setModalOpen(false); }}
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
