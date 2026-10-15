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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { statusDot } from "@/components/shared/status";
import { useState, useEffect, useCallback } from "react";
import { carsDashData } from "../assets/data";
import Sidebar from "@/components/admin/Sidebar";
import TopNav from "@/components/admin/TopNav";
import CarFormModal from "@/components/manageCar/carFormModel";
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
  const [sorting, setSorting] = useState([]);

  const fetchCars = useCallback(() => {
    if (!token) {
      setCars(carsDashData);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("http://127.0.0.1:8000/api/cars/admin", {
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
  }, [token]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  function saveCar() {
    // Refetch fresh data from backend to ensure images and all fields are in sync
    fetchCars();
  }

  async function deleteCarRequest(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/cars/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error(`Failed to delete car ${id}`);
    return true;
  }

  async function restoreCarRequest(id) {
    const response = await fetch(
      `http://127.0.0.1:8000/api/cars/${id}/restore`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) throw new Error(`Failed to restore car ${id}`);
    return true;
  }

  // The backend endpoint toggles publish state, so only call it for cars that
  // are not already in the desired state.
  async function togglePublishRequest(id) {
    const response = await fetch(
      `http://127.0.0.1:8000/api/cars/${id}/publish`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok)
      throw new Error(`Failed to toggle publish status for ${id}`);
    return true;
  }

  async function deleteSelected() {
    const ids = Object.keys(rowSelection);
    if (!ids.length) return;

    const removed = cars.filter((car) => ids.includes(String(car.id)));

    try {
      await Promise.all(ids.map((id) => deleteCarRequest(id)));

      setCars((prev) => prev.filter((c) => !ids.includes(String(c.id))));
      setRowSelection({});

      const toastId = `bulk-delete-${Date.now()}`;
      toast(`${removed.length} car(s) deleted`, {
        id: toastId,
        description: "You can undo this action",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.dismiss(toastId);
              undoDelete(removed.map((car) => car.id));
            }}
          >
            Undo
          </Button>
        ),
      });
    } catch (error) {
      console.error("Failed to delete selected cars:", error);
      toast.error("Failed to delete the selected cars");
      fetchCars();
    }
  }

  async function undoDelete(ids) {
    try {
      await Promise.all(ids.map((id) => restoreCarRequest(id)));
      setRowSelection({});
      table.setPageIndex(0);
      fetchCars();
      toast("Cars restored successfully");
    } catch (error) {
      console.error("Failed to restore cars:", error);
      toast.error("Failed to restore the cars");
      fetchCars();
    }
  }

  // "Publish"/"Draft" for the selected rows. The API toggles the state, so only
  // the cars that are not already in the requested state are sent.
  async function bulkPublish(value) {
    const ids = Object.keys(rowSelection);
    if (!ids.length) return;

    const targets = cars.filter(
      (car) => ids.includes(String(car.id)) && car.published !== value,
    );

    if (!targets.length) {
      setRowSelection({});
      toast(value ? "Already published" : "Already in draft");
      return;
    }

    const targetIds = targets.map((car) => String(car.id));

    try {
      await Promise.all(targets.map((car) => togglePublishRequest(car.id)));

      setCars((prev) =>
        prev.map((c) =>
          targetIds.includes(String(c.id)) ? { ...c, published: value } : c,
        ),
      );
      setRowSelection({});
      toast(value ? "Cars published" : "Cars moved to draft");
    } catch (error) {
      console.error("Failed to update publish state:", error);
      toast.error("Failed to update the selected cars");
      fetchCars();
    }
  }

  async function deleteCar(id) {
    try {
      await deleteCarRequest(id);

      setCars((prev) => prev.filter((c) => String(c.id) !== String(id)));

      const toastId = `delete-${id}-${Date.now()}`;
      toast("Car deleted", {
        id: toastId,
        description: "You can undo this action",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.dismiss(toastId);
              undoDelete([id]);
            }}
          >
            Undo
          </Button>
        ),
      });
    } catch (error) {
      console.error("Failed to delete car:", error);
      toast.error("Failed to delete the car");
      fetchCars();
    }
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
      prev.map((c) => (c.id === id ? { ...c, published: !c.published } : c)),
    );

    try {
      await togglePublishRequest(id);

      toast.success(
        previousPublishedState
          ? "Car moved to draft"
          : "Car published successfully",
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update status. Reverting change.");

      // Revert the optimistic update on failure
      setCars((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, published: previousPublishedState } : c,
        ),
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
          className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
        />
      ),
    },
    {
      header: ({ table }) => {
        const sorting = table.getState().sorting[0];
        const isSorted =
          sorting?.id === "name" || sorting?.id === "created_at_ts";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500 hover:bg-transparent hover:text-stone-900"
              >
                Car
                {isSorted ? (
                  sorting?.desc ? (
                    <ArrowDown className="w-4 h-4 text-amber-700" />
                  ) : (
                    <ArrowUp className="w-4 h-4 text-amber-700" />
                  )
                ) : (
                  <ArrowUpDown className="w-4 h-4 text-stone-400" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "name", desc: false }])}
              >
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => table.setSorting([{ id: "name", desc: true }])}
              >
                Alphabetical (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.setSorting([{ id: "created_at_ts", desc: true }])
                }
              >
                Time Added (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.setSorting([{ id: "created_at_ts", desc: false }])
                }
              >
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
          if (
            !src.startsWith("http") &&
            !src.startsWith("blob:") &&
            !src.startsWith("data:") &&
            !src.startsWith("cars/")
          ) {
            src = `http://127.0.0.1:8000/storage/${src}`;
          }
        } else {
          src = null;
        }
        return src ? (
          <img
            src={src}
            alt={row.original.name}
            className="w-16 h-10 object-cover rounded-[2px] border border-stone-200"
          />
        ) : (
          <div className="w-16 h-10 bg-stone-100 rounded-[2px] flex items-center justify-center text-[10px] text-stone-400 border border-stone-200">
            N/A
          </div>
        );
      },
    },

    { header: "Model", accessorKey: "model" },
    {
      header: ({ column }) => (
        <div className="flex items-center -ml-4">
          <Button
            variant="ghost"
            className="px-0 flex items-center justify-start gap-2 hover:bg-transparent text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500 hover:text-stone-900 whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price / Day
            {column.getIsSorted() === "asc" && (
              <ArrowUp className="w-4 h-4 text-amber-700" />
            )}
            {column.getIsSorted() === "desc" && (
              <ArrowDown className="w-4 h-4 text-amber-700" />
            )}
            {!column.getIsSorted() && (
              <ArrowUpDown className="w-4 h-4 text-stone-400" />
            )}
          </Button>
        </div>
      ),
      accessorKey: "pricePerDay",
      cell: ({ getValue }) => (
        <span className="font-mono tabular-nums text-stone-900">₦{Number(getValue()).toLocaleString()}</span>
      ),
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
        <span className="inline-flex items-center gap-2 text-xs font-medium text-stone-700">
          <span
            className={`h-1.5 w-1.5 rounded-[1px] ${statusDot(row.original.published ? "published" : "draft")}`}
          />
          {row.original.published ? "Published" : "Draft"}
        </span>
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
    <div className="dashboard-container flex flex-col lg:flex-row min-h-screen bg-stone-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-3 md:p-6 lg:p-8 space-y-6 overflow-hidden">
        <TopNav
          title="Manage Cars"
          subtitle="Inventory and vehicle control"
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 md:px-0">
            <Button
              onClick={() => {
                setEditingCar(null);
                setModalOpen(true);
              }}
              className="w-full block ml-auto sm:w-auto rounded-[2px] bg-amber-500 text-black hover:bg-amber-400"
            >
              Add New vehicle
            </Button>
          </div>

          {loading ? (
            <div className="rounded-[2px] border border-stone-200 bg-white p-5 space-y-3 animate-pulse" aria-label="Loading vehicles">
              <div className="h-9 w-full max-w-sm rounded-[2px] bg-stone-100" />
              <div className="h-10 rounded-[2px] bg-stone-100" />
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-14 rounded-[2px] bg-stone-100" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-2 md:px-0">
                <div className="relative flex-1 max-w-sm">
                  <Input
                    placeholder="Search vehicles..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full bg-white border-stone-200 rounded-[2px] focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <BulkActions
                  selected={rowSelection}
                  onDelete={deleteSelected}
                  onPublish={bulkPublish}
                />
              </div>

              {/* Table */}
              <div className="bg-white rounded-[2px] border border-stone-200 overflow-hidden mx-2 md:mx-0">
                <div className="overflow-x-auto">
                  <table className="min-w-[1000px] w-full text-left">
                    <thead className="border-b border-stone-200">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-4 text-[11px] font-medium text-stone-500 uppercase tracking-[0.16em]"
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
                        <tr
                          key={row.id}
                          className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-4 text-sm text-stone-600"
                            >
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-stone-200">
                  <span className="text-xs font-mono tabular-nums uppercase tracking-[0.12em] text-stone-500">
                    Showing Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="flex-1 sm:flex-none rounded-[2px] border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                    >
                      Previous
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="flex-1 sm:flex-none rounded-[2px] border-stone-200 hover:bg-stone-50 hover:text-stone-900"
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
            onClose={() => {
              setEditingCar(null);
              setModalOpen(false);
            }}
            onSave={saveCar}
            car={editingCar}
          />
        </section>
      </div>
    </div>
  );
};

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium capitalize text-stone-700">
      <span className={`h-1.5 w-1.5 rounded-[1px] ${statusDot(status)}`} />
      {status || "unknown"}
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
    <div className="flex items-center gap-3 bg-white border border-stone-200 p-3 rounded-[2px]">
      <span className="font-mono text-xs tabular-nums uppercase tracking-[0.12em] text-stone-500">
        {Object.keys(selected).length} Selected
      </span>

      <Button size="sm" onClick={() => onPublish(true)} className="rounded-[2px] bg-amber-500 text-black hover:bg-amber-400">
        Publish
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="rounded-[2px] border-stone-200 hover:bg-stone-50 hover:text-stone-900"
        onClick={() => onPublish(false)}
      >
        Draft
      </Button>

      <Button size="sm" variant="destructive" onClick={onDelete} className="rounded-[2px]">
        Delete
      </Button>
    </div>
  );
}
